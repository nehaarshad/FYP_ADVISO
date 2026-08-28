import courseNameMatcher from '../utils/courseMapping.js';
import timeConflict from '../utils/timeConflict.js';

const DEGREE_TOTAL_CREDITS = 100; 
const FYP_ELIGIBLE_SEMESTER = 6;

const RESTRICTED_STATUSES = ['relegated', 'serious warning'];

const offeringCredits = (o) => o.credits ?? o.courseCredits ?? 0;
const offeringCategory = (o) => o.categoryName ?? o.CategoryModel?.categoryName ?? '';
const offeringProgramName = (o) => o.ProgramModel?.programName ?? o.programName ?? null;
const offeringProgramId = (o) => o.ProgramModel?.id ?? o.programId ?? null;
const isElectiveCategory = (categoryName) => !!categoryName && categoryName.trim().endsWith('Elective');
const isCoreCategory = (categoryName) => !!categoryName && !categoryName.trim().endsWith('Elective');

function creditsOf(courseAnalysis) {
  return courseAnalysis.creditHours ?? courseAnalysis.credits ?? 0;
}

// Best-matching offering for a course name, anywhere in this session. 
function findOffering(courseName, offeredCourses) {
  return courseNameMatcher.findBestMatch(courseName, offeredCourses);
}

// Best-matching offering for a course name, restricted to programs OTHER than `excludeProgramId`. */
function findOfferingInOtherProgram(courseName, offeredCourses, excludeProgramId) {
  const candidates = offeredCourses.filter(o => offeringProgramId(o) !== excludeProgramId);
  return courseNameMatcher.findBestMatch(courseName, candidates);
}

/**
 * Find a clash-free elective substitute from the roadmap for the student's
 * current semester + program, that is (a) not already completed, (b) actually
 * offered this session, and (c) doesn't clash with anything already placed.
 * `excludeNames` lets us avoid re-suggesting a course we already placed.
 */
function findElectiveSubstitute({ roadmapCourses, offeredCourses, currentSemester, placedTimetables, excludeNames }) {
  const candidates = roadmapCourses.filter(c =>
    !c.isCompleted &&
    isElectiveCategory(c.categoryName) &&
    c.semester === currentSemester &&
    !excludeNames.has(c.courseName.toLowerCase())
  );

  for (const candidate of candidates) {
    const match = findOffering(candidate.courseName, offeredCourses);
    if (!match) continue;
    if (timeConflict.hasClash(match.offering.timetables, placedTimetables)) continue;
    return { courseName: candidate.courseName, credits: candidate.credits, offering: match.offering };
  }
  return null;
}

// ---------------------------------------------------------------------
// Rule 1: resolve a single F/W/D course into a placed recommendation
// (offered as-is / offered under another program / substituted / not offered)
// ---------------------------------------------------------------------
function resolveRetakeCourse({ course, offeredCourses, roadmapCourses, currentSemester, currentProgramId, placedTimetables, placedNames }) {
  const base = {
    courseId: null,
    courseName: course.courseName,
    credits: creditsOf(course),
    category: course.category || null,
    isOffered: false,
    offeredProgram: null,
    timeSlot: null,
    actionRequired: 'RETAKE',
    substituteCourses: [],
    reason: '',
  };

  const match = findOffering(course.courseName, offeredCourses);

  if (!match) {
    return {
      ...base,
      actionRequired: 'REQUEST_SPECIAL_OFFERING',
      reason: `"${course.courseName}" is not offered this session. Since it is required by your degree roadmap, submit an application requesting the coordinator offer it.`,
    };
  }

  const offering = match.offering;
  const clash = timeConflict.hasClash(offering.timetables, placedTimetables);

  if (!clash) {
    placedTimetables.push(...(offering.timetables || []));
    placedNames.add(course.courseName.toLowerCase());
    return {
      ...base,
      courseId: offering.id,
      isOffered: true,
      offeredProgram: offeringProgramName(offering),
      timeSlot: timeConflict.formatTimetable(offering.timetables),
      reason: `Retake required (${course.status || 'previous attempt not passed'}).`,
    };
  }

  // Clash: try the same course under a different program/batch first
  const altMatch = findOfferingInOtherProgram(course.courseName, offeredCourses, currentProgramId);
  if (altMatch && !timeConflict.hasClash(altMatch.offering.timetables, placedTimetables)) {
    placedTimetables.push(...(altMatch.offering.timetables || []));
    placedNames.add(course.courseName.toLowerCase());
    return {
      ...base,
      courseId: altMatch.offering.id,
      isOffered: true,
      offeredProgram: offeringProgramName(altMatch.offering),
      timeSlot: timeConflict.formatTimetable(altMatch.offering.timetables),
      actionRequired: 'RETAKE_OTHER_PROGRAM',
      reason: `Time clash in your own program's section — register this course under the ${offeringProgramName(altMatch.offering)} program/batch instead to avoid the clash.`,
    };
  }

  // No clash-free alternate offering — substitute an elective
  const substitute = findElectiveSubstitute({
    roadmapCourses, offeredCourses, currentSemester,
    placedTimetables, excludeNames: placedNames,
  });

  if (substitute) {
    placedTimetables.push(...(substitute.offering.timetables || []));
    placedNames.add(substitute.courseName.toLowerCase());
    return {
      ...base,
      isOffered: true,
      actionRequired: 'SUBSTITUTE',
      substituteCourses: [substitute.courseName],
      offeredProgram: offeringProgramName(substitute.offering),
      timeSlot: timeConflict.formatTimetable(substitute.offering.timetables),
      reason: `"${course.courseName}" clashes with your other required courses and no clash-free section exists in another program. Substituted with elective "${substitute.courseName}" from your roadmap.`,
    };
  }

  return {
    ...base,
    isOffered: true,
    offeredProgram: offeringProgramName(offering),
    timeSlot: timeConflict.formatTimetable(offering.timetables),
    actionRequired: 'UNRESOLVED_CLASH',
    reason: `"${course.courseName}" clashes with other required courses. No alternate-program section or clash-free elective substitute was found — please consult your advisor.`,
  };
}

// ---------------------------------------------------------------------
// Priority classification for non-restricted mode
// ---------------------------------------------------------------------
function classifyRetakePriority(course, roadmapByName) {
  const rc = roadmapByName.get(course.courseName.toLowerCase());
  const category = course.category || rc?.categoryName || '';
  const isPrereqOfOthers = (rc?.dependentCourses?.length || 0) > 0;

  if (isPrereqOfOthers) return 'critical';
  if (!isElectiveCategory(category)) return 'high';
  return 'medium'; // elective F/W — substitutable
}

function classifyNewCoursePriority(roadmapCourse) {
  const isPrereqOfOthers = (roadmapCourse.dependentCourses?.length || 0) > 0;
  return isPrereqOfOthers ? 'high' : 'medium';
}

function allocateByCredits(orderedItems, allowedCredits) {
  let used = 0;
  const included = [];
  const deferred = [];
  for (const item of orderedItems) {
    const c = item.credits || 0;
    if (used + c <= allowedCredits) {
      included.push(item);
      used += c;
    } else {
      deferred.push(item);
    }
  }
  return { included, deferred, used };
}

// ---------------------------------------------------------------------
// Rule 5: FYP eligibility check at semester 6
// ---------------------------------------------------------------------
function computeCompletedCredits(suggestedCourses) {
  const passing = [
    ...(suggestedCourses.completedCourses || []),
    ...(suggestedCourses.dGradedCourses || []), // D still earns credit, just flagged for improvement
  ];
  return passing.reduce((sum, c) => sum + (creditsOf(c) || 0), 0);
}

function buildFypEligibilityWarning({ currentSemester, suggestedCourses, suggestedCreditsTotal, roadmapCourses, offeredCourses, placedTimetables, placedNames }) {
  if (currentSemester !== FYP_ELIGIBLE_SEMESTER) return null;

  const completedCredits = computeCompletedCredits(suggestedCourses);
  const projectedTotal = completedCredits + suggestedCreditsTotal;

  if (projectedTotal === DEGREE_TOTAL_CREDITS) return null;

  const extraElective = findElectiveSubstitute({
    roadmapCourses, offeredCourses, currentSemester,
    placedTimetables, excludeNames: placedNames,
  });

  return {
    completedCredits,
    suggestedCreditsTotal,
    projectedTotal,
    requiredTotal: DEGREE_TOTAL_CREDITS,
    message: projectedTotal < DEGREE_TOTAL_CREDITS
      ? `Your completed credits (${completedCredits}) plus this semester's suggested credits (${suggestedCreditsTotal}) total ${projectedTotal}, short of the ${DEGREE_TOTAL_CREDITS} required before FYP-1. Submit an application to register extra credit hours` +
        (extraElective ? ` and take the elective "${extraElective.courseName}" from your roadmap (no time clash with your other suggested courses) to reach eligibility for FYP-1 next semester.` : `. No additional clash-free roadmap elective was found this session — consult your advisor about options.`)
      : `Your completed credits (${completedCredits}) plus this semester's suggested credits (${suggestedCreditsTotal}) total ${projectedTotal}, above the ${DEGREE_TOTAL_CREDITS} required. Confirm with your advisor which courses are actually required before registering.`,
    suggestedExtraElective: extraElective ? extraElective.courseName : null,
  };
}

// ---------------------------------------------------------------------
// Rule 6: core-course failure -> likely extra semester
// ---------------------------------------------------------------------
function buildExtraSemesterWarning(suggestedCourses) {
  const failedCore = (suggestedCourses.failedCourses || []).filter(c => isCoreCategory(c.category));
  if (!failedCore.length) return null;

  return {
    failedCoreCourses: failedCore.map(c => c.courseName),
    message: `You have failed core course(s): ${failedCore.map(c => c.courseName).join(', ')}. Core courses generally aren't substitutable, so clearing all of them may require registering an additional semester (e.g. Semester 9) before you can graduate.`,
  };
}

// ---------------------------------------------------------------------
// MAIN ENTRY POINT
// ---------------------------------------------------------------------
/**
 * @param {Object} ctx
 * @param {Object} ctx.student            Sequelize student row (needs currentSemester)
 * @param {Object} ctx.degreeTranscript   needs currentCGPA
 * @param {string} ctx.studentStatus      e.g. "Relegated" / "Promoted on 1st Probation" / "Serious Warning" / "Promoted"
 * @param {Object} ctx.suggestedCourses   output of transcriptAnalyzer.analyzeTranscript
 * @param {Array}  ctx.offeredCourses     CourseOfferingModel rows (with .timetables, .ProgramModel, .BatchModel attached)
 * @param {Array}  ctx.roadmapCourses     output of mapCourseOfferingsWithUnClearRoadmap
 * @param {number} ctx.allowedCredits     from getCreditHours(cgpa)
 * @param {string} ctx.program            student's program name
 */
function generateRecommendations(ctx) {
  const {
    student,
    degreeTranscript,
    studentStatus,
    suggestedCourses,
    offeredCourses,
    roadmapCourses,
    allowedCredits,
    program,
  } = ctx;

  const currentSemester = student.currentSemester;
  const cgpa = parseFloat(degreeTranscript.currentCGPA) || 0;
  const statusLower = (studentStatus || '').toLowerCase();
  const currentProgramId = offeredCourses.find(o => offeringProgramName(o) === program) ? offeredCourses.find(o => offeringProgramName(o) === program).ProgramModel?.id : null;

  // Rule 1 gate: no new courses at all, only F/D/W retakes
  const isRestricted = cgpa < 2.0 || RESTRICTED_STATUSES.some(s => statusLower.includes(s));

  const roadmapByName = new Map(roadmapCourses.map(c => [c.courseName.toLowerCase(), c]));

  const placedTimetables = [];
  const placedNames = new Set();

  const fwdCourses = [
    ...(suggestedCourses.failedCourses || []).map(c => ({ ...c, __grade: 'F' })),
    ...(suggestedCourses.withdrawnCourses || []).map(c => ({ ...c, __grade: 'W' })),
    ...(suggestedCourses.dGradedCourses || []).map(c => ({ ...c, __grade: 'D' })),
  ];

  const recommendations = { critical: [], high: [], medium: [], low: [] };
  const specialRequests = [];

  const pushResolved = (course, resolved, priority) => {
    const entry = { ...resolved, courseName: course.courseName, category: resolved.category || course.category || null };
    recommendations[priority].push(entry);
    if (entry.actionRequired === 'REQUEST_SPECIAL_OFFERING') {
      specialRequests.push({
        courseName: course.courseName,
        reason: 'Not offered this session but required by roadmap',
        message: entry.reason,
      });
    }
  };

  // ---------------- Restricted mode: F/D/W ONLY ----------------
  if (isRestricted) {
    // F & W are mandatory; D is optional improvement, included only if credit room remains
    const mandatory = fwdCourses.filter(c => c.__grade === 'F' || c.__grade === 'W');
    const optional = fwdCourses.filter(c => c.__grade === 'D');

    let usedCredits = 0;
    for (const course of mandatory) {
      const resolved = resolveRetakeCourse({ course, offeredCourses, roadmapCourses, currentSemester, currentProgramId, placedTimetables, placedNames });
      const priority = course.__grade === 'F' ? 'critical' : 'high';
      pushResolved(course, resolved, priority);
      usedCredits += resolved.credits || 0;
    }
    for (const course of optional) {
      if (usedCredits + creditsOf(course) > allowedCredits) continue; // no room, skip
      const resolved = resolveRetakeCourse({ course, offeredCourses, roadmapCourses, currentSemester, currentProgramId, placedTimetables, placedNames });
      pushResolved(course, resolved, 'medium');
      usedCredits += resolved.credits || 0;
    }

    const totalCredits = ['critical', 'high', 'medium', 'low']
      .flatMap(p => recommendations[p])
      .reduce((s, c) => s + (c.credits || 0), 0);

    const overCreditWarning = totalCredits > allowedCredits
      ? `Mandatory retakes alone (${totalCredits} credits) exceed your allowed ${allowedCredits} credit hours — consult your advisor about which to prioritize.`
      : null;

    return {
      summary: {
        totalRequiredCredits: totalCredits,
        totalCreditsAllowed: allowedCredits,
        priorityBreakdown: {
          critical: recommendations.critical.length,
          high: recommendations.high.length,
          medium: recommendations.medium.length,
          low: recommendations.low.length,
        },
      },
      recommendations,
      creditAllocationScenarios: [{
        scenario: 1,
        totalCredits,
        courses: ['critical', 'high', 'medium'].flatMap(p => recommendations[p].map(c => c.courseName)),
        description: 'Restricted registration — only F/W (mandatory) and D (optional improvement) grade retakes, per academic status.',
      }],
      specialRequests,
      extraSemesterWarning: buildExtraSemesterWarning(suggestedCourses),
      fypEligibilityWarning: buildFypEligibilityWarning({
        currentSemester, suggestedCourses, suggestedCreditsTotal: totalCredits,
        roadmapCourses, offeredCourses, placedTimetables, placedNames,
      }),
      detailedExplanation: `Your CGPA (${cgpa}) / academic status (${studentStatus}) restricts you to retaking F, W, and D grade courses only — no new courses may be registered this session. ${overCreditWarning || ''}`.trim(),
    };
  }

  // ---------------- Normal mode: F/D/W prioritized + new roadmap courses ----------------
  for (const course of fwdCourses) {
    const resolved = resolveRetakeCourse({ course, offeredCourses, roadmapCourses, currentSemester, currentProgramId, placedTimetables, placedNames });
    const priority = course.__grade === 'D' ? 'medium' : classifyRetakePriority(course, roadmapByName);
    pushResolved(course, resolved, priority);
  }

  // New roadmap courses for the current semester, prereqs clear, not already an F/D/W course
  const newCourseCandidates = roadmapCourses.filter(c =>
    !c.isCompleted &&
    !c.isFailed && !c.hasDGraded && !c.isWithdrawn &&
    c.semester === currentSemester &&
    c.prerequisiteStatus === 'CLEAR' &&
    !placedNames.has(c.courseName.toLowerCase())
  );

  for (const rc of newCourseCandidates) {
    const match = findOffering(rc.courseName, offeredCourses);
    if (!match) {
      specialRequests.push({
        courseName: rc.courseName,
        reason: 'Roadmap course not offered this session',
        message: `"${rc.courseName}" is on your semester-${currentSemester} roadmap but isn't offered this session. Submit an application requesting the coordinator offer it.`,
      });
      continue;
    }
    if (timeConflict.hasClash(match.offering.timetables, placedTimetables)) {
      continue; // skip silently; credit-capping step below won't see it anyway
    }
    placedTimetables.push(...(match.offering.timetables || []));
    placedNames.add(rc.courseName.toLowerCase());
    const priority = classifyNewCoursePriority(rc);
    recommendations[priority].push({
      courseId: match.offering.id,
      courseName: rc.courseName,
      credits: rc.credits,
      category: rc.categoryName,
      reason: 'New roadmap course for your current semester.',
      isOffered: true,
      offeredProgram: offeringProgramName(match.offering),
      timeSlot: timeConflict.formatTimetable(match.offering.timetables),
      actionRequired: 'NEW',
      substituteCourses: [],
    });
  }

  // Cap everything to allowedCredits, priority order: critical > high > medium > low
  const orderedAll = [
    ...recommendations.critical.map(c => ({ ...c, __priority: 'critical' })),
    ...recommendations.high.map(c => ({ ...c, __priority: 'high' })),
    ...recommendations.medium.map(c => ({ ...c, __priority: 'medium' })),
    ...recommendations.low.map(c => ({ ...c, __priority: 'low' })),
  ];
  const { included, deferred, used } = allocateByCredits(orderedAll, allowedCredits);

  const finalRecommendations = { critical: [], high: [], medium: [], low: [] };
  for (const item of included) {
    const { __priority, ...rest } = item;
    finalRecommendations[__priority].push(rest);
  }

  const fypEligibilityWarning = buildFypEligibilityWarning({
    currentSemester, suggestedCourses, suggestedCreditsTotal: used,
    roadmapCourses, offeredCourses, placedTimetables, placedNames,
  });

  return {
    summary: {
      totalRequiredCredits: used,
      totalCreditsAllowed: allowedCredits,
      priorityBreakdown: {
        critical: finalRecommendations.critical.length,
        high: finalRecommendations.high.length,
        medium: finalRecommendations.medium.length,
        low: finalRecommendations.low.length,
      },
    },
    recommendations: finalRecommendations,
    creditAllocationScenarios: [{
      scenario: 1,
      totalCredits: used,
      courses: orderedAllNames(finalRecommendations),
      description: `Priority-ordered registration within your ${allowedCredits} allowed credit hours.`,
    }, ...(deferred.length ? [{
      scenario: 2,
      totalCredits: used + deferred.reduce((s, c) => s + (c.credits || 0), 0),
      courses: [...orderedAllNames(finalRecommendations), ...deferred.map(c => c.courseName)],
      description: 'Everything eligible, ignoring the credit-hour cap (for advisor reference only).',
    }] : [])],
    specialRequests,
    extraSemesterWarning: buildExtraSemesterWarning(suggestedCourses),
    fypEligibilityWarning,
    detailedExplanation: `Recommendations prioritize failed/withdrawn courses (especially prerequisites blocking your roadmap), then D-grade improvements, then new semester-${currentSemester} courses, capped at ${allowedCredits} allowed credit hours.`,
  };
}

function orderedAllNames(buckets) {
  return ['critical', 'high', 'medium', 'low'].flatMap(p => buckets[p].map(c => c.courseName));
}

export default { generateRecommendations };
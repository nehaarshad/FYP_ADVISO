import isElectiveCourse from "./isElectiveCourse.js";

const normalizeEntry = (entry) => {
  if (!entry || typeof entry !== 'object') return entry;

  const alternative = entry.alternative || null;
  const clashRecord = entry.clashRecord || null;

  const credits =
    (entry.credits != null && entry.credits > 0)
      ? entry.credits
      : (entry.creditHours != null && entry.creditHours > 0)
      ? entry.creditHours
      : (alternative?.credits != null && alternative.credits > 0)
      ? alternative.credits
      : (clashRecord?.credits != null && clashRecord.credits > 0)
      ? clashRecord.credits
      : 0;

  const category =
    entry.category ||
    entry.categoryName ||
    alternative?.category ||
    alternative?.categoryName ||
    clashRecord?.category ||
    clashRecord?.categoryName ||
    null;

  // originalCourseName: always the roadmap/parent name
  const originalCourseName =
    entry.originalCourseName ||
    alternative?.originalCourseName ||
    clashRecord?.originalCourseName ||
    entry.courseName ||
    null;

  return {
    ...entry,
    credits,
    category,
    originalCourseName,
  };
};

const getPriority = (course) => {
  const isPrereq = (course.dependentCourses?.length || 0) > 0;
  const isCore = course.categoryName && !isElectiveCourse(course);
  if (isPrereq || course.__grade === 'F') return 'critical';
  if (isCore || course.__grade === 'W') return 'high';
  return 'medium';
};

const getAllCourseNames = (buckets) =>
  ['critical', 'high', 'medium', 'low'].flatMap(p =>
    (buckets[p] || []).map(c => c.courseName)
  );

const normalizeBuckets = (buckets) => {
  for (const p of ['critical', 'high', 'medium', 'low']) {
    if (Array.isArray(buckets[p])) {
      buckets[p] = buckets[p].map(normalizeEntry);
    }
  }
  return buckets;
};

export default {
  getAllCourseNames,
  getPriority,
  normalizeBuckets,    
  normalizeEntry,
};
// utils/timeConflict.js
//
// Small, dependency-free helper for detecting overlaps between TimetableModel
// rows. Assumes each timetable row has SOME day field (day / dayOfWeek) and
// SOME start/end time fields (startTime / endTime) as "HH:MM", "HH:MM:SS",
// or a Date/ISO string. Adjust the field names in `getDay`/`toMinutes` below
// if your TimetableModel uses different column names.

function getDay(slot) {
  const raw = slot?.day ?? slot?.dayOfWeek ?? slot?.weekDay ?? null;
  return raw ? String(raw).trim().toLowerCase() : '';
}

function toMinutes(value) {
  if (value == null) return null;

  if (value instanceof Date) {
    return value.getHours() * 60 + value.getMinutes();
  }

  const str = String(value).trim();

  // Handles "HH:MM", "HH:MM:SS", and ISO strings like "2024-01-01T09:30:00"
  const isoMatch = str.match(/T?(\d{1,2}):(\d{2})/);
  if (isoMatch) {
    return parseInt(isoMatch[1], 10) * 60 + parseInt(isoMatch[2], 10);
  }

  return null;
}

/**
 * Do two individual timetable slots overlap?
 * Same day required (if either side is missing a day, we can't rule out a
 * clash, so we fall back to comparing times only — adjust if that's too
 * permissive for your data).
 */
function slotsOverlap(a, b) {
  if (!a || !b) return false;

  const dayA = getDay(a);
  const dayB = getDay(b);
  if (dayA && dayB && dayA !== dayB) return false;

  const aStart = toMinutes(a.startTime);
  const aEnd = toMinutes(a.endTime);
  const bStart = toMinutes(b.startTime);
  const bEnd = toMinutes(b.endTime);

  if ([aStart, aEnd, bStart, bEnd].some(v => v == null)) return false;

  return aStart < bEnd && bStart < aEnd;
}

/**
 * Does ANY slot in timetablesA overlap with ANY slot in timetablesB?
 */
function hasClash(timetablesA = [], timetablesB = []) {
  for (const a of timetablesA) {
    for (const b of timetablesB) {
      if (slotsOverlap(a, b)) return true;
    }
  }
  return false;
}

/**
 * Human-readable rendering of a course's timetable, e.g.
 * "Mon 09:00-10:30, Wed 09:00-10:30"
 */
function formatTimetable(timetables = []) {
  if (!timetables.length) return null;
  return timetables
    .map(t => {
      const day = t.day ?? t.dayOfWeek ?? '';
      const start = t.startTime ?? '';
      const end = t.endTime ?? '';
      const room = t.room ?? t.venue ?? null;
      const base = `${day} ${start}-${end}`.trim();
      return room ? `${base} (${room})` : base;
    })
    .join(', ');
}

export default { slotsOverlap, hasClash, formatTimetable, toMinutes };
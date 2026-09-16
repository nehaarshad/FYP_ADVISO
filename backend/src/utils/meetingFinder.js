import timeConflict from './timeConflict.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// 09:00 → 540, 15:30 → 930
const WINDOW_START = 9 * 60;
const WINDOW_END = 15 * 60 + 30;

const MIN_SLOT = 30;    // minutes
const MAX_SLOT = 60;    // minutes

const toMin = (t) => timeConflict.toMinutes(t);
const toHHMM = (m) => {
  const h = Math.floor(m / 60).toString().padStart(2, '0');
  const mm = (m % 60).toString().padStart(2, '0');
  return `${h}:${mm}:00`;   // match Sequelize TIME format
};

const mergeIntervals = (intervals) => {
  if (!intervals.length) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      out.push([s, e]);
    }
  }
  return out;
};

const freeGaps = (busy, windowStart, windowEnd) => {
  const merged = mergeIntervals(busy);
  const gaps = [];
  let cursor = windowStart;
  for (const [s, e] of merged) {
    if (s > cursor) gaps.push([cursor, Math.min(s, windowEnd)]);
    cursor = Math.max(cursor, e);
    if (cursor >= windowEnd) break;
  }
  if (cursor < windowEnd) gaps.push([cursor, windowEnd]);
  return gaps;
};

const splitIntoSlots = (gaps) => {
  const slots = [];
  for (const [gapStart, gapEnd] of gaps) {
    const length = gapEnd - gapStart;
    if (length < MIN_SLOT) continue;

    let start = gapStart;
    while (start + MIN_SLOT <= gapEnd) {
      const preferredEnd = Math.min(start + MAX_SLOT, gapEnd);
      slots.push({
        startTime: toHHMM(start),
        endTime: toHHMM(preferredEnd),
        durationMinutes: preferredEnd - start,
      });
      start += 30; 
    }
  }
  return slots;
};


export const findFreeSlots = (advisorTimetables = [], batchTimetables = []) => {
  const result = [];

  for (const day of DAYS) {
    const busy = [];

    for (const t of advisorTimetables) {
      if (String(t.day).toLowerCase() !== day.toLowerCase()) continue;
      const s = toMin(t.startTime);
      const e = toMin(t.endTime);
      if (s != null && e != null) busy.push([s, e]);
    }

    for (const t of batchTimetables) {
      if (String(t.day).toLowerCase() !== day.toLowerCase()) continue;
      const s = toMin(t.startTime);
      const e = toMin(t.endTime);
      if (s != null && e != null) busy.push([s, e]);
    }

    const gaps = freeGaps(busy, WINDOW_START, WINDOW_END);
    const slots = splitIntoSlots(gaps);
    for (const s of slots) {
      result.push({ day, ...s });
    }
  }

  return result;
};

export default { findFreeSlots };
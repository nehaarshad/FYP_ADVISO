function getDay(slot) {
  const raw = slot?.day ?? slot?.dayOfWeek ?? slot?.weekDay ?? null;
  return raw ? String(raw).trim().toLowerCase() : '';
}

function toMinutes(value) {
  if (value == null) return null;

  if (value instanceof Date) {
    return value.getHours() * 60 + value.getMinutes();
  }

  const str = String(value).trim().toLowerCase();

  // --- HANDLE "noon" and "midnight" ---
  if (str === 'noon') return 12 * 60; // 12:00
  if (str === 'midnight') return 0;   // 00:00

  // --- HANDLE "2:00p", "2:30p", "12:00p" ---
  const ampmMatch = str.match(/^(\d{1,2}):(\d{2})\s*([ap])(?:\.?m?\.?)?$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const meridian = ampmMatch[3];

    if (meridian === 'p' && hours !== 12) hours += 12;
    if (meridian === 'a' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // --- HANDLE "2:00 PM", "02:30 PM" ---
  const fullAmpmMatch = str.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (fullAmpmMatch) {
    let hours = parseInt(fullAmpmMatch[1], 10);
    const minutes = parseInt(fullAmpmMatch[2], 10);
    const meridian = fullAmpmMatch[3];

    if (meridian === 'pm' && hours !== 12) hours += 12;
    if (meridian === 'am' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // ---  HANDLE "HH:MM:SS" format (24-hour with seconds) ---
  // This matches "02:00:00", "14:00:00", "08:30:00", etc.
  const timeWithSeconds = str.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (timeWithSeconds) {
    let hours = parseInt(timeWithSeconds[1], 10);
    const minutes = parseInt(timeWithSeconds[2], 10);
    
    // Rules:
    // - hours 1-6: PM (add 12) - these are afternoon/evening times
    // - hours 7-11: AM (keep as is) - these are morning times
    // - hours 12: PM (noon) - keep as 12
    // - hours 13-23: PM (already 24-hour format) - keep as is
    // - hours 0: Midnight (12 AM)
    
    if (hours >= 1 && hours <= 6) {
      hours += 12; // 1-6 → PM (13-18)
    }
    // hours 7-11 remain as is (AM)
    // hours 12 remains as 12 (PM)
    // hours 13-23 remain as is (PM)
    
    return hours * 60 + minutes;
  }

  // --- HANDLE "12:00" (24-hour format without seconds) ---
  const isoMatch = str.match(/T?(\d{1,2}):(\d{2})/);
  if (isoMatch) {
    return parseInt(isoMatch[1], 10) * 60 + parseInt(isoMatch[2], 10);
  }

  // --- HANDLE "1:00" without seconds (fallback) ---
  const simpleMatch = str.match(/^(\d{1,2}):(\d{2})$/);
  if (simpleMatch) {
    let hours = parseInt(simpleMatch[1], 10);
    const minutes = parseInt(simpleMatch[2], 10);
    
    // Apply same rule for hours 1-6
    if (hours >= 1 && hours <= 6) {
      hours += 12;
    }
    
    return hours * 60 + minutes;
  }

  return null;
}

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

function hasClash(timetablesA = [], timetablesB = []) {
  for (const a of timetablesA) {
    for (const b of timetablesB) {
      if (slotsOverlap(a, b)) return true;
    }
  }
  return false;
}

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
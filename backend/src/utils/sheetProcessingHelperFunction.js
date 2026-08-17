import REGEXS from "./regexs.js";

//to get cell color in ARGB format
function getCellColor(cell) {
  const f = cell.fill;
  if (f?.type === "pattern" && f.fgColor?.argb && f.fgColor.argb !== "00000000") {
    return f.fgColor.argb;
  }
  return null;
}

// Function to find the maximum number of consecutive empty cells in an array (row)
function maxConsecutiveEmptyCells(values) {
  let max = 0, cur = 0;
  for (const v of values) {
    const empty = v === null || v === undefined || String(v).trim() === "";
    cur = empty ? cur + 1 : 0;
    if (cur > max) max = cur;
  }
  return max;
}

// convert "Course Name (3+1)" → { name, credits } 
function parseCourse(raw) {
  const text = String(raw ?? "").replace(/\n/g, " ").trim(); //conert into string and trim
  const match = text.match(REGEXS.COURSE_CREDITS);
  console.log(`   Parsing course: "${text}" → match:`, match);
  if (match) {
   const credits = match[2] ? `${match[1]}+${match[2]}` : `${match[1]}`;
     console.log(`    course: "${text}" → credits:`, credits);
    return { name: text.slice(0, match.index).trim(), credits }; // "Course Name (3)" → { name: "Course Name", credits: 3 }, "Course Name (3+1)" → { name: "Course Name", credits: 4 }
  }
  return { name: text, credits: 0 }; // No credits found, return 0 for credits
}

 //convert per category credits -> "39 Credit Hrs." or plain "130" → number of credits
function parseCredits(raw) {
  const text = String(raw ?? "");
  const m = text.match(REGEXS.CREDITS_TEXT);
  if (m) return parseInt(m[1], 10); // extract number before string "Credit" or "Cr Hrs."
  const n = text.trim().match(REGEXS.NUMBER_ONLY);
  if (n) return parseInt(n[0], 10);
  return 0;
}

function getCellText(cell) {

    // Handle different cell value types
    if (typeof cell.value === 'string') {
      return cell.value.trim();
    }
    else if (typeof cell.value === 'number') {
      return cell.value.toString();
    }
    else if (cell.value && typeof cell.value === 'object') {
      // Handle rich text or formula results
      if (cell.value.richText) {
        // Rich text object - concatenate all text parts
        return cell.value.richText.map(part => part.text).join('').trim();
      }
      else if (cell.value.text) {
        return cell.value.text.trim();
      }
      else if (cell.value.result) {
        // Formula result
        return String(cell.value.result).trim();
      }
      else if (cell.value.formula) {
        // Formula without result
        return String(cell.value.formula).trim();
      }
      else {
        // Try to get any string representation
        console.log(`   Unknown object type:`, cell.value);
        return JSON.stringify(cell.value);
      }
    }
    
    return String(cell.value).trim();
  };

function parseTime(timeStr) {
    if (!timeStr) return null;
    
    let cleaned = timeStr.toString().trim().toLowerCase();
    
    // Handle "noon" and "midnight" special cases
    cleaned = cleaned.replace(/\bnoon\b/g, '12:00pm');
    cleaned = cleaned.replace(/\bmidnight\b/g, '12:00am');
    
    // Fix spaces around dash: "9:30a- 11:00" -> "9:30a - 11:00"
    cleaned = cleaned.replace(/\s*[-–]\s*/g, ' - ');
    
    // Split by dash
    if (cleaned.includes('-')) {
        const parts = cleaned.split('-');
        if (parts.length === 2) {
            const startTime = parts[0].trim();
            const endTime = parts[1].trim();
            
            // Handle "10:00a - noon" case where endTime might be "noon"
            const start24 = convertTo24Hour(startTime);
            const end24 = convertTo24Hour(endTime);
            
            if (start24 && end24) {
                return { start: start24, end: end24 };
            }
        }
    }
    
    // If no dash, try parsing as single time
    const singleTime = convertTo24Hour(cleaned);
    if (singleTime) {
        return { start: singleTime, end: null };
    }
    
    return null;
}

function convertTo24Hour(timeStr) {
    if (!timeStr) return null;
    
    let time = timeStr.toString().trim().toLowerCase();
    
    // Special cases
    const specialCases = {
        'noon': '12:00pm',
        'midnight': '12:00am',
        '12noon': '12:00pm',
        '12midnight': '12:00am'
    };
    
    if (specialCases[time]) {
        time = specialCases[time];
    }
    
    const timePattern = /^(\d{1,2})(?::(\d{2}))?\s*([ap]m?)?$/i;
    const match = time.match(timePattern);
    
    if (!match) {
        console.log(`   ⚠️ Could not parse time: "${timeStr}"`);
        return null;
    }
    
    let hours = parseInt(match[1]);
    let minutes = match[2] ? parseInt(match[2]) : 0;
    let period = match[3] ? match[3].toLowerCase() : '';
    
    // If no period specified, try to infer from context
    if (!period) {
        if (hours >= 0 && hours <= 11) {
            period = 'am';
        } else if (hours >= 13 && hours <= 23) {
            period = 'pm';
            hours = hours - 12;
        } else if (hours === 12) {
            period = 'pm';
        } else if (hours === 24) {
            hours = 0;
            period = 'am';
        } else {
            // Default to AM for hours 1-11 if no period
            period = 'am';
        }
    }
    
    // Convert to 24-hour
    if (period === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period === 'am' && hours === 12) {
        hours = 0;
    }
    
    // Validate
    if (isNaN(hours) || hours < 0 || hours > 23) {
        console.log(`   ⚠️ Invalid hours: ${hours} for time: "${timeStr}"`);
        return null;
    }
    
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        minutes = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}

function getProgramCode(str) {
    if (!str) return '';
    
    let text = str.toString().toLowerCase().trim();
    
    // Try multiple patterns
    const patterns = [
        // Pattern: "SE-7" or "SE 7" or "SE7" (single digit)
        /^([a-z]{2,3})[\s-]*(\d{1})(?!\d)/i,
        // Pattern: "SE71" (two digits)
        /^([a-z]{2,3})(\d{2})(?!\d)/i,
        // Pattern: "SE-71" (dash then two digits)
        /^([a-z]{2,3})[\s-]*(\d{2})(?!\d)/i,
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const prefix = match[1];  // "se"
            const number = match[2];  // "7" or "71"
            return `${prefix}${number}`;
        }
    }
    
    return '';
}

function cleanCourseName(str) {
    if (!str) return '';
    
    let cleaned = str.toString().toLowerCase().trim();
    
    // Remove program prefix patterns
    cleaned = cleaned.replace(/^[a-z]{2,3}[\s-]*\d+[\s-]*\d*\s*/i, '');
    cleaned = cleaned.replace(/^[a-z]{2,3}\d+[\s-]*\d*\s*/i, '');
    
    // Remove standalone numbers at start
    cleaned = cleaned.replace(/^\d+[\s-]*\d*\s*/, '');
    
    // Replace & with 'and'
    cleaned = cleaned.replace(/&/g, 'and');
    
    // Remove "and"
    cleaned = cleaned.replace(/\band\b/gi, '');
    
    // Remove special characters (keep letters, numbers, and spaces)
    cleaned = cleaned.replace(/[^a-z0-9\s]/g, '');
    
    // Remove extra spaces
    cleaned = cleaned.replace(/\s+/g, '');
    
    return cleaned;
}
function normalizeOfferingName(str) {
    if (!str) return '';
    
    const programCode = getProgramCode(str);
    const courseName = cleanCourseName(str);
    const type = getCourseType(str); // Get 'lec' or 'lab'
    
    if (programCode && courseName) {
        // Add type suffix if present
        const suffix = type ? type : '';
        return `${programCode}${courseName}${suffix}`;
    }
    return courseName || str.toLowerCase().replace(/[^a-z0-9]/g, '');
}
function getCourseType(str) {
    if (!str) return '';
    const lower = str.toLowerCase();
    if (lower.includes('(lab)') || lower.includes('lab)') || 
        lower.includes('laboratory') || lower.includes('(lab')) {
        return 'lab';
    }
    if (lower.includes('(lec)') || lower.includes('lec)') || 
        lower.includes('lecture') || lower.includes('(lec')) {
        return 'lec';
    }
    return '';
}

function splitCourseWithSlash(courseName) {
    if (!courseName) return [];
    
    const results = [];
    const programCode = getProgramCode(courseName);
    
    if (courseName.includes('/')) {
        const parts = courseName.split('/').map(p => p.trim());
        
        for (const part of parts) {
            const cleanedPart = cleanCourseName(part);
            if (programCode && cleanedPart) {
                results.push(`${programCode}${cleanedPart}`);
            } else if (cleanedPart) {
                results.push(cleanedPart);
            }
        }
    }
    
    results.push(normalizeOfferingName(courseName));
    
    return results.length > 0 ? results : [normalizeOfferingName(courseName)];
}

const getColumnIndex = (headers, headerName) => {
    if (!headers || !headerName) return null;
    
    for (let i = 1; i < headers.length; i++) {
        if (headers[i]) {
            const headerValue = headers[i].toString().trim().toLowerCase();
            const searchValue = headerName.toString().trim().toLowerCase();
            
            if (headerValue === searchValue) {
                console.log(`   Found header "${headerName}" at column ${i}`);
                return i;
            }
        }    }
    console.log(`   Header "${headerName}" not found`);
    return null;
};

const getCellByHeader = (headerName,headers,worksheet,i) => {
                const colIndex = getColumnIndex(headers, headerName);
                if (colIndex === null) {
                    return '';
                }
                try {
                    return getCellText(worksheet.getCell(i, colIndex));
                } catch (error) {
                    console.log(`Error accessing cell at row ${i}, column ${colIndex}:`, error.message);
                    return '';
                }
            };

export default { getCellColor,getCellByHeader,getColumnIndex,cleanCourseName, parseCourse, parseCredits, maxConsecutiveEmptyCells, getCellText, parseTime, getProgramCode, splitCourseWithSlash, normalizeOfferingName };
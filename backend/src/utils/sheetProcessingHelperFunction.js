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
  if (match) {
    const credits = parseInt(match[1], 10) + (match[2] ? parseInt(match[2], 10) : 0);// sum credits (3+1) → 4
    return { name: text.slice(0, match.index).trim(), credits }; // "Course Name (3)" → { name: "Course Name", credits: 3 }, "Course Name (3+1)" → { name: "Course Name", credits: 4 }
  }
  return { name: text, credits: 2 };
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
    if (!cell || !cell.value) return '';
    
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

  function parseTime (timeStr) {
    if (!timeStr) return null;
    
    let cleaned = timeStr.toString().trim().toLowerCase();
    
    // Handle formats like "1:00p - 2:30p" or "1:00p-2:30p"
    if (cleaned.includes('-')) {
        const parts = cleaned.split('-');
        if (parts.length === 2) {
            const startTime = parts[0].trim();
            const endTime = parts[1].trim();
            return { start: convertTo24Hour(startTime), end: convertTo24Hour(endTime) };
        }
    }
    return { start: convertTo24Hour(cleaned), end: null };
};

const convertTo24Hour = (timeStr) => {
      if (!timeStr) return null;
    
    let time = timeStr.toString().trim().toLowerCase();
    
    // Handle special cases
    const specialCases = {
        'noon': '12:00pm',
        'midnight': '12:00am',
        '12noon': '12:00pm',
        '12midnight': '12:00am'
    };
    
    if (specialCases[time]) {
        time = specialCases[time];
    }
    
    // Extract time components using regex
    // Matches patterns like: 1:00p, 1:00pm, 1p, 1pm, 1:00, etc.
    const timePattern = /(\d{1,2})(?::(\d{2}))?\s*([ap]m?)?/i;
    const match = time.match(timePattern);
    
    if (!match) {
        console.log(`      ❌ No time pattern matched for: "${timeStr}"`);
        return null;
    }
    
    let hours = parseInt(match[1]);
    let minutes = match[2] ? parseInt(match[2]) : 0;
    let period = match[3] ? match[3].toLowerCase() : '';
    
    // If no period specified, assume based on hours
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
        }
    }
    
    // Convert to 24-hour
    if (period === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period === 'am' && hours === 12) {
        hours = 0;
    }
    
    // Validate hours
    if (isNaN(hours) || hours < 0 || hours > 23) {
        console.log(`      ❌ Invalid hours: ${hours}`);
        return null;
    }
    
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        minutes = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

const getProgramCode = (str) => {
    if (!str) return '';
    
    let text = str.toString().toLowerCase().trim();
    
    // This regex captures ONLY the FIRST digit after the prefix
    // It stops at the first non-digit character (dash, space, or end)
    const match = text.match(/^([a-z]{2,3})[\s-]*(\d)/);
    
    if (match) {
        const prefix = match[1];  // "se"
        const firstNumber = match[2]; // "7" (only the first digit)
        return `${prefix}${firstNumber}`; // Returns "se7"
    }
    
    return '';
};
// Improved clean course name
const cleanCourseName = (str) => {
    if (!str) return '';
    
    let cleaned = str.toString().toLowerCase().trim();
    
    // Remove program prefix patterns:
    // SE7-1, SE-7-1, SE71, SE-7, SE7, SE 7
    cleaned = cleaned.replace(/^[a-z]{2,3}[\s-]*\d+[\s-]*\d*\s*/i, '');
    
    // Remove standalone numbers at start (like "7-1" or "71")
    cleaned = cleaned.replace(/^\d+[\s-]*\d*\s*/, '');
    
    // Replace & with 'and'
    cleaned = cleaned.replace(/&/g, 'and');
    
    // Remove special characters (keep letters, numbers, spaces, and hyphens)
    cleaned = cleaned.replace(/[^a-z0-9\s-]/g, '');
    
    // Remove extra spaces
    cleaned = cleaned.replace(/\s+/g, '');
    
    // Remove (merge)
    cleaned = cleaned.replace(/\(merge\)$/i, '');
    
    return cleaned;
};

const normalizeOfferingName = (str) => {
    if (!str) return '';
    
    const programCode = getProgramCode(str);
    const courseName = cleanCourseName(str);
    
    // If we found a program code, combine it with cleaned course name
    if (programCode) {
        return `${programCode}${courseName}`;
    }
    
    // If no program code found, try to infer from the course name
    // For "Internship II", we need to know which program it belongs to
    return courseName;
};

// Special handling for courses with "/"
const splitCourseWithSlash = (courseName) => {
    if (!courseName) return [];

    let normalized;
    
    // If contains "/", split it
    if (courseName.includes('/')) {
        const parts = courseName.split('/');
        const results = [];
        const programCode = getProgramCode(courseName);
        console.log(`   Course "${courseName}" contains "/". Splitting into parts:`, parts, `Program code: "${programCode}"`);
        for (const part of parts) {
                const cleanedPart = cleanCourseName(part);
                if (programCode && cleanedPart) {
                    normalized = `${programCode}${cleanedPart}`;
                
                }
            
            results.push(normalized);
       
              }

               return results;
            }
    
    
    return [normalizeOfferingName(courseName)];
};

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
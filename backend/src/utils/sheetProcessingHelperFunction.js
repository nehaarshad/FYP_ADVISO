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

export default { getCellColor, parseCourse, parseCredits, maxConsecutiveEmptyCells, getCellText };
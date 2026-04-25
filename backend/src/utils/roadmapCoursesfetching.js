import REGEXS from "./regexs.js";
import sheetProcessingHelperFunction from "./sheetProcessingHelperFunction.js";
const { getCellColor, parseCourse, getCellText ,maxConsecutiveEmptyCells} = sheetProcessingHelperFunction;

function extractCourses(worksheet, firstCourseRow, categories) {
  const maxCol = worksheet.columnCount;
  const maxRow = worksheet.rowCount;
  const courses = [];

  let lastDataRow = null;
  for (let row = maxRow; row >= 1; row--) {
    let hasData = false;
    for (let c = 1; c <= maxCol; c++) {
      const cell = worksheet.getCell(row, c);
    if (!cell.value) continue;
    const val = getCellText(cell);
    if (!val) continue;
    const color = getCellColor(cell);
    if (color && val && val.match(REGEXS.CREDITS_TEXT)) {
      hasData=true
    }
    }
    if (hasData) {
      lastDataRow = row;
      break;
    }
  }
  
  if (!lastDataRow) {
    throw new Error(`Sheet "${worksheet.name}": No data found in sheet.`);
  }
  
  console.log(`   Last row with data: ${lastDataRow}`);
  
  const finalCourseRow = lastDataRow - 2; //exclude credit cal cells //last row is empty row
  
  console.log(`Extracting courses from rows ${firstCourseRow} to ${finalCourseRow}`);
  
 for (let r = firstCourseRow; r <= finalCourseRow; r++) {
  // Collect all non-empty cells in this row
  const nonEmptyCells = [];
  
  for (let c = 1; c <= maxCol; c++) {
    const cell = worksheet.getCell(r, c);
    if (cell.value) {
      const rawText = String(cell.value).trim();
      if (rawText) {
        nonEmptyCells.push({ col: c, value: rawText, color: getCellColor(cell) });
      }
    }
  }
  
  // Skip rows with no data
  if (nonEmptyCells.length === 0) {
    console.log(`Row ${r} skipped (no data)`);
    continue;
  }
  
  // Skip rows that have very few courses (e.g., less than 2 courses)
  let courseCount = 0;
  for (const cell of nonEmptyCells) {
    const { name, credits } = parseCourse(cell.value);
    if (name && credits > 0) {
      courseCount++;
    }
  }
  
  if (courseCount < 2) {
    console.log(`Row ${r} skipped (only ${courseCount} valid courses found out of ${nonEmptyCells.length} cells)`);
    continue;
  }
  
  console.log(`Processing row ${r} with ${courseCount} courses`);
  
  // Process each non-empty cell
  for (const cell of nonEmptyCells) {
    const { name, credits } = parseCourse(cell.value);
    
    if (name && credits > 0) {
      let categoryName = null;
      if (cell.color) {
        categoryName = categories.find(cat => cat.color === cell.color)?.name || null;
      }
      
      courses.push({
        semesterNo: cell.col,
        courseName: name,
        credits,
        categoryName,
      });
      
      console.log(`  → Added: ${name} (${credits} cr) at semester ${cell.col}`);
    }
  }
}
  
  console.log(`Total courses extracted: ${courses.length}`,courses);
  return courses;
}

export default extractCourses;
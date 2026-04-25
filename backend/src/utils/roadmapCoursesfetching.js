import REGEXS from "./regexs.js";
import sheetProcessingHelperFunction from "./sheetProcessingHelperFunction.js";
const { getCellColor, parseCourse ,maxConsecutiveEmptyCells} = sheetProcessingHelperFunction;

function extractCourses(worksheet, firstCourseRow, categories) {
  const maxCol = worksheet.columnCount;
  const courses = [];
  const finalCourseRow = worksheet.rowCount - 2; //exclude credit cal cells //last row is empty row
  
  console.log(`Extracting courses from rows ${firstCourseRow} to ${finalCourseRow}`);
  
  for (let r = firstCourseRow; r <= finalCourseRow; r++) {
    // empty row  identifying logic: if more than 6 consecutive empty cells, skip the row
    const rawValues = Array.from({ length: maxCol }, (_, i) =>
      worksheet.getCell(r, i + 1).value
    );
    
    // Skip rows with too many empty cells
    if (maxConsecutiveEmptyCells(rawValues) > 6) {
      console.log(`........Row ${r} skipped (>6 consecutive empty cells)`);
      continue;
    }
    
    // Track if row has any course data
    let hasCourseData = false;
    
    for (let c = 1; c <= maxCol; c++) {
      const cell = worksheet.getCell(r, c);
      if (!cell.value) continue;
      
      console.log(`Processing cell R${r}C${c}: "${cell.value} with datatype ${typeof cell.value}"`);
      const rawText = String(cell.value).trim();
      const color = getCellColor(cell);
      
      // Skip empty or whitespace-only cells
      if (!rawText) continue;
      
      // Get semester number from column index
      const semesterNo = c; // Assuming each column represents a semester
      
      // Parse course name and credits
      const { name, credits } = parseCourse(rawText);
      
      // Get category name based on cell color
      let categoryName = null;
      let categoryColor = null;
      
        if (color) {
          categoryName = categories.find(cat => cat.color === color)?.name || null;
        }

      categoryColor = color;
      hasCourseData = true;
      
      
      courses.push({
        semesterNo,
        courseName: name,
        credits,
        categoryName,
      });
      
      hasCourseData = false;
    }
  }
  
  console.log(`Total courses extracted: ${courses.length}`,courses);
  return courses;
}

export default extractCourses;
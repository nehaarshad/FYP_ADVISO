import REGEXS from "./regexs.js";
import sheetProcessingHelperFunction from "./sheetProcessingHelperFunction.js";
const { parseCredits } = sheetProcessingHelperFunction;

function detectSemesters(worksheet, semesterHeaderRow) {
  const maxCol = worksheet.columnCount;
  const r = semesterHeaderRow;
    const semCells = [];

    // semester no
    for (let c = 1; c <= maxCol; c++) {
      const cell = worksheet.getCell(r, c); //row 1 col 1 sem1
      console.log(`Checking cell ${r},${c} with value "${cell.value}" for semester label...`);
      const val = String(cell.value ?? "").trim();
      console.log(`Extracted value for cell ${r},${c}: "${val}"`);
      if(!val){
        break;
      }
      if (REGEXS.SEMESTER_LABEL.test(val)) {
        semCells.push({ col: c, label: val });
        console.log(`   Found semester label: "${val}" at column ${c}`);
      }
        console.log(`   Cell ${r},${c} did not match semester label pattern.`);
    }
    
    console.log(`Total semester labels found: ${semCells.length}`);
    // semester req. credits for reqgular students
    if (semCells.length >= 5) {
      const creditRow = r + 1;
      const semesters = [];
      
      
      for (const { col, label } of semCells) {
        const creditCell = worksheet.getCell(creditRow, col);
        const creditValue = creditCell.value;
        
        // Extract semester number from label (e.g., "Semester 1" → 1)
        const semesterMatch = label.match(/\d+/);
        const semesterNo = semesterMatch ? parseInt(semesterMatch[0], 10) : 0;
        
        semesters.push({
          semesterNo: semesterNo,
          totalCreditHours: parseCredits(creditValue),
        });
      }
      
      return {
        semesters 
      };
    }
       throw new Error(`Sheet "${worksheet.name}": could not detect semester header row.`);
  }
  
export default detectSemesters;
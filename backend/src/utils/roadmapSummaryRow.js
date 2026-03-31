import REGEXS from "./regexs.js";
import sheetProcessingHelperFunction from "./sheetProcessingHelperFunction.js";
const { getCellColor, getCellText } = sheetProcessingHelperFunction;

export default function detectSummaryRow(worksheet) {
  const maxRow = worksheet.rowCount;
  const maxCol = worksheet.columnCount;
  
  console.log(`\nDetecting summary row in "${worksheet.name}"`);
  console.log(`   Total rows: ${maxRow}, Total columns: ${maxCol}`);
  
  // Process the last two rows
  const summaryRowNum = maxRow - 1;
  const creditsRowNum = maxRow;
  
  console.log(`   Summary row: ${summaryRowNum}, Credits row: ${creditsRowNum}`);
  
  if (maxRow < 4) {
    throw new Error(`Sheet "${worksheet.name}": insufficient rows to detect summary row.`);
  }
  
  // Process summary row
  const coloredCells = [];
  let totalCreditHours = 0;
  
  for (let c = 1; c <= maxCol; c++) {
    const cell = worksheet.getCell(summaryRowNum, c);
    if (!cell.value) continue;
    
    const val = getCellText(cell);
    if (!val) continue;
    
    const color = getCellColor(cell);
    
    // Check if this is the total credits column
    if (REGEXS.NUMBER_ONLY.test(val) && !color) {
      totalCreditHours = parseInt(val, 10);
      console.log(`   Found total credits: ${totalCreditHours}`);
    } 
    // Store colored cells with category names
    else if (color && val && !REGEXS.NUMBER_ONLY.test(val)) {
      // Clean the category name (remove "(Core)" if present)
      const cleanName = val.trim();
      coloredCells.push({ col: c, name: cleanName, color });
      console.log(`   Category found: ${cleanName} at col ${c} with color ${color}`);
    }
  }
  
  if (coloredCells.length < 4) {
    throw new Error(`Sheet "${worksheet.name}": insufficient category data in summary row. Expected at least 4, found ${coloredCells.length}`);
  }
  
  console.log(`\nFound ${coloredCells.length} categories`);
  
  // Process credits row
  const creditsData = [];
  
  for (let c = 1; c <= maxCol; c++) {
    const cell = worksheet.getCell(creditsRowNum, c);
    if (!cell.value) continue;
    
    const val = getCellText(cell);
    if (!val) continue;
    
    const color = getCellColor(cell);
    
    console.log(`   Processing credits col ${c}: "${val}", color: ${color || 'none'}`);
    
    let isCreditText = false;
    let creditValue = 0;
    
    // Try to extract credit number from various formats
    if (REGEXS.CREDITS_TEXT.test(val)) {
      isCreditText = true;
      const match = val.match(REGEXS.CREDITS_TEXT);
      creditValue = match ? parseInt(match[1], 10) : 0;
      console.log(`   → Matched CREDITS_TEXT: ${creditValue}`);
    }
    // Check if it's just a number
    else if (REGEXS.NUMBER_ONLY.test(val)) {
      isCreditText = true;
      creditValue = parseInt(val, 10);
      console.log(`   → Matched NUMBER_ONLY: ${creditValue}`);
    }
    // Check if it contains credit-related words
    else if (/(\d+)\s*(?:Credit|Cr|Hrs)/i.test(val)) {
      isCreditText = true;
      const match = val.match(/(\d+)/);
      creditValue = match ? parseInt(match[1], 10) : 0;
      console.log(`   → Matched custom pattern: ${creditValue}`);
    }
    
    if (isCreditText && creditValue > 0) {
      creditsData.push({ col: c, value: val, creditValue, color });
      console.log(`Added to creditsData: ${creditValue} credits`);
    }
  }
  
  if (creditsData.length === 0) {
    throw new Error(`Sheet "${worksheet.name}": No credit data found in credits row.`);
  }
  
  
  // categories array by matching with credits data
  const categories = [];
  
  // First, create a map of color to credit data for quick lookup
  const creditByColor = {};
  for (const credit of creditsData) {
    if (credit.color) {
      creditByColor[credit.color] = credit.creditValue;
    }
  }
  
  // Match each category with its credit data by color
  for (const category of coloredCells) {
    const matchedCredit = creditByColor[category.color];
    
    if (matchedCredit) {
      categories.push({
        name: category.name,
        color: category.color,
        requiredCredits: matchedCredit,
      });
    } 
  }
  
  console.log(`\n Summary row detection complete:`);
  console.log(`   Total Credits: ${totalCreditHours}`);
  console.log(`\n Final Categories Summary:`);
  categories.forEach(cat => {
    console.log(`   ${cat.name}: ${cat.requiredCredits} credits (Color: ${cat.color})`);
  });
  
  return { 
    categories,
    totalCreditHours,
  };
}
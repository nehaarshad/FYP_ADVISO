const REGEXS = {
    COURSE_CREDITS: /\((\d+)(?:\+(\d+))?\)\s*$/,  // Matches course credits in the format (3) or (3+1)
    CREDITS_TEXT: /(\d+)\s*(?:Credit|Cr\.?\s*Hrs?\.?)/i, // Matches a numbers followed by "Credit","Cr Hrs.","Cr. Hrs.","Cr","Cr." text in text format like "3 Credit" or "3 Cr. Hrs."
    NUMBER_ONLY: /^\d+$/,
    COURSE_PATTERN: /\(\d+(?:\+\d+)?\)/, // Matches course credits in the format (3) or (3+1)
    SEMESTER_LABEL: /^semester\s*\d+/i
};

export default REGEXS;
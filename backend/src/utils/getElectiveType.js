const getElectiveType = (courseName) => {
    const name = courseName.toLowerCase();
    let type = name.replace(/elective[\s-]*/i, '').trim();
    type = type.replace(/[-\s]+[ivxlcdm]+$/i, '').trim();
    type = type.replace(/[-\s]+\d+$/, '').trim();
    return type || 'elective';
};

//university elective-1 based on course name on roadmap
export default getElectiveType
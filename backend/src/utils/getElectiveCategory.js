const getElectiveCategory = (categoryName) => {
    if (!categoryName) return null;
    const name = categoryName.trim().toLowerCase();
    const types = ['domain', 'university', 'professional', 'se', 'cs', 'ca', 'ai'];
    for (const type of types) {
        if (name.includes(type)) return `${type.charAt(0).toUpperCase() + type.slice(1)} Elective`;
    }
    const match = name.match(/^([a-z]+)\s+elective/i);
    return match ? `${match[1].charAt(0).toUpperCase() + match[1].slice(1)} Elective` : name;
};

//university elective or domain elective

export default getElectiveCategory
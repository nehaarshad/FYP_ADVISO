function getCreditHours(cgpa) {
    if (cgpa < 0 || cgpa > 4) {
        throw new Error("Invalid CGPA");
    }

    if (cgpa >= 2.0) return 18;
    if (cgpa >= 1.5 && cgpa < 2.0) return 15;
    if (cgpa >= 1.0 && cgpa < 1.5) return 9;

    return 0;
}

export default getCreditHours
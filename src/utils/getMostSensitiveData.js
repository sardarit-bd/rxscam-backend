function getMostSensitiveData(breaches) {
    if (!Array.isArray(breaches)) return [];

    const sensitiveKeywords = [
        "Passwords",
        "Dates of birth",
        "Physical addresses",
        "Phone numbers",
        "IP addresses",
        "Names",
        "Credit Card",
        "Genders",
        "Social media profiles",
        "Geographic locations"
    ];

    const collected = breaches.flatMap(breach =>
        breach.DataClasses.filter(dc => sensitiveKeywords.includes(dc))
    );

    // remove duplicates
    return [...new Set(collected)];
}

export default getMostSensitiveData;
function getMostRecentBreachDate(breaches) {
    if (!Array.isArray(breaches) || breaches.length === 0) return null;

    const mostRecent = breaches.reduce((latest, current) => {
        return new Date(current.BreachDate) > new Date(latest.BreachDate)
            ? current
            : latest;
    });

    return mostRecent.BreachDate;
}

export default getMostRecentBreachDate;
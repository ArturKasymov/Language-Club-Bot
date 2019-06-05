const nth = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
        case 1:  return `${day}st`;
        case 2:  return `${day}nd`;
        case 3:  return `${day}rd`;
        default: return `${day}th`;
    }
};

export const dateString = (date, includeYear = false) => {
    // Prevent daylight savings from interfering with date
    const normalizedDate = `${date}`;
    const dateObj = new Date(normalizedDate);

    // Get the month by local name
    const month = dateObj
        .toLocaleTimeString('en-us', {month: 'long'})
        .split(',')[0];

    const day = nth(dateObj.getDate());

    const optionalYear = includeYear
      ? `, ${dateObj.getFullYear()}`
      : '';

    return `${month} ${day}${optionalYear}`;
};
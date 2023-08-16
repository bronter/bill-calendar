
// We want to get localized weekday names, fortunately modern browsers provide a way to do this.
const weekdayFormatter = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' });
// We need a month that starts on a Sunday for the math to work
const dummyDate = new Date(2023, 0, 1);
export const weekdayNames = [];
for (let i = 1; i <= 7; ++i) {
    dummyDate.setDate(i);
    weekdayNames.push(weekdayFormatter.format(dummyDate));
}

// Now that we have the weekday names, we can get the month names
const monthFormatter = new Intl.DateTimeFormat(navigator.language, { month: 'long' });
export const monthNames = [];
for(let i = 0; i < 12; ++i) {
    dummyDate.setMonth(i);
    monthNames.push(monthFormatter.format(dummyDate));
}

// Not i18n friendly but that's more work for later
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const yyyymmLength = 'yyyy-mm'.length;

const calendarElement = document.getElementById('calendar');
const calendarDayNodeList = document.getElementsByTagName('calendar-day');
const dateNav = document.getElementById('date-nav');
const monthLabel = document.getElementById('month-label');

let currentDate;
let selectedDayOfMonth; // Not zero-based
let currentYear;
let currentMonth;
let currentDateString;
let daysInMonth;
let startDay;

function afterDateUpdateData(newDate, dateString) {
    currentDate = newDate;
    currentDateString = dateString;
    selectedDayOfMonth = currentDate.getDate();
    currentYear = currentDate.getFullYear();
    currentMonth = currentDate.getMonth();
    daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    startDay = days[new Date(currentYear, currentMonth, 1).getDay()];
}
afterDateUpdateData(new Date());

let selectedDayElement = calendarDayNodeList.item(selectedDayOfMonth - 1);

const formattedYear = String(currentYear).padStart(4, '0');
const formattedMonth = String(currentMonth + 1).padStart(2, '0');
const formattedDay = String(selectedDayOfMonth).padStart(2, '0');
currentDateString = `${formattedYear}-${formattedMonth}-${formattedDay}`;

// Stuff that is updated every time including the first time
function updateHeadersAndCalendar() {
    dateNav.value = currentDateString;
    monthLabel.textContent = months[currentMonth];
    calendarElement.dataset.daysInMonth = daysInMonth;
    calendarElement.dataset.startDay = startDay;
}
updateHeadersAndCalendar();
selectedDayElement.classList.toggle('current-day', true);

function updateSelectedDay() {
    selectedDayElement.classList.remove('current-day');
    selectedDayElement = calendarDayNodeList.item(selectedDayOfMonth - 1);
    selectedDayElement.classList.add('current-day');
}

dateNav.addEventListener('change', e => {
    // date string is always in the format yyyy-mm-dd
    const dateStr = e.target.value;

    const newSelectedDayOfMonth = parseInt(dateStr.substring(yyyymmLength + 1), 10);
    
    if (dateStr.substring(0, yyyymmLength) !== currentDateString.substring(0, yyyymmLength)) {
        // Giving the Date constructor a time with no timezone makes it use the local timezone
        // It shouldn't matter what the time is since we don't use that info, so I set it to midnight.
        const newDate = new Date(`${dateStr}T00:00:00`);
        afterDateUpdateData(newDate, dateStr);
        updateHeadersAndCalendar();
        updateSelectedDay();
    } else if (newSelectedDayOfMonth !== selectedDayOfMonth) {
        selectedDayOfMonth = newSelectedDayOfMonth;
        updateSelectedDay();
    }
});

export function dateForDay(dayOfMonth) {
    return new Date(currentYear, currentMonth, dayOfMonth);
}
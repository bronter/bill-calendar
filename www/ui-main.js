import { billsForMonth, newBill } from "./bills.js";

// Not i18n friendly but that's more work for later
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const yyyymmLength = 'yyyy-mm'.length;

const dateNav = document.getElementById('date-nav');
const monthLabel = document.getElementById('month-label');

let selectedDate;
let selectedDayOfMonth; // Not zero-based
let selectedYear;
let selectedMonth;
let selectedDateString;
let daysInMonth;
let startDay;

let billsSelectedMonth = [];

function afterDateUpdateData(newDate, dateString) {
    selectedDate = newDate;
    selectedDateString = dateString;
    selectedDayOfMonth = selectedDate.getDate();
    selectedYear = selectedDate.getFullYear();
    selectedMonth = selectedDate.getMonth();
    daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    startDay = days[new Date(selectedYear, selectedMonth, 1).getDay()];
}
afterDateUpdateData(new Date());

const formattedYear = String(selectedYear).padStart(4, '0');
const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
const formattedDay = String(selectedDayOfMonth).padStart(2, '0');
selectedDateString = `${formattedYear}-${formattedMonth}-${formattedDay}`;

// top-level await ftw
await customElements.whenDefined('bill-calendar');
const calendarElement = document.getElementById('calendar');

// Stuff that is updated every time including the first time
function updateHeadersAndCalendar() {
    dateNav.value = selectedDateString;
    monthLabel.textContent = months[selectedMonth];
    calendarElement.setAttribute('days-in-month', daysInMonth);
    calendarElement.setAttribute('start-day', startDay);
    billsSelectedMonth = billsForMonth(selectedMonth, selectedYear);
    calendarElement.setBills(billsSelectedMonth);
}
updateHeadersAndCalendar();
calendarElement.setAttribute('selected-day', selectedDayOfMonth);

dateNav.addEventListener('change', e => {
    // date string is always in the format yyyy-mm-dd
    const dateStr = e.target.value;

    const newSelectedDayOfMonth = parseInt(dateStr.substring(yyyymmLength + 1), 10);
    if (dateStr.substring(0, yyyymmLength) !== selectedDateString.substring(0, yyyymmLength)) {
        // Giving the Date constructor a time with no timezone makes it use the local timezone
        // It shouldn't matter what the time is since we don't use that info, so I set it to midnight.
        const newDate = new Date(`${dateStr}T00:00:00`);
        afterDateUpdateData(newDate, dateStr);
        updateHeadersAndCalendar();
        calendarElement.setAttribute('selected-day', selectedDayOfMonth);
    } else if (newSelectedDayOfMonth !== selectedDayOfMonth) {
        selectedDayOfMonth = newSelectedDayOfMonth;
        calendarElement.setAttribute('selected-day', selectedDayOfMonth);
    }
});

export function dateForDay(dayOfMonth) {
    return new Date(selectedYear, selectedMonth, dayOfMonth);
}

export function billsForDay(dayOfMonth) {
    return billsSelectedMonth[dayOfMonth - 1];
}

const addBillDialog = document.getElementById('add-bill-dialog');

await customElements.whenDefined('totals-table');
const totalsTable = document.getElementById('totals');

addBillDialog.addEventListener('submit', e => {
    const {amount, name, startDate, endDate, type} = e.detail;
    const bill = newBill(parseInt(amount, 10), name, startDate, endDate, type);
    const day = startDate.getDate();
    billsSelectedMonth[day - 1].push(bill);
    calendarElement.addBillToDay(day, bill);

    totalsTable.updateTotals();
});

const billListDialog = document.getElementById('bill-list-dialog');
billListDialog.addEventListener('bill-pay', () => {
    totalsTable.updateTotals();
});
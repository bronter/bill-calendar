import { billsForMonth, newBill } from "./bills.js";

// Not i18n friendly but that's more work for later
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const yyyymmLength = 'yyyy-mm'.length;

const dateNav = document.getElementById('date-nav');
const monthLabel = document.getElementById('month-label');

const addBillDialog = document.getElementById('add-bill-dialog');

const totalDueElement = document.getElementById('total-due');
const totalPastDueElement = document.getElementById('total-past-due');
const totalPaidElement = document.getElementById('total-paid');

let currentDate;
let selectedDayOfMonth; // Not zero-based
let currentYear;
let currentMonth;
let currentDateString;
let daysInMonth;
let startDay;

let billsThisMonth = [];

let totalDue = 0;
let totalPastDue = 0;
let totalPaid = 0;

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

const formattedYear = String(currentYear).padStart(4, '0');
const formattedMonth = String(currentMonth + 1).padStart(2, '0');
const formattedDay = String(selectedDayOfMonth).padStart(2, '0');
currentDateString = `${formattedYear}-${formattedMonth}-${formattedDay}`;

function updateTotals(bills) {
    totalDue = 0;
    totalPastDue = 0;
    totalPaid = 0;

    for (const [index, dayBills] of bills.entries()) {
        const date = new Date(currentYear, currentMonth, index + 1);
        const dateStr = date.toISOString();
        for (const bill of dayBills) {
            if (bill.payments.has(dateStr)) {
                totalPaid += bill.amount;
            } else {
                totalDue += bill.amount;
                if (date.getTime() < currentDate.getTime()) {
                    totalPastDue += bill.amount;
                }
            }
        }
    }
}

function updateTotalsTable() {
    totalDueElement.innerHTML = totalDue.toString();
    totalPastDueElement.innerHTML = totalPastDue.toString();
    totalPastDueElement.classList.toggle('past-due', totalPastDue > 0);
    totalPaidElement.innerHTML = totalPaid.toString();
}

// top-level await ftw
await customElements.whenDefined('bill-calendar');
const calendarElement = document.getElementById('calendar');

// Stuff that is updated every time including the first time
function updateHeadersAndCalendar() {
    dateNav.value = currentDateString;
    monthLabel.textContent = months[currentMonth];
    calendarElement.setAttribute('days-in-month', daysInMonth);
    calendarElement.setAttribute('start-day', startDay);
    billsThisMonth = billsForMonth(currentMonth, currentYear);
    calendarElement.setBills(billsThisMonth);

    updateTotals(billsThisMonth);
    updateTotalsTable();
}
updateHeadersAndCalendar();
calendarElement.setAttribute('selected-day', selectedDayOfMonth);

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
        calendarElement.setAttribute('selected-day', selectedDayOfMonth);
    } else if (newSelectedDayOfMonth !== selectedDayOfMonth) {
        selectedDayOfMonth = newSelectedDayOfMonth;
        calendarElement.setAttribute('selected-day', selectedDayOfMonth);
    }
});

export function dateForDay(dayOfMonth) {
    return new Date(currentYear, currentMonth, dayOfMonth);
}

export function billsForDay(dayOfMonth) {
    return billsThisMonth[dayOfMonth - 1];
}

addBillDialog.addEventListener('submit', e => {
    const {amount, name, startDate, endDate, type} = e.detail;
    const bill = newBill(parseInt(amount, 10), name, startDate, endDate, type);
    const day = startDate.getDate();
    billsThisMonth[day - 1].push(bill);
    updateTotals(billsThisMonth);
    updateTotalsTable();
    calendarElement.addBillToDay(day, bill);
});
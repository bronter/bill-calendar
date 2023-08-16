import { billsForMonth, newBill } from "./bills.js";
import { currentDateModel, selectedDateModel } from "./date-models.js";
import { monthNames } from "./intl.js";

const dateNav = document.getElementById('date-nav');
const monthLabel = document.getElementById('month-label');

let selectedYear;
let selectedMonth;

let billsSelectedMonth = [];

// top-level await ftw
await customElements.whenDefined('bill-calendar');
const calendarElement = document.getElementById('calendar');

// Stuff that is updated every time including the first time
function updateHeaders() {
    monthLabel.textContent = monthNames[selectedDateModel.selectedMonth];
    billsSelectedMonth = billsForMonth(selectedDateModel.selectedMonth, selectedDateModel.selectedYear);
}
updateHeaders();

dateNav.valueAsNumber = currentDateModel.currentDate.getTime();
dateNav.addEventListener('change', e => {
    updateHeaders();

    // TODO: In Firefox it seems that this the date input's value is a date at midnight UTC
    // Confirm that this is the same on Chrome; if it isn't we're gonna have some problems.
    const newDate = new Date(e.target.valueAsNumber);
    // Since the date was in UTC, we need to do some math to get it to match the local timezone.
    // Note that we divide the timezone offset by 60 since it is a value in minutes rather than hours.
    newDate.setHours(newDate.getHours() + (newDate.getTimezoneOffset() / 60));
    selectedDateModel.selectedDate = newDate;
});

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
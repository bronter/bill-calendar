const calendarElement = document.getElementById('calendar');

const now = new Date();
const dateInputFormatted = now.toISOString().substring(0, '0000-00-00'.length);
document.getElementById('date-nav').value = dateInputFormatted;

const currentDayOfMonth = now.getDate();
let selectedDayOfMonth = currentDayOfMonth;

const currentDayElement = document.getElementsByTagName('calendar-day').item(currentDayOfMonth - 1);
currentDayElement.classList.toggle('current-day')

const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
// Not i18n friendly but that's more work for later
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
document.getElementById('month-header').textContent = months[currentMonth]

const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
calendarElement.dataset.daysInMonth = daysInMonth;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const startDay = days[new Date(currentYear, currentMonth, 1).getDay()];
calendarElement.dataset.startDay = startDay;
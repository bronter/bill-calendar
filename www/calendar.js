// Not i18n friendly but that's more work for later
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const yyyymmLength = 'yyyy-mm'.length;

class BillCalendar extends HTMLElement {
    constructor() {
        super();

        const template = document.getElementById('bill-calendar');
        const templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.calendarDayNodeList = this.shadowRoot.querySelectorAll('calendar-day');
        const selectedDay = this.getAttribute('selected-day');
        if (selectedDay) {
            this.calendarDayNodeList.item(selectedDay - 1).classList.add('current-day');
        }
    }

    static get observedAttributes() {
        return ['selected-day'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected-day') {
            if (oldValue) {
                this.calendarDayNodeList.item(parseInt(oldValue, 10) - 1).classList.remove('current-day');
            }
            this.calendarDayNodeList.item(parseInt(newValue, 10) - 1).classList.add('current-day');
        }
    }

    setBillsForDay(dayOfMonth, bills) {
        this.calendarDayNodeList.item(dayOfMonth - 1).bills = bills;
    }
}

customElements.define('bill-calendar', BillCalendar);

const calendarElement = document.getElementById('calendar');
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

const formattedYear = String(currentYear).padStart(4, '0');
const formattedMonth = String(currentMonth + 1).padStart(2, '0');
const formattedDay = String(selectedDayOfMonth).padStart(2, '0');
currentDateString = `${formattedYear}-${formattedMonth}-${formattedDay}`;

// Stuff that is updated every time including the first time
function updateHeadersAndCalendar() {
    dateNav.value = currentDateString;
    monthLabel.textContent = months[currentMonth];
    calendarElement.setAttribute('days-in-month', daysInMonth);
    calendarElement.setAttribute('start-day', startDay);
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

export function setBillsForDay(date, bills) {
    calendarElement.setBillsForDay(date.getDate(), bills);
}
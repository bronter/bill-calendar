import SingletonElement from "./singleton-element.js";
import { selectedDateModel } from "./date-models.js";
import { billsForMonth } from "./bills.js";
import { weekdayNames } from "./intl.js";

class BillCalendar extends SingletonElement {
    constructor() {
        super();

        this.calendarDayNodeList = this.shadowRoot.querySelectorAll('calendar-day');
    }

    connectedCallback() {
        // Replace the default English weekdays with ones matching the navigator's language setting
        const headerWeekDays = this.shadowRoot.querySelectorAll('.day-of-week-header');
        headerWeekDays.forEach((elem, index) => {
            elem.innerHTML = weekdayNames[index];
        });

        this.calendarDayNodeList.item(selectedDateModel.selectedDayOfMonth - 1).classList.add('current-day');
        this.setAttribute('start-day', selectedDateModel.firstWeekDayOfMonth);
        selectedDateModel.onSelectedDateChange(this.#updateSelectedDate.bind(this));
    }

    #updateSelectedDate(oldDate, newDate) {
        const oldSelectedDay = oldDate.getDate() - 1;
        const newSelectedDay = newDate.getDate() - 1;

        this.calendarDayNodeList.item(oldSelectedDay).classList.remove('current-day');
        this.calendarDayNodeList.item(newSelectedDay).classList.add('current-day');

        if (
            oldDate.getMonth() !== newDate.getMonth() ||
            oldDate.getFullYear() !== newDate.getFullYear()
        ) {
            this.setAttribute('days-in-month', selectedDateModel.daysInSelectedMonth);
            this.setAttribute('start-day', selectedDateModel.firstWeekDayOfMonth);
            this.#setBills(billsForMonth(selectedDateModel.selectedMonth, selectedDateModel.selectedYear));
        }
    }

    #setBills(allBills) {
        allBills.forEach((bills, index) => {
            this.calendarDayNodeList.item(index).bills = bills;
        });
    }

    addBillToDay(dayOfMonth, bill) {
        this.calendarDayNodeList.item(dayOfMonth - 1).addBill(bill);
    }
}

// Make sure calendar-day element is loaded first, otherwise bills setter won't work
await customElements.whenDefined('calendar-day');
customElements.define('bill-calendar', BillCalendar);
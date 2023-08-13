import SingletonElement from "./singleton-element.js";
import { billsForMonth } from "./bills.js";
import DateController from './date-controller.js';

class TotalsTable extends SingletonElement {
    updateTotals() {
        let totalDue = 0;
        let totalPastDue = 0;
        let totalPaid = 0;

        const currentYear = DateController.currentYear;
        const currentMonth = DateController.currentMonth;
        const currentTime = DateController.currentDate.getTime();
        const billsThisMonth = billsForMonth(currentMonth, currentYear);

        for (const [index, dayBills] of billsThisMonth.entries()) {
            const date = new Date(currentYear, currentMonth, index + 1);
            const dateStr = date.toISOString();
            for (const bill of dayBills) {
                if (bill.payments.has(dateStr)) {
                    totalPaid += bill.amount;
                } else {
                    totalDue += bill.amount;
                    // We use the browser's selected time rather than the selected date;
                    // we never want to give the user a false impression that bills are overdue
                    if (date.getTime() < currentTime) {
                        totalPastDue += bill.amount;
                    }
                }
            }
        }

        this.totalDueElement.innerHTML = totalDue.toString();
        this.totalPastDueElement.innerHTML = totalPastDue.toString();
        this.totalPastDueElement.classList.toggle('past-due', totalPastDue > 0);
        this.totalPaidElement.innerHTML = totalPaid.toString();
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        this.totalDueElement = shadowRoot.getElementById('total-due');
        this.totalPastDueElement = shadowRoot.getElementById('total-past-due');
        this.totalPaidElement = shadowRoot.getElementById('total-paid');

        this.updateTotals();
        DateController.onDateChange(this.updateTotals.bind(this));
    }
}

customElements.define('totals-table', TotalsTable);

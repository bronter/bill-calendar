import { setBillsForDay } from "./calendar.js";

class RecurringPeriod {
    // startDate should be a Date object
    constructor(startDate) {
        this.startDate = startDate;
    }

    billingDatesInMonth(month, year) {
        return [];
    }
}

class NonRecurring extends RecurringPeriod {
    billingDatesInMonth(month, year) {
        const startMonth = this.startDate.getMonth();
        const startYear = this.startDate.getFullYear();
        if (startMonth === month && startYear === year) {
            return [this.startDate.getDate()];
        }

        return [];
    }
}

class Monthly extends RecurringPeriod {
    billingDatesInMonth(month, year) {
        const startYear = this.startDate.getFullYear();
        const startMonth = this.startDate.getMonth();
        if (year > startYear || (year === startYear && month >= startMonth)) {
            const startDayOfMonth = this.startDate.getDate();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            if (startDayOfMonth > daysInMonth) {
                // If the bill is on a day of the month that not every month has,
                // like the 31st, just use the last day of the month
                return [daysInMonth];
            }
            return [startDayOfMonth];
        }

        return [];
    }
}

class Annual extends RecurringPeriod {
    billingDatesInMonth(month, year) {
        if (year >= this.startDate.getFullYear()) {
            const newDate = new Date(this.startDate);
            newDate.setFullYear(year);
            if (newDate.getMonth() === month) {
                return [newDate.getDate()];
            }
        }
        return [];
    }
}

class Bill {
    constructor(name, amount, startDate, type='non-recurring') {
        // Maybe export the type names so the UI can use them
        const recurringTypesMap = {
            'non-recurring': NonRecurring
        };
        const RP = recurringTypesMap[type];
        this.recurringPeriod = new RP(startDate);
        this.name = name;
        this.amount = amount;
    }
}

// Maybe structure like {
//    "isoStartDate": [...bills]
//}
const bills = {};

const addBillDialog = document.getElementById('add-bill-dialog');
const billListDialog = document.getElementById('bill-list-dialog');

addBillDialog.addEventListener('submit', e => {
    const {amount, name, startDate, type} = e.detail;
    const startDateStr = startDate.toISOString();
    bills[startDateStr] ??= [];
    bills[startDateStr].push(new Bill(name, amount, startDate, type));
    setBillsForDay(startDate, bills[startDateStr]);
});
export function showAddBillDialog(date) {
    addBillDialog.showModal(date);
}

export function showBillListDialog() {
    billListDialog.showModal();
}
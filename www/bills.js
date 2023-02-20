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
        // TODO: These shouldn't really change, can probably get them at construction time
        const startMonth = this.startDate.getMonth();
        const startYear = this.startDate.getFullYear();
        if (startMonth === month && startYear === year) {
            return [this.startDate.getDate()];
        }

        return [];
    }
}

class Bill {
    constructor(name, amount, startDate, recurringPeriodType='non-recurring') {
        // Maybe export the type names so the UI can use them
        const recurringTypesMap = {
            'non-recurring': NonRecurring
        };
        const RP = recurringTypesMap[recurringPeriodType];
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

export function showAddBillDialog(date) {
    addBillDialog.showModal(date);
}

export function showBillListDialog() {
    billListDialog.showModal();
}
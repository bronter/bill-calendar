class RecurringPeriod {
    // startDate should be a Date object
    constructor(startDate, endDate=null) {
        this.startDate = startDate;
        this.endDate = endDate;
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
        // If the date is past this bill's end date return nothing
        if (this.endDate && this.endDate.getTime() < Date.UTC(year, month)) {
            return []; // I don't like the repeated code here, need to figure out how to invert the if statement
        }
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
    constructor(name, amount, startDate, endDate=null, type='non-recurring') {
        // Maybe export the type names so the UI can use them
        const recurringTypesMap = {
            'non-recurring': NonRecurring
        };
        const RP = recurringTypesMap[type];
        this.recurringPeriod = new RP(startDate);
        if (endDate) {
            this.recurringPeriod.endDate = endDate;
        }
        this.name = name;
        this.amount = amount;

        // Big random number to minimise possibility of collision
        const randNum = Math.random().toString().slice(2);
        this.id = `${startDate.getTime()}-${name}-${randNum}`;
    }

    endBill(endDate) {
        this.recurringPeriod.endDate = endDate;
    }
}

// TODO: Consider putting the bills into a database indexed by start date and end date
//       so that we don't have to load every bill ever into memory immediately upon startup.
//       We could start by loading every bill that has EITHER no end date and a start date
//       no more than 6 months into the future OR an end date within a year of the current date.
//       I kind of doubt there'd be much of a delay in querying the bills from a local database,
//       but if it becomes an issue a LRU cache could help speed things along.
const bills = [];

export function newBill(amount, name, startDate, type) {
    const bill = new Bill(name, amount, startDate, null, type);
    bills.push(bill);
    return bill;
}

export function billsForMonth(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const billsThisMonth = [];
    for (let i = 0; i < daysInMonth; ++i) billsThisMonth.push([]);
    for (const bill of bills) {
        const billingDates = bill.recurringPeriod.billingDatesInMonth(month, year);
        for (const day of billingDates) {
            billsThisMonth[day - 1].push(bill);
        }
    }

    return billsThisMonth;
}
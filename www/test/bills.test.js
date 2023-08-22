import run from './test.js';
import { resetForTest, newBill, billsForMonth, billsForDate } from '../bills.js';

run('bills tests', (test, beforeEach) => {
    beforeEach(() => {
        resetForTest();
    });

    test('newBill should populate its data accordingly', expect => {
        const startDate = new Date(1970, 0, 1);
        const bill = newBill(10, 'bill nye', startDate);

        // Possibly a bit too implementation-specific to test all of these but it helps my sanity
        expect(bill.amount).toStrictlyEqual(10);
        expect(bill.name).toStrictlyEqual('bill nye');
        // non-recurring is the default
        expect(bill.recurringPeriod.constructor.type).toStrictlyEqual('non-recurring');
        expect(bill.recurringPeriod.startDate.getTime()).toStrictlyEqual(startDate.getTime());
        expect(bill.recurringPeriod.endDate).toStrictlyEqual(null);
    });

    test('billsForMonth should be able to query bills for a month', expect => {
        const startDate = new Date(1970, 0, 1);
        const bill = newBill(10, 'bill gates', startDate);

        const billsStartMonth = billsForMonth(0, 1970);

        expect(billsStartMonth.length).toStrictlyEqual(31);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);
    });

    test('billsForMonth should not find bills for a month with no bills', expect => {
        // January 1st, 1970
        const startDate = new Date(1970, 0, 1);
        const bill = newBill(10, 'bill murray', startDate);

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        // Month is zero-indexed, so this would be February of 1970
        const billsNextMonth = billsForMonth(1, 1970);
        for (const dayBills of billsNextMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }

        const billsPreviousMonth = billsForMonth(11, 1969);
        for (const dayBills of billsPreviousMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('billsForMonth should show monthly bills for each month after the start date', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill o\'reilly', startDate, null, 'monthly');

        expect(bill.recurringPeriod.constructor.type).toStrictlyEqual('monthly');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsNextMonth = billsForMonth(1, 1970);
        expect(billsNextMonth[0].length).toStrictlyEqual(1);
        expect(billsNextMonth[0][0]).toStrictlyEqual(bill);
    });

    test('billsForMonth should show annual bills for each year after the start date', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill', startDate, null, 'annual');

        expect(bill.recurringPeriod.constructor.type).toStrictlyEqual('annual');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsNextYear = billsForMonth(0, 1971);
        expect(billsNextYear[0].length).toStrictlyEqual(1);
        expect(billsNextYear[0][0]).toStrictlyEqual(bill);
    });

    test('billsForMonth should clamp monthly bills to the last day of the month', expect => {
        // March, 1970 has 31 days
        const startDate = new Date(1970, 2, 31);
        const bill = newBill(10, 'bill de blasio', startDate, null, 'monthly');

        const billsForJanuary = billsForMonth(2, 1970);
        expect(billsForJanuary.length).toStrictlyEqual(31);
        expect(billsForJanuary[30].length).toStrictlyEqual(1);
        expect(billsForJanuary[30][0]).toStrictlyEqual(bill);
        
        // February, 1971 has 28 days
        const billsFebruaryNextYear = billsForMonth(1, 1971);
        expect(billsFebruaryNextYear.length).toStrictlyEqual(28);
        expect(billsFebruaryNextYear[27].length).toStrictlyEqual(1);
        expect(billsFebruaryNextYear[27][0]).toStrictlyEqual(bill);
    });

    test('billsForMonth should not show monthly bills for a month before the start date', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill clinton', startDate, null, 'monthly');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsPreviousMonth = billsForMonth(11, 1969);
        for (const dayBills of billsPreviousMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('billsForMonth should not show annual bills for a year before the start date', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill', startDate, null, 'annual');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsPreviousYear = billsForMonth(0, 1969);
        for (const dayBills of billsPreviousYear) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('billsForMonth should not show annual bills for a month not matching start month', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill', startDate, null, 'annual');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsPreviousMonth = billsForMonth(11, 1969);
        for (const dayBills of billsPreviousMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }

        const billsNextMonth = billsForMonth(1, 1970);
        for (const dayBills of billsNextMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('billsForMonth should not show monthly bills after the end date', expect => {
        const startDate = new Date(1970, 0, 1);
        const endDate = new Date(1980, 0, 1);

        const bill = newBill(10, 'bill maher', startDate, endDate, 'monthly');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsPastEndDate = billsForMonth(1, 1980);
        for (const dayBills of billsPastEndDate) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('billsForMonth should not show annual bills after the end date', expect => {
        const startDate = new Date(1970, 0, 1);
        const endDate = new Date(1980, 0, 1);

        const bill = newBill(10, 'bill', startDate, endDate, 'annual');

        const billsStartMonth = billsForMonth(0, 1970);
        expect(billsStartMonth[0].length).toStrictlyEqual(1);
        expect(billsStartMonth[0][0]).toStrictlyEqual(bill);

        const billsPastEndDate = billsForMonth(0, 1990);
        for (const dayBills of billsPastEndDate) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('billsForDate should be able to find a non-recurring bill', expect => {
        const startDate = new Date(1970, 0, 1);
        const bill = newBill(10, 'bill', startDate);
        
        const billsStartDate = billsForDate(new Date(1970, 0, 1));

        expect(billsStartDate.length).toStrictlyEqual(1);
        expect(billsStartDate[0]).toStrictlyEqual(bill);
    });
    
    test('billsForDate should not find non-recurring bills on a different date', expect => {
        const startDate = new Date(1970, 0, 1);
        newBill(10, 'bill', startDate);

        const billsNonBillingDate = billsForDate(new Date(1980, 0, 1));

        expect(billsNonBillingDate.length).toStrictlyEqual(0);
    });

    test('billsForDate should be able to find a monthly bill', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill', startDate, null, 'monthly');

        const billsNextBillingDate = billsForDate(new Date(1970, 1, 1));

        expect(billsNextBillingDate.length).toStrictlyEqual(1);
        expect(billsNextBillingDate[0]).toStrictlyEqual(bill);
    });

    test('billsForDate should be able to find an annual bill', expect => {
        const startDate = new Date(1970, 0, 1);

        const bill = newBill(10, 'bill', startDate, null, 'annual');

        const billsNextBillingDate = billsForDate(new Date(1971, 0, 1));

        expect(billsNextBillingDate.length).toStrictlyEqual(1);
        expect(billsNextBillingDate[0]).toStrictlyEqual(bill);
    });

    test('billsForDate should not find a monthly bill on a different day', expect => {
        const startDate = new Date(1970, 0, 1);
        newBill(10, 'bill', startDate, null, 'monthly');

        const billsNonBillingDate = billsForDate(new Date(1970, 0, 2));

        expect(billsNonBillingDate.length).toStrictlyEqual(0);
    });

    test('billsForDate should not find an annual bill on a different day', expect => {
        const startDate = new Date(1970, 0, 1);
        newBill(10, 'bill', startDate, null, 'annual');

        const billsNonBillingDate = billsForDate(new Date(1970, 0, 2));

        expect(billsNonBillingDate.length).toStrictlyEqual(0);
    });

    test('billsForDate should not find a monthly bill after the end date', expect => {
        const startDate = new Date(1970, 0, 1);
        const endDate = new Date(1980, 0, 1);

        const bill = newBill(10, 'bill', startDate, endDate, 'monthly');

        const billsStartDate = billsForDate(new Date(1970, 0, 1));
        expect(billsStartDate.length).toStrictlyEqual(1);
        expect(billsStartDate[0]).toStrictlyEqual(bill);

        const billsPastEndDate = billsForDate(new Date(1980, 1, 1));
        expect(billsPastEndDate.length).toStrictlyEqual(0);
    });

    test('billsForDate should not find an annual bill after the end date', expect => {
        const startDate = new Date(1970, 0, 1);
        const endDate = new Date(1980, 0, 1);

        const bill = newBill(10, 'bill', startDate, endDate, 'annual');

        const billsStartDate = billsForDate(new Date(1970, 0, 1));
        expect(billsStartDate.length).toStrictlyEqual(1);
        expect(billsStartDate[0]).toStrictlyEqual(bill);

        const billsPastEndDate = billsForDate(new Date(1990, 0, 1));
        expect(billsPastEndDate.length).toStrictlyEqual(0);
    });

    test('billsForDate should clamp monthly bill to the last day of the month', expect => {
        // March, 1970 has 31 days
        const startDate = new Date(1970, 2, 31);
        const bill = newBill(10, 'bill', startDate, null, 'monthly');

        const billsLastDayOfJanuary = billsForDate(new Date(1970, 2, 31));
        expect(billsLastDayOfJanuary.length).toStrictlyEqual(1);
        expect(billsLastDayOfJanuary[0]).toStrictlyEqual(bill);
        
        // February, 1971 has 28 days
        const billsLastDayOfFebruary = billsForDate(new Date(1971, 1, 28));
        expect(billsLastDayOfFebruary.length).toStrictlyEqual(1);
        expect(billsLastDayOfFebruary[0]).toStrictlyEqual(bill);
    });
});

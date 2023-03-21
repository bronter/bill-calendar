import run from './test.js';
import { resetForTest, newBill, billsForMonth } from '../bills.js';

run('bills tests', test => {
    test('newBill should populate its data accordingly', expect => {
        resetForTest();
        const startDate = new Date();
        const bill = newBill(1, 'bill nye', startDate);

        // Possibly a bit too implementation-specific to test all of these but it helps my sanity
        expect(bill.amount).toStrictlyEqual(1);
        expect(bill.name).toStrictlyEqual('bill nye');
        // non-recurring is the default
        expect(bill.recurringPeriod.constructor.type).toStrictlyEqual('non-recurring');
        expect(bill.recurringPeriod.startDate.getTime()).toStrictlyEqual(startDate.getTime());
        expect(bill.recurringPeriod.endDate).toStrictlyEqual(null);
    });

    test('should be able to query bills in a month', expect => {
        resetForTest();
        const startDate = new Date();
        const bill = newBill(2, 'bill gates', startDate);

        const thisMonth = startDate.getMonth();
        const thisYear = startDate.getFullYear();
        const billsThisMonth = billsForMonth(thisMonth, thisYear);

        const thisDayOfMonth = startDate.getDate();
        expect(billsThisMonth.length).toBeGreaterThanOrEqualTo(thisDayOfMonth);
        expect(billsThisMonth[thisDayOfMonth - 1].length).toStrictlyEqual(1);
        expect(billsThisMonth[thisDayOfMonth - 1][0]).toStrictlyEqual(bill);
    });

    // I know, a month with no bills is in no way a realistic scenario :(
    test('should not find bills for a month with no bills', expect => {
        resetForTest();
        // January 1st, 1970
        const startDate = new Date(1970, 0, 1);
        const bill = newBill(3, 'bill murray', startDate);
    
        const billsThisMonth = billsForMonth(0, 1970);
        expect(billsThisMonth[0].length).toStrictlyEqual(1);
        expect(billsThisMonth[0][0]).toStrictlyEqual(bill);
    
        // Month is zero-indexed, so this would be February of 1970
        const billsNextMonth = billsForMonth(1, 1970);
        for (const dayBills of billsNextMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }

        const billsLastMonth = billsForMonth(11, 1969);
        for (const dayBills of billsLastMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('monthly bill should show up for each month after the start date', expect => {
        resetForTest();

        const startDate = new Date(1970, 0, 1);

        const bill = newBill(4, 'bill o\'reilly', startDate, null, 'monthly');

        expect(bill.recurringPeriod.constructor.type).toStrictlyEqual('monthly');

        const billsThisMonth = billsForMonth(0, 1970);
        expect(billsThisMonth[0].length).toStrictlyEqual(1);
        expect(billsThisMonth[0][0]).toStrictlyEqual(bill);

        const billsNextMonth = billsForMonth(1, 1970);
        expect(billsNextMonth[0].length).toStrictlyEqual(1);
        expect(billsNextMonth[0][0]).toStrictlyEqual(bill);
    });

    test('monthly bill should clamp to the last day of the month', expect => {
        resetForTest();

        // March, 1970 has 31 days
        const startDate = new Date(1970, 2, 31);
        const bill = newBill(5, 'bill de blasio', startDate, null, 'monthly');

        const billsThisMonth = billsForMonth(2, 1970);
        expect(billsThisMonth.length).toStrictlyEqual(31);
        expect(billsThisMonth[30].length).toStrictlyEqual(1);
        expect(billsThisMonth[30][0]).toStrictlyEqual(bill);
        
        // February, 1971 has 28 days
        const billsNextFebrurary = billsForMonth(1, 1971);
        expect(billsNextFebrurary.length).toStrictlyEqual(28);
        expect(billsNextFebrurary[27].length).toStrictlyEqual(1);
        expect(billsNextFebrurary[27][0]).toStrictlyEqual(bill);
    });

    test('monthly bill should not show up for month before the start date', expect => {
        resetForTest();

        const startDate = new Date(1970, 0, 1);

        const bill = newBill(6, 'bill clinton', startDate, null, 'monthly');

        const billsThisMonth = billsForMonth(0, 1970);
        expect(billsThisMonth[0].length).toStrictlyEqual(1);
        expect(billsThisMonth[0][0]).toStrictlyEqual(bill);

        const billsLastMonth = billsForMonth(11, 1969);
        for (const dayBills of billsLastMonth) {
            expect(dayBills.length).toStrictlyEqual(0);
        }
    });

    test('monthly bill should not show up after the end date', expect => {
        resetForTest();

        const startDate = new Date(1970, 0, 1);
        const endDate = new Date(1980, 0, 1);

        const bill = newBill(7, 'bill maher', startDate, endDate, 'monthly');

        const billsThisMonth = billsForMonth(0, 1970);
        expect(billsThisMonth[0].length).toStrictlyEqual(1);
        expect(billsThisMonth[0][0]).toStrictlyEqual(bill);

        const billsWayInTheFuture = billsForMonth(1980, 1, 1);
        for (const dayBill of billsWayInTheFuture) {
            expect(dayBill.length).toStrictlyEqual(0);
        }
    });
});
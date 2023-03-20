import run from './test.js';
import { resetForTest, newBill, billsForMonth } from '../bills.js';

run('bills tests', test => {
    resetForTest();
});
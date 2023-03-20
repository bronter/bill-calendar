import run from './test.js';

run('expect tests', test => {
    test('toFail', expect => {
        let threwError = false;
        try {
            expect().toFail();
        } catch(e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toFail to throw error');
        }
    });

    test('toFail with message', expect => {
        let threwError = false;
        let message;
        try {
            expect().toFail('foo');
        } catch (e) {
            threwError = true;
            message = e.message;
        }
        if (!threwError) {
            throw new Error('Expected toFail to still throw an error when given a message');
        }
        if (message !== 'foo') {
            throw new Error('Expected message passed to toFail to appear in error message');
        }
    })

    test('not', expect => {
        expect().not.toFail();
        let threwError = false;
        try {
            expect().not.not.toFail();
        } catch (e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected not to not throw error');
        }
        expect().not.not.not.toFail();
    });

    test('toEqual', expect => {
        let threwError = false;
        try {
            expect('true').toEqual(false);
        } catch (e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toEqual to throw when comparing two unequal things (\'true\' and false)');
        }
        expect('1').toEqual('1');
        expect('1').toEqual(1);
        expect('true').not.toEqual(true);
    });

    test('toStrictlyEqual', expect => {
        let threwError = false;
        try {
            expect('1').toStrictlyEqual(1);
        } catch (e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toStrictlyEqual to throw when comparing things that are equal but not strictly equal (\'1\' and 1)');
        }
        expect('1').toStrictlyEqual('1');
        expect('1').not.toStrictlyEqual(1);
    });

    test('toBeGreaterThan', expect => {
        let threwError = false;
        try {
            expect(0).toBeGreaterThan(1);
        } catch (e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toBeGreaterThan to throw an error when comparing 0 > 1');
        }
        expect(1).toBeGreaterThan(0);
        expect(0).not.toBeGreaterThan(1);
        expect(0).not.toBeGreaterThan(0);
    });

    test('toBeLessThan', expect => {
        let threwError = false;
        try {
            expect(1).toBeLessThan(0);
        } catch (e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toBeLessThan to throw an error when comparing 1 < 0');
        }
        expect(0).toBeLessThan(1);
        expect(1).not.toBeLessThan(0);
        expect(0).not.toBeLessThan(0);
    });

    test('toBeGreaterThanOrEqualTo', expect => {
        let threwError = false;
        try {
            expect(0).toBeGreaterThanOrEqualTo(1);
        } catch(e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toBeGreaterThanOrEqualTo to throw an error when comparing 0 >= 1');
        }
        expect(1).toBeGreaterThanOrEqualTo(0);
        expect(1).toBeGreaterThanOrEqualTo(1);
        expect(0).not.toBeGreaterThanOrEqualTo(1);
    });

    test('toBeLessThanOrEqualTo', expect => {
        let threwError = false;
        try {
            expect(1).toBeLessThanOrEqualTo(0);
        } catch(e) {
            threwError = true;
        }
        if (!threwError) {
            throw new Error('Expected toBeLessThanOrEqualTo to throw an error when comparing 1 <= 0');
        }
        expect(0).toBeLessThanOrEqualTo(1);
        expect(1).toBeLessThanOrEqualTo(1);
        expect(1).not.toBeLessThanOrEqualTo(0);
    });
});
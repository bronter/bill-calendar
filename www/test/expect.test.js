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
    })
});
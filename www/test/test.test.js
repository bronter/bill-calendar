import run from './test.js';

run('test runner tests', test => {
    test('run without tests should not throw an exception and should show a description', expect => {
        const testMain = new DocumentFragment();
        run('test run description', () => {}, testMain);

        expect(testMain.textContent).toStrictlyEqual('test run description');
    });

    test('run with a passing test should populate a list item with the \'passed\' class', expect => {
        const testMain = new DocumentFragment();
        const testFunc = test => test('test description', expect => expect().not.toFail());
        run('one test', testFunc, testMain);

        const li = testMain.querySelector('li');
        expect(li).not.toEqual(null);
        expect(li.textContent).toStrictlyEqual('test description');
        expect(li.classList.contains('passed')).toStrictlyEqual(true);
        expect(li.classList.contains('failed')).toStrictlyEqual(false);
    });

    test('run with a failing test should populate a list item with the \'failed\' class and error message', expect => {
        const testMain = new DocumentFragment();
        const testFunc = test => test('test description', expect => expect().toFail());
        run('one failing test', testFunc, testMain);

        const li = testMain.querySelector('li');
        expect(li).not.toEqual(null);
        expect(li.classList.contains('failed')).toStrictlyEqual(true);

        // We'd always want the error message to be in a 'pre', since it could contain anything
        const errorMessage = li.querySelector('pre');
        expect(errorMessage).not.toEqual(null);
        expect(errorMessage.textContent.length).toBeGreaterThan(0);
    });

    test('running multiple tests should populate multiple list items', expect => {
        const testMain = new DocumentFragment();
        const testFunc = test => {
            test('pass', expect => expect().not.toFail());
            test('fail', expect => expect().toFail());
        };
        run('two tests', testFunc, testMain);

        const results = testMain.querySelectorAll('li');
        expect(results.length).toStrictlyEqual(2);
    });

    test('should show results of passing async test', async expect => {
        const testMain = new DocumentFragment();
        const testFunc = test => test('async pass', async expect => {
            expect().not.toFail();
        });

        await run('async passing test', testFunc, testMain);

        const resultElement = testMain.querySelector('li');
        expect(resultElement).not.toEqual(null);
        expect(resultElement.classList.contains('passed')).toStrictlyEqual(true);
        expect(resultElement.classList.contains('failed')).toStrictlyEqual(false);
    });

    test('should show results of failing async test', async expect => {
        const testMain = new DocumentFragment();
        const testFunc = test => test('async fail', async expect => {
            expect().toFail();
        });

        await run('async failing test', testFunc, testMain);

        const resultElement = testMain.querySelector('li');
        expect(resultElement).not.toEqual(null);
        expect(resultElement.classList.contains('failed')).toStrictlyEqual(true);
        expect(resultElement.classList.contains('passed')).toStrictlyEqual(false);
    });
});
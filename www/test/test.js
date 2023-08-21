import expect from './expect.js';

const testMain = document.getElementById('test-main');

async function _test(parentNode, description, cb) {
    const testListElement = document.createElement('li');
    const descriptionHeader = document.createElement('h3');
    descriptionHeader.textContent = description;
    testListElement.appendChild(descriptionHeader);
    const testResult = document.createElement('pre');
    try {
        const res = cb(expect);

        // If test is async (returns a Promise), await it.
        if (res instanceof Promise) {
            await res;
        }

        testListElement.classList.add('passed');
    } catch (e) {
        testResult.textContent = e.message;
        testListElement.classList.add('failed');
    } finally {
        testListElement.appendChild(testResult);
        parentNode.appendChild(testListElement);
    }
}

// Run will return a promise which resolves when all tests have completed
// _testMain is for testing, it is the container element and can be a DocumentFragment
export default function run(description, testsCB, _testMain=testMain) {
    const testFileSection = document.createElement('section');
    const descriptionHeader = document.createElement('h2');
    const testsList = document.createElement('ul');

    descriptionHeader.textContent = description;

    testFileSection.appendChild(descriptionHeader);
    testFileSection.appendChild(testsList);

    _testMain.appendChild(testFileSection);

    const beforeEachFns = [];
    function beforeEach(cb) {
        beforeEachFns.push(cb);
    }

    const testPromises = [];
    function test(...args) {
        for(const fn of beforeEachFns) {
            fn();
        }
        testPromises.push(_test(testsList, ...args));
    }
    testsCB(test, beforeEach);

    return Promise.allSettled(testPromises);
}
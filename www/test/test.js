import expect from './expect.js';

const testMain = document.getElementById('test-main');

function _test(parentNode, description, cb) {
    const testListElement = document.createElement('li');
    const descriptionHeader = document.createElement('h3');
    descriptionHeader.textContent = description;
    testListElement.appendChild(descriptionHeader);
    const testResult = document.createElement('pre');
    try {
        cb(expect);
        testListElement.classList.add('passed');
    } catch (e) {
        testResult.textContent = e.message;
        testListElement.classList.add('failed');
    }
    testListElement.appendChild(testResult);
    parentNode.appendChild(testListElement);
}

export default function run(description, testsCB) {
    const testFileSection = document.createElement('section');
    const descriptionHeader = document.createElement('h2');
    descriptionHeader.textContent = description;
    testFileSection.appendChild(descriptionHeader);
    const testsList = document.createElement('ul');
    const test = _test.bind(null, testsList);
    testsCB(test);

    testFileSection.appendChild(testsList);
    testMain.appendChild(testFileSection);
}
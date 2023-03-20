class Expectation {
    #not = false;

    constructor(value) {
        this.value = value;
    }

    get not() {
        this.#not = !this.#not;
        return this;
    }

    toFail() {
        if (!this.#not) {
            throw new Error("Failed as expected");
        }
    }

    toStrictlyEqual(value) {
        if (this.#not) {
            if (this.value === value) {
                throw new Error(`Expected ${this.value} to not strictly equal ${value}`);
            }
        } else {
            if (this.value !== value) {
                throw new Error(`Expected ${this.value} to strictly equal ${value}`);
            }
        }
    }

    toEqual(value) {
        if (this.#not) {
            if (this.value == value) {
                throw new Error(`Expected ${this.value} to not equal ${value}`);
            }
        } else {
            if (this.value != value) {
                throw new Error(`Expected ${this.value} to equal ${value}`);
            }
        }
    }
}

export default function expect(value) {
    return new Expectation(value);
}
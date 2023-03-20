class Expectation {
    #not = false;

    constructor(value) {
        this.value = value;
    }

    get not() {
        this.#not = !this.#not;
        return this;
    }

    toFail(message) {
        if (!this.#not) {
            throw new Error(message ?? "Failed as expected");
        }
    }

    toStrictlyEqual(value) {
        // TODO: Could probably D.R.Y. up this pattern since it occurs in all of the following
        //       methods as well. Maybe later
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

    toBeGreaterThan(value) {
        if (this.#not) {
            if (this.value > value) {
                throw new Error(`Expected ${this.value} to not be greater than ${value}`);
            }
        } else {
            if (!(this.value > value)) {
                throw new Error(`Expected ${this.value} to be greater than ${value}`);
            }
        }
    }

    toBeLessThan(value) {
        if (this.#not) {
            if (this.value < value) {
                throw new Error(`Expected ${this.value} to not be less than ${value}`);
            }
        } else {
            if (!(this.value < value)) {
                throw new Error(`Expected ${this.value} to be less than ${value}`);
            }
        }
    }

    toBeGreaterThanOrEqualTo(value) {
        if (this.#not) {
            if (this.value >= value) {
                throw new Error(`Expected ${this.value} to not be greater than or equal to ${value}`);
            }
        } else {
            if (!(this.value >= value)) {
                throw new Error(`Expected ${this.value} to be greater than or equal to ${value}`);
            }
        }
    }

    toBeLessThanOrEqualTo(value) {
        if (this.#not) {
            if (this.value <= value) {
                throw new Error(`Expected ${this.value} to not be less than or equal to ${value}`);
            }
        } else {
            if (!(this.value <= value)) {
                throw new Error(`Expected ${this.value} to be less than or equal to ${value}`);
            }
        }
    }
}

export default function expect(value) {
    return new Expectation(value);
}
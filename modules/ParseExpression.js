export default class ParseExpression {
	constructor(left, right, generic_operator) {
		this.left = left;
		this.right = right;
		this.operator = generic_operator;

		return this.#parse();
	}

	#parse() {
        switch (this.operator) {
            case 'add':
                return this.#add();
            case 'sub':
                return this.#sub();
            case 'mul':
                return this.#mul();
            case 'div':
                return this.#div();
        
            default:
                return null;
        }
    }

	#add() {
        return {
			initial: this.left,
			by: this.right,
		};
    }
    #sub() {
        return {
			initial: this.left,
			by: -1 * this.right,
		};
    }
    #mul() {
        return {
			initial: 0,
			final: null,
			by: 1,
			times: 1,
			rotation: 0,
		};
    }
    #div() {
        return {
			initial: 0,
			final: null,
			by: 1,
			times: 1,
			rotation: 0,
		};
    }
}

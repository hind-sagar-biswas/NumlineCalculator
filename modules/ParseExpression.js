export default class ParseExpression {
	constructor(left, right, generic_operator) {
		this.left = left;
		this.right = right;
		this.operator = generic_operator;
	}

	parse() {
		switch (this.operator) {
			case "add":
				return this.#add();
			case "sub":
				return this.#sub();
			case "mul":
				return this.#mul();
			case "div":
				return this.#div();
			default:
				return null;
		}
	}

	#getLimits(value) {
		const limitOffset = value > 0 ? -2 : 2;
		const min = value < 0 ? value - limitOffset : (-1 * value) + limitOffset;
		const max = value > 0 ? value - limitOffset : (-1 * value) + limitOffset;
		return [min, max];
	}

	#add() {
		const sum = this.left + this.right;
		const limit = this.#getLimits(sum);

		return {
			initial: this.left,
			by: this.right,
			limit,
		};
	}

	#sub() {
		const sum = this.left + this.right;
		const limit = this.#getLimits(sum);

		return {
			initial: this.left,
			by: -1 * this.right,
			limit,
		};
	}

	#mul() {
		const pro = this.left * this.right;
		const limit = this.#getLimits(pro);
		const rotation = (this.left < 0 ? 1 : 0) + (this.right < 0 ? 1 : 0);

		return {
			initial: 0,
			final: null,
			by: Math.abs(this.right),
			times: Math.abs(this.left),
			rotation,
			limit,
		};
	}

	#div() {
		const qou = this.left;
		const limit = this.#getLimits(qou);
		const rotation = (this.left < 0 ? 1 : 0) + (this.right < 0 ? 1 : 0);

		return {
			initial: 0,
			final: Math.abs(this.left),
			by: Math.abs(this.right),
			times: null,
			rotation,
			limit,
		};
	}
}

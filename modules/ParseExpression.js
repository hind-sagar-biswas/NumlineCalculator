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

	#add() {
		const sum = this.left + this.right;
		let lim = [-10, 10];
		lim[0] = sum > 0 ? -1 * sum - 3 : sum - 3;
		lim[1] = sum < 0 ? -1 * sum + 3 : sum + 3;

		return {
			initial: this.left,
			by: this.right,
			limit: lim,
		};
	}
	#sub() {
		const dif = this.left - this.right;
		let lim = [-10, 10];
		lim[0] = dif > 0 ? -1 * dif - 3 : dif - 3;
		lim[1] = dif < 0 ? -1 * dif + 3 : dif + 3;

		return {
			initial: this.left,
			by: -1 * this.right,
			limit: lim,
		};
	}
	#mul() {
		const pro = this.left * this.right;
		let lim = [-10, 10];
		lim[0] = pro > 0 ? -1 * pro - 3 : pro - 3;
		lim[1] = pro < 0 ? -1 * pro + 3 : pro + 3;

		let rotation = 0;
		if (this.left < 0) rotation++;
		if (this.right < 0) rotation++;

		return {
			initial: 0,
			final: null,
			by: Math.abs(this.right),
			times: Math.abs(this.left),
			rotation,
			limit: lim,
		};
	}
	#div() {
		const qou = this.left;
		let lim = [-10, 10];
		lim[0] = qou > 0 ? -1 * qou - 3 : qou - 3;
		lim[1] = qou < 0 ? -1 * qou + 3 : qou + 3;

		let rotation = 0;
		if (this.left < 0) rotation++;
		if (this.right < 0) rotation++;

		return {
			initial: 0,
			final: Math.abs(this.left),
			by: Math.abs(this.right),
			times: null,
			rotation,
			limit: lim,
		};
	}
}

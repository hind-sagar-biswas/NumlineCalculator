export default class Simplifier {
	#left;
	#right;
	#operator;

	#initial;
	#final;
	#by;
	#times;
	#rotation;

	constructor() {}

	simplify(unparsed, parsed) {
		const { left, right, operator } = unparsed;
		const { initial, final, by, times, rotation } = parsed;

		this.#left = left;
		this.#right = right;
		this.#operator = operator;

		this.#initial = initial;
		this.#final = final;
		this.#by = by;
		this.#times = times;
		this.#rotation = rotation;

		return this.#getTemplate(this.#operator);
	}

	#getTemplate(operation) {
		switch (operation) {
			case "add":
				return this.#add(this.#left, this.#right);
			case "sub":
				return this.#sub(this.#left, this.#right);
			// case "mul":
			// 	return this.#mul();
			// case "div":
			// 	return this.#div();
			default:
				return null;
		}
	}

	#add(_x, _y) {
		const x = this.#getType(_x);
		const y = this.#getType(_y);

		const steps = [];
		steps[0] = `From <code>0</code>, change the value by <code>${x.val}</code>. Since, it is ${x.type}, move towards ${x.direction} by ${Math.abs(x.val)}.`;
		steps[1] = `Then change the value by <code>${y.val}</code>. Since, it is ${y.type}, move towards ${y.direction} by ${Math.abs(y.val)}.`;
		steps[2] = `So the value is: `;

		return `<b>Expression:</b> <code>${x.val} + ${y.val}</code> means, <ul>${steps.map(step => `<li>${step}</li>`).join('')}</ul>`;
	}

	#sub(_x, _y) {
		const x = this.#getType(_x);
		const y = this.#getType(_y);

		const steps = [];
		steps[0] = `Addition of <code>${x.val}</code> with the negated value of <code>${y.val}</code>`;
		steps[1] = this.#negation(y.val);
		steps[2] = this.#add(this.#initial, this.#by);

		return `<b>Expression:</b> <code>${x.val} - ${y.val}</code> means, <ul>${steps.map(step => `<li>${step}</li>`).join('')}</ul>`;
	}

	#negation(_value) {
		const value = this.#getType(_value);
		const negated = this.#getType(_value * -1);

		const steps = [];
		steps[0] = `Take the value <code>${_value}</code> on number line. Then change it's direction.`;
		steps[1] = `As it is on the ${value.direction} of <code>0</code>, put it on the ${negated.direction} of <code>0</code>`;
		steps[2] = `So the value becomes: ${negated.val}`;

		return `Negation or getting the negative value of <code>${_value}</code> means to multiply it with <code>-1</code> or take the value on numberline and rotate it in respect to <code>0</code>, <ul>${steps.map(step => `<li>${step}</li>`).join('')}</ul>`;
	}

	#getType(value) {
		return value < 0
			? { val: value, type: "negative", direction: "left" }
			: { val: value, type: "positive", direction: "right" };
	}
}

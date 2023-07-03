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
			case "mul":
				return this.#mul(this.#left, this.#right);
			// case "div":
			// 	return this.#div();
			default:
				return null;
		}
	}

	#add(_x, _y) {
		const x = this.#getType(_x);
		const y = this.#getType(_y);

		const steps = [
			`From <code>0</code>, change the value by <code>${ x.val }</code>. Since, it is <b>${x.type}</b>, move towards <b>${x.direction}</b> by ${Math.abs(x.val)}.`,
			`Then change the value by <code>${y.val}</code>. Since, it is <b>${y.type}</b>, move towards <b>${y.direction}</b> by ${Math.abs(y.val)}.`,
			`So the value is: `,
		];

		return `<b>Expression:</b> <code>${x.val} + ${y.val
		}</code> means, <ul>${steps.map((step) => `<li>${step}</li>`).join("")}</ul>`;
	}

	#sub(_x, _y) {
		const x = this.#getType(_x);
		const y = this.#getType(_y);

		const steps = [
			`Addition of <code>${x.val}</code> with the negated value of <code>${y.val}</code>`,
			this.#negation(y.val),
			this.#add(this.#initial, this.#by),
		];

		return `<b>Expression:</b> <code>${x.val} - ${y.val
		}</code> means, <ul>${steps.map((step) => `<li>${step}</li>`).join("")}</ul>`;
	}

	#mul(_x, _y) {
		const x = this.#getType(_x);
		const y = this.#getType(_y);

		const steps = [
			`Take <code>0</code> as initial value.`,
			`Then keep adding <code>|${x.val}|</code> (or <code>${this.#by}</code>) for <code>|${y.val}|</code> (or <code>${this.#times}</code>) times.`,
		];

		if (x.type == 'negative') {
			steps.push(`Since <code>${x.val}</code> is <b>${x.type}</b>, rotate the final value (<i>i.e. Negate it</i>)`, this.#negation(this.#by * this.#times));
		}
		if (y.type == 'negative') {
			steps.push(
				`Since <code>${y.val}</code> is <b>${y.type}</b>, rotate the final value ${ x.type == 'negative' ? 'again' : '' } (<i>i.e. Negate it</i>)`,
				this.#negation(this.#by * this.#times * ( x.type == 'negative' ? -1 : 1))
			);
		}

		steps.push(`So the value is: `);

		return `<b>Expression:</b> <code>${x.val} x ${y.val}</code> means, <ul>${steps.map((step) => `<li>${step}</li>`).join("")}</ul>`;
	}

	#negation(_value) {
		const value = this.#getType(_value);
		const negated = this.#getType(_value * -1);

		const steps = [
			`Take the value <code>${_value}</code> on number line. Then change it's direction.`,
			`As it is on the <b>${value.direction}</b> of <code>0</code>, put it on the <b>${negated.direction}</b> of <code>0</code>`,
			`So the value becomes: ${negated.val}`,
		];

		return `Negation or getting the <b>negative</b> value of <code>${_value}</code> means to multiply it with <code>-1</code> or take the value on numberline and rotate it in respect to <code>0</code>, <ul>${steps.map((step) => `<li>${step}</li>`).join("")}</ul>`;
	}

	#getType(value) {
		return value < 0
			? { val: value, type: "negative", direction: "left" }
			: { val: value, type: "positive", direction: "right" };
	}
}

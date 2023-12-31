export default class Operator {
	#initial;
	#final;
	#by;
	#times;
	#rotation;
	#result;
	#moves; // start:<initial>, left:<by>, right:<by>, rotate

	constructor(properties = {}) {
		const {
			initial = 0,
			final = null,
			by = 1,
			times = 1,
			rotation = 0,
		} = properties;

		this.#initial = initial;
		this.#final = final;
		this.#by = by;
		this.#times = times;
		this.#rotation = rotation;
	}

	operate() {
		this.#moves = [`start:${this.#initial}`];

		if (this.#final == null) {
			this.#findFinal();
		} else if (this.#times == null) {
			this.#findTimes();
		}

		return [this.#result, this.#moves];
	}

	#findTimes() {
		let times = 0;
		let current = this.#initial;

		while (current + this.#by <= this.#final) {
			this.#moves.push(`right:${this.#by}`);
			times++;
			current += this.#by;
		}

		times *= Math.pow(-1, this.#rotation);

		for (let index = 0; index < this.#rotation; index++) {
			this.#moves.push("rotate");
		}

		let remainder = (this.#final - current) * Math.pow(-1, this.#rotation);
		this.#result = { times, remainder };
	}

	#findFinal() {
		let current = this.#initial;

		for (let index = 0; index < this.#times; index++) {
			current += this.#by;
			const move =
				this.#by < 0 ? `left:${Math.abs(this.#by)}` : `right:${this.#by}`;
			this.#moves.push(move);
		}

		current *= Math.pow(-1, this.#rotation);

		for (let index = 0; index < this.#rotation; index++) {
			this.#moves.push("rotate");
		}

		this.#result = { final: current };
	}
}

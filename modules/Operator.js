export default class Operator {
	#initial;
	#final;
	#by;
	#times;
	#rotation;

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
        
    }
}

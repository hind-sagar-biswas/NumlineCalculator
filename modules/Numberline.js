export default class Numberline {
	#container = null;
	#max = 10;
	#min = -10;
	#moves = null;

	constructor(config = {}) {
		const { max = 10, min = -10 } = config;

		if (max <= min) {
			return console.error(
				"Maximum value can never be less than or equal to Minimum value"
			);
		}

		this.#max = max;
		this.#min = min;
		this.line = this.createLine();
	}

	getMax() {
		return this.#max;
	}
	getMin() {
		return this.#min;
	}
	getCurrentPosition() {
		const currentNode = document.querySelector('[data-numberline-current="1"]');
		if (!currentNode) return null;
		return parseInt(currentNode.parentElement.dataset.numberlinePosition);
	}
	setCurrentPosition(position) {
		if (position > this.#max || position < this.#min) {
			return console.error(
				"Could not set new position: Position value must be between limit"
			);
		}
		const currentPosition = this.getCurrentPosition();
		if (currentPosition !== null) {
			document.querySelector(
				'[data-numberline-current="1"]'
			).dataset.numberlineCurrent = 0;
		}
		document.querySelector(
			`[data-numberline-position="${position}"] > .operation-block`
		).dataset.numberlineCurrent = 1;
	}

	createLine() {
		return Array.from(
			{ length: this.#max - this.#min + 1 },
			(_, i) => this.#min + i
		);
	}

	render(containerId = "numberline-container") {
		this.#container = document.getElementById(containerId);
		this.#container.innerHTML = "";

		// CREATE THE CONTAINER IF NOT FOUND
		if (!this.#container) {
			const container = document.createElement("div");
			container.id = containerId;
			document.body.appendChild(container);
			this.#container = document.getElementById(containerId);
		}

		// CREATE NUMBER POSITION DIVS FOR THE NUMBER LINE
		for (let index = 0; index < this.line.length; index++) {
			this.#container.appendChild(
				this.#getPositionDivTemplate(this.line[index])
			);
		}

		this.#container.style.display = "flex";
	}

	move(moves) {
		this.#moves = moves;
		this.#moveTo(0)
			.then(() => {
				console.log("Recursive calls completed successfully.");
			})
			.catch((err) => {
				console.error(err);
			});
	}

	#moveTo(serial) {
		if (serial >= this.#moves.length) {
			return Promise.reject();
		}

		const time = 100 * (serial + 1);
		const [movement, number] = this.#moves[serial].split(":");
		const parsedNumber = parseInt(number);

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (movement === "start") {
					this.setCurrentPosition(parsedNumber);
				} else {
					let position = 0;

					if (movement === "left") {
						position = this.getCurrentPosition() - parsedNumber;
					} else if (movement === "right") {
						position = this.getCurrentPosition() + parsedNumber;
					} else if (movement === "rotate") {
						position = -1 * this.getCurrentPosition();
					}

					if (position < this.#min || position > this.#max) {
						reject();
						return;
					}

					this.setCurrentPosition(position);
					console.log("moving to", serial, this.getCurrentPosition());
				}

				if (serial < this.#moves.length) {
					this.#moveTo(serial + 1)
						.then(resolve)
						.catch(reject);
				} else {
					resolve();
				}
			}, time);
		});
	}

	#getPositionDivTemplate(position) {
		const positionDivContainer = document.createElement("div");
		positionDivContainer.classList.add("numberline-position-container");
		positionDivContainer.dataset.numberlinePosition = position;
		positionDivContainer.style.display = "flex";
		positionDivContainer.style.flexDirection = "column";

		const operationBlock = document.createElement("div");
		operationBlock.classList.add("operation-block");
		operationBlock.dataset.numberlineCurrent = 0;
		positionDivContainer.appendChild(operationBlock);

		const viewBlock = document.createElement("div");
		viewBlock.classList.add("view-block");
		viewBlock.textContent = position;
		positionDivContainer.appendChild(viewBlock);

		return positionDivContainer;
	}
}

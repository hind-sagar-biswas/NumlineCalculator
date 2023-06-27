export default class Numberline {
	constructor(config = {}) {
		const { max = 10, min = -10 } = config;

		this.max = max;
		this.min = min;
		this.container = null;
		this.line = this.createLine(min, max);
	}

	createLine(min, max) {
		return Array.from({ length: max - min + 1 }, (_, i) => min + i);
	}

	render(containerId = "numberline-container") {
		this.container = document.getElementById(containerId);

		// CREATE THE CONTAINER IF NOT FOUND
		if (!this.container) {
			const container = document.createElement("div");
			container.id = containerId;
			document.body.appendChild(container);
			this.container = document.getElementById(containerId);
		}

		// CREATE NUMBER POSITION DIVS FOR THE NUMBER LINE
		for (let index = 0; index < this.line.length; index++) {
			const position = this.line[index];

			const positionDivContainer = document.createElement("div");
			positionDivContainer.classList.add("numberline-position-container");
			positionDivContainer.dataset.position = position;
            positionDivContainer.style.display = 'flex';
            positionDivContainer.style.flexDirection = 'column';

			const operationBlock = document.createElement("div");
			operationBlock.classList.add("operation-block");
			positionDivContainer.appendChild(operationBlock);
            
			const viewBlock = document.createElement("div");
			viewBlock.classList.add("view-block");
            viewBlock.textContent = position;
			positionDivContainer.appendChild(viewBlock);

            this.container.appendChild(positionDivContainer);
		}

		this.container.style.display = "flex";
	}
}

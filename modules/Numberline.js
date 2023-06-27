export default class Numberline {
	constructor(config = {}) {
		const { max = 10, min = -10 } = config;
        
        this.max = max;
        this.min = min;
        this.container = null;
	}

    render(containerId = 'numberline-container') {
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            const container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
            this.container = document.getElementById(containerId);
        }

        this.container.style.display = 'flex';
    }
}

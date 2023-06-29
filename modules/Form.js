export default class Form {
	#rendered = false;
	#fields = [];

	constructor(config = {}) {
		const {
			id = "gen-form",
			name = "gen-form",
			classList = [],
			method = "GET",
			action = null,
		} = config;

		this.id = id;
		this.name = name;
		this.method = method;
		this.action = action;
	}

	setEvents(events = {}) {
		this.events = events;
		if (this.#rendered) {
			for (const event in events) {
				if (Object.hasOwnProperty.call(events, event)) {
					const eventFunction = events[event];
					this.#attachEvents(this.id, event, eventFunction);
				}
			}
		}
	}

	setFields(fieldList = []) {
		this.#fields = [];
		for (let index = 0; index < fieldList.length; index++) {
			const field = fieldList[index];
			let {
				type = "text",
				id = null,
				classList = [],
				name = null,
				placeholder = null,
				value = null,
				min = null,
				max = null,
				step = null,
				options = [],
				dataset = [],
				events = [],
			} = field;
			id = id || `gen-${type}-field-${index}`;
			name = name || `gen-${type}-field-${index}`;

			const build = {
				type,
				id,
				name,
				classList,
				dataset,
				events,
				value,
				placeholder,
			};

			switch (type) {
				case "number":
					build["min"] = min;
					build["max"] = max;
					build["step"] = step || 1;
					break;
				case "select":
					build["options"] = options;
					break;
				default:
					break;
			}

			this.#fields.push(build);
		}
	}

	render(containerId = "form-container") {
		this.#container = document.getElementById(containerId);

		// CREATE THE CONTAINER IF NOT FOUND
		if (!this.#container) {
			const container = document.createElement("div");
			container.id = containerId;
			document.body.appendChild(container);
			this.#container = document.getElementById(containerId);
		}

		// create form
		const form = document.createElement("form");
		form.id = this.id;
		form.name = this.name;
		form.method = this.method;
		if (this.action) form.action = this.action;

		this.#rendered = true;

		// Add events to the form
		for (const event in this.events) {
			if (Object.hasOwnProperty.call(this.events, event)) {
				const eventFunction = this.events[event];
				this.#attachEvents(this.id, event, eventFunction);
			}
		}

		// generate and add fields
		for (let index = 0; index < this.fieldList.length; index++) {
			const fieldObj = this.fieldList[index];
			const field = this.#generate(fieldObj);
			form.appendChild(field);
		}
	}

	#generate(fieldObj) {
		if (fieldObj.type == "select") {
			const field = document.createElement("select");

			for (let index = 0; index < fieldObj.options.length; index++) {
				const optionObj = fieldObj.options[index];
				const option = document.createElement("option");
				option.value = optionObj.value;
				option.textContent = optionObj.name;
				field.appendChild(option);
			}
		} else {
			const field = document.createElement("input");
			field.type = fieldObj.type;

			if (fieldObj.type == "number") {
				if (fieldObj.min) field.min = fieldObj.min;
				if (fieldObj.max) field.max = fieldObj.max;
				field.step = fieldObj.step;
			}
		}

		field.id = fieldObj.id;
		field.name = fieldObj.name;

		// add class
		for (let index = 0; index < fieldObj.classList.length; index++) {
			field.classList.add(fieldObj.classList[index]);
		}
	}

	#attachEvents(to, event, eventFunction) {
		const eventTarget = document.getElementById(to);
		if (eventTarget) {
			eventTarget.addEventListener(event, eventFunction);
		} else {
			console.warn(
				`Could not add '${event}' event to '#${to} : Element does not Exists!`
			);
		}
	}
}

export default class Form {
	#rendered = false;
	#container = null;
	#fields = [];

	constructor(config = {}) {
		const {
			id = "gen-form",
			name = "gen-form",
			structure = 'inline',
			classList = [],
			method = "GET",
			action = null,
		} = config;

		this.id = id;
		this.name = name;
		this.method = method;
		this.classList = classList;
		this.action = action;
		this.structure = structure;
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
		let form = document.createElement("form");
		form.id = this.id;
		form.name = this.name;
		form.method = this.method;
		if (this.action) form.action = this.action;

		this.#rendered = true;

		// Add events to the form
		for (const event in this.events) {
			if (Object.hasOwnProperty.call(this.events, event)) {
				const eventFunction = this.events[event];
				form = this.#attachEvents(form, event, eventFunction, 'node');
			}
		}

		// generate and add fields
		for (let index = 0; index < this.#fields.length; index++) {
			const fieldObj = this.#fields[index];
			const field = this.#generate(fieldObj);

			if (this.structure == "stack") {
				const fieldContainer = document.createElement('div');
				fieldContainer.classList.add('gen-field-container');
				fieldContainer.appendChild(field);
				form.appendChild(fieldContainer);
			} else {
				form.appendChild(field);
			}
		}

		this.#container.appendChild(form);
	}

	#generate(fieldObj) {
		let field = null;
		if (fieldObj.type == "select") {
			field = document.createElement("select");

			for (let index = 0; index < fieldObj.options.length; index++) {
				const optionObj = fieldObj.options[index];
				const option = document.createElement("option");
				option.value = optionObj.value;
				option.textContent = optionObj.name;
				field.appendChild(option);
			}
		} else {
			field = document.createElement("input");
			field.type = fieldObj.type;

			if (fieldObj.type == "number") {
				if (fieldObj.min) field.min = fieldObj.min;
				if (fieldObj.max) field.max = fieldObj.max;
				field.step = fieldObj.step;
			}
		}

		field.id = fieldObj.id;
		field.name = fieldObj.name;
		if (fieldObj.placeholder) field.placeholder = fieldObj.placeholder;
		if (fieldObj.value) field.value = fieldObj.value;

		// add class
		field.classList.add('gen-field');
		field.classList.add(...fieldObj.classList);

		for (const event in fieldObj.events) {
			if (Object.hasOwnProperty.call(fieldObj.events, event)) {
				const eventMethod = fieldObj.events[event];
				field = this.#attachEvents(field, event, eventMethod, "node");
			}
		}

		// add dataset values
		for (const dataKey in fieldObj.dataset) {
			if (Object.hasOwnProperty.call(fieldObj.dataset, dataKey)) {
				const data = fieldObj.dataset[dataKey];
				field.dataset[dataKey] = data;
			}
		}

		return field;
	}

	#attachEvents(to, event, eventFunction, to_type = "id") {
		let eventTarget = null;
		if (to_type == "id") {
			eventTarget = document.getElementById(to);
		} else {
			eventTarget = to;
		}
		if (eventTarget) {
			eventTarget.addEventListener(event, eventFunction);
		} else {
			console.warn(
				`Could not add '${event}' event to '#${to} : Element does not Exists!`
			);
		}
		if (to_type == "node") return eventTarget;
	}
}

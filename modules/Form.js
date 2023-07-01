export default class Form {
	#rendered = false;
	#container = null;
	#fields = [];

	constructor(config = {}) {
		const {
			id = "gen-form",
			name = "gen-form",
			structure = "inline",
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
				if (events.hasOwnProperty(event)) {
					const eventFunction = events[event];
					this.#attachEvents(this.id, event, eventFunction);
				}
			}
		}
	}

	setFields(fieldList = []) {
		this.#fields = fieldList.map((field, index) => {
			const {
				type = "text",
				id = `gen-${type}-field-${index}`,
				classList = [],
				name = `gen-${type}-field-${index}`,
				placeholder = null,
				value = null,
				min = null,
				max = null,
				step = null,
				options = [],
				dataset = {},
				events = {},
			} = field;

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

			if (type === "number") {
				build.min = min;
				build.max = max;
				build.step = step || 1;
			} else if (type === "select") {
				build.options = options;
			}

			return build;
		});
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
			if (this.events.hasOwnProperty(event)) {
				const eventFunction = this.events[event];
				form = this.#attachEvents(form, event, eventFunction, "node");
			}
		}

		// generate and add fields
		this.#fields.forEach((fieldObj) => {
			const field = this.#generate(fieldObj);

			if (this.structure === "stack") {
				const fieldContainer = document.createElement("div");
				fieldContainer.classList.add("gen-field-container");
				fieldContainer.appendChild(field);
				form.appendChild(fieldContainer);
			} else {
				form.appendChild(field);
			}
		});

		this.#container.appendChild(form);
	}

	#generate(fieldObj) {
		let field = null;

		if (fieldObj.type === "select") {
			field = document.createElement("select");

			fieldObj.options.forEach((optionObj) => {
				const option = document.createElement("option");
				option.value = optionObj.value;
				option.textContent = optionObj.name;
				field.appendChild(option);
			});
		} else {
			field = document.createElement("input");
			field.type = fieldObj.type;

			if (fieldObj.type === "number") {
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
		field.classList.add("gen-field");
		field.classList.add(...fieldObj.classList);

		for (const event in fieldObj.events) {
			if (fieldObj.events.hasOwnProperty(event)) {
				const eventMethod = fieldObj.events[event];
				field = this.#attachEvents(field, event, eventMethod, "node");
			}
		}

		// add dataset values
		for (const dataKey in fieldObj.dataset) {
			if (fieldObj.dataset.hasOwnProperty(dataKey)) {
				const data = fieldObj.dataset[dataKey];
				field.dataset[dataKey] = data;
			}
		}

		return field;
	}

	#attachEvents(to, event, eventFunction, toType = "id") {
		let eventTarget = null;

		if (toType === "id") {
			eventTarget = document.getElementById(to);
		} else {
			eventTarget = to;
		}

		if (eventTarget) {
			eventTarget.addEventListener(event, eventFunction);
		} else {
			console.warn(
				`Could not add '${event}' event to '#${to}': Element does not exist!`
			);
		}

		if (toType === "node") return eventTarget;
	}
}

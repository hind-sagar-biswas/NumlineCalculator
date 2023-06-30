const formFields = [
	{
		type: "number",
		name: "left",
		value: 1,
		classList: ["form-control", "mb-2"],
	},
	{
		type: "select",
		name: "operator",
		classList: ["form-control", "mb-2"],
		options: [
			{
				name: "+",
				value: "add",
			},
			{
				name: "-",
				value: "sub",
			},
			{
				name: "*",
				value: "mul",
			},
			{
				name: "/",
				value: "div",
			},
		],
	},
	{
		type: "number",
		name: "right",
		classList: ["form-control", "mb-2"],
		value: 1,
	},
	{
		type: "submit",
		name: "calculate",
		name: "submit",
		classList: ["btn", "btn-primary"],
	},
];

window.addEventListener("load", () => {
	const form = new App.form({
		structure: "stack",
	});
	form.setEvents({
		submit: (e) => {
			e.preventDefault();
			const inputs = [...e.target];
			const left = parseInt(inputs[0].value);
			const generic_operator = inputs[1].value;
			const right = parseInt(inputs[2].value);
			
			const parser = new App.parseExp(left, right, generic_operator);
			const parsedExp = parser.parse();

			const operator = new App.operator(parsedExp);
			console.log(operator.operate());

			const numberline = new App.numberline({
				min: parsedExp.limit[0],
				max: parsedExp.limit[1],
			});
			numberline.render();
		},
	});
	form.setFields(formFields);
	form.render("form-container");
});

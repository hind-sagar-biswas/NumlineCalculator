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
		value: "Go",
		name: "submit",
		classList: ["btn", "btn-warning"],
	},
];

const prepareApp = () => {
	return new Promise((resolve, reject) => {
		const simplifier = new App.simplifier();
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
				const [result, moves] = operator.operate();

				const simp = simplifier.simplify(
					{ left, right, operator: generic_operator },
					parsedExp
				);
				document.getElementById("simplification-container").innerHTML = simp;

				window.numberline = new App.numberline({
					min: parsedExp.limit[0],
					max: parsedExp.limit[1],
				});
				numberline.render();
				numberline.move(moves);
			},
		});
		form.setFields(formFields);
		form.render("form-container");

		resolve();
	});
};

const openCurtain = () => {
	const curtain = document.getElementById("loader");
	if (curtain) {
		curtain.classList.add("hide");
	}
};

window.addEventListener("load", () => {
	prepareApp().then(openCurtain);
});

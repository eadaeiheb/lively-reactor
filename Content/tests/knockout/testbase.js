window.jQuery = window.$ = require("../../../node_modules/jquery/dist/jquery");
window.ko = require("knockout");
ko.test = (tag, binding, test, async) => {
	const div = document.createElement("div");
	const body = document.body;
	body.appendChild(div);
	const viewModel = { Id: "test" };
	ko.applyBindings(viewModel, div);
	div.innerHTML = "<div data-bind='with: viewModel' id='container'></div>";
	const element = document.createElement(tag);
	document.getElementById("container").appendChild(element);
	ko.applyBindingsToNode(element, binding, ko.contextFor(element));
	const args = {
		clean: () => element.parentNode.removeChild(element),
		async
	};
	test(element, args);

	if (!args.async) {
		args.clean();
	}
};
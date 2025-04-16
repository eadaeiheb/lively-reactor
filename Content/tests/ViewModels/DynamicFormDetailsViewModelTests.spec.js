window.jQuery = window.$ = require("jquery");
require("../testbase");
require("../JaydataDbModel");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
window.Helper.DynamicForm = require("../../../Plugins/Crm.DynamicForms/Content/ts/Helper.DynamicForm").HelperDynamicForm;
window.Helper.Culture = require("../../../Plugins/Main/Content/ts/helper/Helper.Culture").HelperCulture;
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/DefaultViewModel");
require("../../../Plugins/Crm.DynamicForms/Content/ts/DynamicFormEditViewModel");
require("../../../Plugins/Crm.DynamicForms/Content/ts/DynamicFormDetailsViewModel");
require("../../../node_modules/knockout.validation");

describe("DynamicFormEditViewModelTests", () => {
	
	test("Retrieve fixed choices for fixed option list", async() => {
		await window.Helper.Database.initialize();
		const viewModel = new window.Crm.DynamicForms.ViewModels.DynamicFormEditViewModel();
		const formElement = {
			Choices: ko.observable(3),
			UseFixedChoices: ko.observable(false),
			HideNotApplicable: ko.observable(false),
			FormElementType: ko.observable(),
			Localizations: ko.observableArray([]),
		};
		viewModel.initFormElement(formElement);
		formElement.UseFixedChoices(true);
		expect(formElement.Choices()).toEqual(3);
		formElement.HideNotApplicable(true);
		expect(formElement.Choices()).toEqual(2);
	});
});

describe("DynamicFormDetailsViewModelTests", () => {
	let viewModel = new window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel();
	let element = null;
	beforeEach(async () => {
		await window.Helper.Database.initialize();
		element = new window.database.DynamicFormElementRest.createNew({
			Response: null,
			FormElementType: ko.observable("Number")
		});
		element.isVisible = ko.observable(true);
		element.MinValue = ko.observable(null);
		element.MaxValue = ko.observable(null);
		viewModel.validationRulesAdded(false);
	});
	test("Min validation should be set for number element with min value of 0", async () => {
		viewModel.elements([element])
		element.MinValue(0);

		viewModel.addValidationRules();
		const minValueValidations = viewModel.elements()[0].Response.rules().filter(r => r.rule === "min");
		expect(minValueValidations.length).toEqual(1);
		expect(minValueValidations.every(v => v.condition.apply(element))).toBeTruthy();
	});
	test("Min validation shouldn't be set for number element with min value of null", async () => {
		element.MinValue = ko.observable(null);
		viewModel.elements([element])

		viewModel.addValidationRules();
		expect(viewModel.elements()[0].Response.rules().filter(r => r.rule === "min").length).toEqual(0);
	});
	test("Min validation shouldn't be set for number element with min value of undefined", async () => {
		element.MinValue = ko.observable(undefined);
		viewModel.elements([element])

		viewModel.addValidationRules();
		expect(viewModel.elements()[0].Response.rules().filter(r => r.rule === "min").length).toEqual(0);
	});

	test("Max validation should be set for number element with max value of 0", async () => {
		viewModel.elements([element])
		element.MaxValue(0);

		viewModel.addValidationRules();
		const maxValueValidations = viewModel.elements()[0].Response.rules().filter(r => r.rule === "max");
		expect(maxValueValidations.length).toEqual(1);
		expect(maxValueValidations.every(v => v.condition.apply(element))).toBeTruthy();
	});
	test("Max validation shouldn't be set for number element with max value of null", async () => {
		element.MaxValue = ko.observable(null);
		viewModel.elements([element])

		viewModel.addValidationRules();
		expect(viewModel.elements()[0].Response.rules().filter(r => r.rule === "max").length).toEqual(0);
	});
	test("Max validation shouldn't be set for number element with max value of undefined", async () => {
		element.MaxValue = ko.observable(undefined);
		viewModel.elements([element])

		viewModel.addValidationRules();
		expect(viewModel.elements()[0].Response.rules().filter(r => r.rule === "max").length).toEqual(0);
	});
	test("Neither min or max validation should be applied if min and max value has a value of 0", async () => {
		element.MaxValue = ko.observable(0);
		element.MinValue = ko.observable(0);
		viewModel.elements([element])

		viewModel.addValidationRules();
		const minAndMaxValidations = viewModel.elements()[0].Response.rules().filter(r => r.rule === "max" || r.rule === "min");
		expect(minAndMaxValidations.length).toEqual(2);
		expect(minAndMaxValidations.every(v => v.condition.apply(element))).toBeFalsy();
	});
});
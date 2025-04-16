window.swal = () => {};
require("../testbase");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../JaydataDbModel");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../Plugins/Main/Content/ts/knockout.custom");
require("../../../Plugins/Main/Content/ts/knockout.custom.validation");
require("../../../Plugins/Crm.Project/Content/ts/validation-rules");
require("../../../Plugins/Main/Content/ts/PmbbViewModel");
require("../../../Plugins/Main/Content/ts/InlineEditorViewModel");


let potential;
let genericListViewModel;

function bindForParams(component) {
	component.isBind = true;
}
function onBeforeSave(component) {
	return new Promise((resolve) => {
		component.editContext().SourceTypeKey("101");
		resolve();
	});
}

describe("InlineEditorViewModel", () => {
	beforeEach(() =>
		window.Helper.Database.initialize().then(() => {
			potential = window.database.CrmProject_Potential.CrmProject_Potential.create();
			genericListViewModel = new window.Main.ViewModels.GenericListViewModel("Crm_Company");
		}));

	test("Component is initialize with the correct params",  () => {
		expect.assertions(4);
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel({ context: potential.asKoObservable() });
		const viewContextNotNull = inlineEditorViewModel.viewContext() != null;
		expect(viewContextNotNull).toBe(true);
		const editContextNotNull = inlineEditorViewModel.editContext() != null;
		expect(editContextNotNull).toBe(true);
		expect(window.database.stateManager.trackedEntities.length).toBe(1);
		expect(window.database.stateManager.trackedEntities[0].entitySet.collectionName).toBe("CrmProject_Potential");
	});

	test("IsEditing is initialize and reset correctly",  () => {
		expect.assertions(2);
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel({ context: potential.asKoObservable() });

		expect(genericListViewModel.isEditing()).toBeNull();
		genericListViewModel.isEditing("8297017d-02f2-46bc-97f7-b7d4e9fb0388");

		inlineEditorViewModel.reset(genericListViewModel);

		expect(genericListViewModel.isEditing()).toBeNull();
	});

	test("Properties are transfered correctly", () => {
		expect.assertions(2);
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel({ context: potential.asKoObservable() });

		inlineEditorViewModel.editContext().Name("Test Name");
		inlineEditorViewModel.editContext().SourceTypeKey("106");
		expect(inlineEditorViewModel.viewContext().Name()).toBeNull();

		inlineEditorViewModel.transferChangedProperties(inlineEditorViewModel);
		expect(inlineEditorViewModel.viewContext().Name()).toBe(inlineEditorViewModel.editContext().Name());
	});

	test("Entity is save correctly", async () => {
		expect.assertions(1);
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel({ context: potential.asKoObservable() });

		inlineEditorViewModel.editContext().Name("Test Name");
		inlineEditorViewModel.editContext().SourceTypeKey("106");

		await inlineEditorViewModel.submit(genericListViewModel, inlineEditorViewModel);

		const id = inlineEditorViewModel.editContext().Id();
		const savedPotential = await window.database.CrmProject_Potential.find(id);

		expect(savedPotential.Name).toBe(inlineEditorViewModel.viewContext().Name());
	});

	test("onInit param", () => {
		expect.assertions(2);
		const params = {
			context: potential.asKoObservable(),
			onInit: bindForParams
		};
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel(params);
		expect(inlineEditorViewModel.params.onInit).not.toBeNull();
		expect(typeof (inlineEditorViewModel.params.onInit)).toBe("function");
	});

	test("onBeforeSave param", async () => {
		expect.assertions(3);
		const params = {
			context: potential.asKoObservable(),
			onBeforeSave: onBeforeSave
		};
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel(params);

		expect(inlineEditorViewModel.params.onBeforeSave).not.toBeNull();
		expect(typeof (inlineEditorViewModel.params.onBeforeSave)).toBe("function");

		await inlineEditorViewModel.submit(genericListViewModel, inlineEditorViewModel);
		const id = inlineEditorViewModel.editContext().Id();
		const savedPotential = await window.database.CrmProject_Potential.find(id);

		expect(savedPotential.SourceTypeKey).toBe("101");
	});

	test("onAfterSave param", async () => {
		expect.assertions(3);
		const params = {
			context: potential.asKoObservable(),
			onAfterSave: bindForParams
		};

		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel(params);

		inlineEditorViewModel.editContext().Name("Test Name");
		inlineEditorViewModel.editContext().SourceTypeKey("106");

		expect(inlineEditorViewModel.params.onAfterSave).not.toBeNull();
		expect(typeof (inlineEditorViewModel.params.onAfterSave)).toBe("function");

		await inlineEditorViewModel.submit(genericListViewModel, inlineEditorViewModel);
		expect(inlineEditorViewModel.isBind).toBe(true);

	});

	test("onSave param", async () => {
		expect.assertions(3);
		const params = {
			context: potential.asKoObservable(),
			onSave: bindForParams
		};
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel(params);

		inlineEditorViewModel.editContext().Name("Test Name");
		inlineEditorViewModel.editContext().SourceTypeKey("106");

		expect(inlineEditorViewModel.params.onSave).not.toBeNull();
		expect(typeof (inlineEditorViewModel.params.onSave)).toBe("function");

		await inlineEditorViewModel.submit(genericListViewModel, inlineEditorViewModel);

		expect(inlineEditorViewModel.isBind).toBe(true);
	});
	test("onCancel param", () => {
		expect.assertions(3);
		const params = {
			context: potential.asKoObservable(),
			onCancel: bindForParams
		};
		const inlineEditorViewModel = new window.Main.ViewModels.InlineEditorViewModel(params);

		expect(inlineEditorViewModel.params.onCancel).not.toBeNull();
		expect(typeof (inlineEditorViewModel.params.onCancel)).toBe("function");

		inlineEditorViewModel.cancel(genericListViewModel, inlineEditorViewModel);

		expect(inlineEditorViewModel.isBind).toBe(true);
	}, 30000);
});


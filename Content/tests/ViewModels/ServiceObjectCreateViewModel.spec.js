require("../testbase");
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../JaydataDbModel");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../Plugins/Main/Content/ts/knockout.custom");
require("../../../Plugins/Main/Content/ts/knockout.custom.validation");
require("../../../Plugins/Main/Content/ts/validation-rules");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm/Content/ts/AddressEditorViewModel");
require("../../../Plugins/Crm/Content/ts/knockout.component.addressEditor");
require("../../../Plugins/Crm/Content/ts/validation-rules");
require("../../../Plugins/Crm.Service/Content/ts/ServiceObjectCreateViewModel");
require("../../../Plugins/Main/Content/ts/VisibilityViewModel");
window.Helper.Address = require("../../../Plugins/Crm/Content/ts/helper/Helper.Address").HelperAddress;


describe("ServiceObjectCreateViewModel", () => {

	test("address is validated", async () => {
		const viewModel = new window.Crm.Service.ViewModels.ServiceObjectCreateViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		window.NumberingService = window.NumberingService || {};
		window.NumberingService.getNextFormattedNumber = function () {
			return "next";
		};
		await window.Helper.Database.initialize();
		window.database.saveChanges = function () {
			expect(true).toBe("saveChanges should not be called");
		};
		await viewModel.init();
		new Crm.ViewModels.AddressEditorViewModel({onLoad: async (addressEditor) => {
			addressEditor.loading.subscribe(async loading => {
				viewModel.serviceObject().Name("123");
				viewModel.serviceObject().CategoryKey("123");
				expect(viewModel.errors()).toHaveLength(0);
				expect(addressEditor.addressErrors()).not.toHaveLength(0);
				try {
					await viewModel.submit();
					expect(false).toBe("success should not be called");
				} catch (e) {
					expect(true).toBe(true);
				}
			});
		}});
	}, 10000);
});
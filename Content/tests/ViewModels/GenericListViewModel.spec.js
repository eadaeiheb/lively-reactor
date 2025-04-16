require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Main/Content/ts/helper/Helper.Url");
require("../../../Plugins/Main/Content/ts/knockout.custom.filterOperator");
require("../../../Plugins/Main/Content/ts/knockout.custom.infiniteScroll");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
window.Helper.Object = require("../../../Plugins/Main/Content/ts/helper/Helper.Object").HelperObject;

describe("GenericListViewModelTests", () => {
	test("paging ignored if infiniteScroll is used", async () => {
		await window.Helper.Database.initialize();
		const viewModel = new window.Main.ViewModels.GenericListViewModel("Crm_Company");
		viewModel.infiniteScroll(true);

		await viewModel.init.call(viewModel, null, {page: 5});
		expect(viewModel.page()).toBe(1);
		expect(viewModel.getParamsObject().page).toBeUndefined();
	}, 10000);

	test("paging is allowed if infiniteScroll is not used", async () => {
		await window.Helper.Database.initialize();
		const viewModel = new window.Main.ViewModels.GenericListViewModel("Crm_Company");
		viewModel.infiniteScroll(false);

		await viewModel.init.call(viewModel, null, {page: 5})
		expect(viewModel.page()).toBe(5);
		expect(viewModel.getParamsObject().page).toBe(5);
	});

	test("filter input is splitted by word", async () => {
		await window.Helper.Database.initialize();
		window.database.CrmService_ServiceCase.addMany([{
			Id: $data.Guid.NewGuid(),
			ErrorMessage: "dummy"
		}, {
			Id: $data.Guid.NewGuid(),
			ErrorMessage: "UJF7151plus oder plus2 Probleme mit Weißdruck"
		}, {
			Id: $data.Guid.NewGuid(),
			ErrorMessage: "UJF7151plus Weiss läuft aus am Damper gebrochen?"
		}, {
			Id: $data.Guid.NewGuid(),
			ErrorMessage: "UJF7151plus - Kunde will ein Angebot über ein Druckkopftausch Weiss hat Verkrustungen"
		}]);
		await database.saveChanges();

		const viewModel = new window.Main.ViewModels.GenericListViewModel("CrmService_ServiceCase");
		await viewModel.init();

		await viewModel.search(false, false, false);
		expect(viewModel.items().length).toBe(4);

		viewModel.getFilter("ErrorMessage").extend({filterOperator: "contains"})("UJF7151plus Wei");
		await viewModel.search(false, false, false);
		expect(viewModel.items().length).toBe(3);

		viewModel.getFilter("ErrorMessage").extend({filterOperator: "contains"})('"UJF7151plus Wei"');
		await viewModel.search(false, false, false);
		expect(viewModel.items().length).toBe(1);
	});
});

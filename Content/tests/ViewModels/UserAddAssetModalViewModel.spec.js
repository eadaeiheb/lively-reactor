require("../testbase");
require("../JaydataDbModel");
require("knockout.validation");
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm/Content/ts/UserAddAssetModalViewModel");

describe("UserAddAssetModalViewModelTests", () => {

	beforeAll(async () => {
		await window.Helper.Database.initialize();

		window.database.Main_Asset.add({
			Id: $data.Guid.NewGuid(),
			Key: "test01",
			Value: "😄",
			Language: "en"
		});
		window.database.Main_Asset.add({
			Id: $data.Guid.NewGuid(),
			Key: "test02",
			Value: "Test 02 bla",
			Language: "en"
		});
		window.database.Main_Asset.add({
			Id: $data.Guid.NewGuid(),
			Key: "test03",
			Value: "Blabla bla",
			Language: "en"
		});
		await window.database.saveChanges();
	});

	test("queryLookup without filter and without existing assets returns all assets", async () => {
		const viewModel = new window.Main.ViewModels.UserAddAssetModalViewModel();
		viewModel.existingAssets = [];

		const result = await viewModel.queryLookup(window.database.Main_Asset, null).toArray();

		expect(result.length).toEqual(3);
	});

	test("queryLookup with filter and without existing assets returns assets matching the criteria", async () => {
		const viewModel = new window.Main.ViewModels.UserAddAssetModalViewModel();
		viewModel.existingAssets = [];

		const result = await viewModel.queryLookup(window.database.Main_Asset, "bla").toArray();

		expect(result.length).toEqual(2);
	});
});

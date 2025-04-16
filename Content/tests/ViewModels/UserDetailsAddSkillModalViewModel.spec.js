require("../testbase");
require("../JaydataDbModel");
require("knockout.validation");
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm.Service/Content/ts/UserDetailsAddSkillModalViewModel");

describe("UserDetailsAddSkillModalViewModelTests", () => {

	beforeAll(async () => {
		await window.Helper.Database.initialize();

		window.database.Main_Skill.add({
			Id: $data.Guid.NewGuid(),
			Key: "test01",
			Value: "😄",
			Language: "en"
		});
		window.database.Main_Skill.add({
			Id: $data.Guid.NewGuid(),
			Key: "test02",
			Value: "Test 02 bla",
			Language: "en"
		});
		window.database.Main_Skill.add({
			Id: $data.Guid.NewGuid(),
			Key: "test03",
			Value: "Blabla bla",
			Language: "en"
		});
		await window.database.saveChanges();
	});

	test("queryLookup without filter and without existing skills returns all skills", async () => {
		const viewModel = new window.Crm.Service.ViewModels.UserDetailsAddSkillModalViewModel();
		viewModel.existingSkills = [];

		const result = await viewModel.queryLookup(window.database.Main_Skill, null).toArray();

		expect(result.length).toEqual(3);
	});

	test("queryLookup with filter and without existing skills returns skills matching the criteria", async () => {
		const viewModel = new window.Crm.Service.ViewModels.UserDetailsAddSkillModalViewModel();
		viewModel.existingSkills = [];

		const result = await viewModel.queryLookup(window.database.Main_Skill, "bla").toArray();

		expect(result.length).toEqual(2);
	});
});

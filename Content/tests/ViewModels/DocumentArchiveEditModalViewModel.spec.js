require("../testbase");
require("../JaydataDbModel");
require("bootstrap");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
window.ko = require("knockout");
window.jQuery = window.$ = require("jquery");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../Plugins/Main/Content/ts/knockout.custom.validation");
require("../../../Plugins/Crm/Content/ts/DocumentArchiveEditModalViewModel");

describe("DocumentArchiveEditModalViewModel", () => {
	test("Add document attribute as thumbnail to article", async () => {
		await window.Helper.Database.initialize();

		const viewModel = new window.Crm.ViewModels.DocumentArchiveEditModalViewModel();

		await viewModel.init.call(viewModel, null, { referenceKey: "91C72F4B-FC89-E511-A145-005056C00008", referenceType: 100 });

		viewModel.fileResource().Filename("AttachedFileForThumbnail.png");
		viewModel.fileResource().ContentType("image/png");
		viewModel.fileResource().CreateUser("anne.techniker");
		viewModel.fileResource().ModifyUser("anne.techniker");
		viewModel.fileResource().Length(123);
		viewModel.documentAttribute().Description("test");

		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(false);
		viewModel.UseForThumbnail(true);
		expect(viewModel.UseForThumbnail()).toBe(true);
		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(true);
		await viewModel.save();

		expect(viewModel.UseForThumbnail()).toBe(true);
		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(true);
	});
	test("Add new thumbnail to article", async () => {
		await window.Helper.Database.initialize();

		const viewModel = new window.Crm.ViewModels.DocumentArchiveEditModalViewModel();

		await viewModel.init.call(viewModel, null, { referenceKey: "91C72F4B-FC89-E511-A145-005056C00008", referenceType: 100 });

		viewModel.fileResource().Filename("AttachedFileForThumbnail.png");
		viewModel.fileResource().ContentType("image/png");
		viewModel.fileResource().CreateUser("anne.techniker");
		viewModel.fileResource().ModifyUser("anne.techniker");
		viewModel.fileResource().Length(123);
		viewModel.documentAttribute().Description("test");

		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(false);
		viewModel.UseForThumbnail(true);
		expect(viewModel.UseForThumbnail()).toBe(true);
		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(true);
		await viewModel.save();

		var document = await window.database.Crm_DocumentAttribute.find(viewModel.documentAttribute().Id());
		expect(document.UseForThumbnail).toBe(true);

		expect(viewModel.UseForThumbnail()).toBe(true);
		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(true);

		viewModel.UseForThumbnail(false);
		expect(viewModel.UseForThumbnail()).toBe(false);
		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(false);

		await viewModel.init.call(viewModel, null, { referenceKey: "91C72F4B-FC89-E511-A145-005056C00008", referenceType: 100 });

		viewModel.fileResource().Filename("NewThumbnail.png");
		viewModel.fileResource().ContentType("image/png");
		viewModel.fileResource().CreateUser("anne.techniker");
		viewModel.fileResource().ModifyUser("anne.techniker");
		viewModel.fileResource().Length(123);
		viewModel.documentAttribute().Description("test2");

		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(false);
		viewModel.UseForThumbnail(true);
		expect(viewModel.UseForThumbnail()).toBe(true);
		expect(viewModel.documentAttribute().UseForThumbnail()).toBe(true);
		await viewModel.save();

		const document2 = await window.database.Crm_DocumentAttribute.find(viewModel.documentAttribute().Id());
		expect(document2.UseForThumbnail).toBe(true);

		document = await window.database.Crm_DocumentAttribute.find(document.Id);
		expect(document.UseForThumbnail).toBe(false);
	});
});
require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Crm/Content/ts/DocumentAttributeListIndexViewModel");

describe("DocumentAttributeListIndexViewModel", () => {
	test("Remove document attribute from service order test", async () => {
		await window.Helper.Database.initialize();
		(window.Helper.Confirm ||= {}).confirmDelete = function () {
			return $.Deferred().resolve().promise();
		};

		const viewModel = new window.Crm.ViewModels.DocumentAttributeListIndexViewModel();
		const documentAttribute = window.database.Crm_DocumentAttribute.Crm_DocumentAttribute.create();
		const fileResource = window.database.Crm_FileResource.Crm_FileResource.create();

		fileResource.Id = $data.createGuid().toString().toLowerCase();
		fileResource.Filename = "AttachedFileToRemove.txt";
		fileResource.ContentType = "text/plain";
		fileResource.CreateUser = "anne.techniker";
		fileResource.ModifyUser = "anne.techniker";
		fileResource.Length = 123;
		documentAttribute.FileResourceKey = fileResource.Id;
		documentAttribute.FileName = fileResource.Filename;
		documentAttribute.FileResource = fileResource;

		window.database.attach(documentAttribute);
		window.database.attach(documentAttribute.FileResource);
		expect(documentAttribute.entityState).toBe($data.EntityState.Unchanged);
		expect(documentAttribute.FileResource.entityState).toBe($data.EntityState.Unchanged);

		window.database.saveChanges = function () {
			expect(documentAttribute.entityState).toBe($data.EntityState.Deleted);
			expect(documentAttribute.FileResource).toBeNull();
		};
		viewModel.remove(documentAttribute.asKoObservable());
	});
});

require("../testbase");
require("../JaydataDbModel");
window.Helper.Confirm = {};
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
window.Helper.StatisticsKey = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.StatisticsKey").HelperStatisticsKey;
window.Helper.Service = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.Service").HelperService;
window.Helper.ServiceOrder = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder").HelperServiceOrder;
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Crm/Content/ts/GenericListViewModel.Geolocation");
require("../../../Plugins/Crm/Content/ts/ContactListViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderHeadListIndexViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderCreateViewModel");
require("../../../Plugins/Crm.Service/Content/ts/DispatchDetailsViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderDetailsMaterialsTabViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderDispatchListIndexViewModel");
require("../../../Plugins/Crm.Service/Content/ts/DispatchDetailsMaterialsTabViewModel");

describe("DispatchDetailsMaterialsTabViewModel", () => {
	test("Remove cost material with attachment from service order test", async () => {
		await window.Helper.Database.initialize();
		window.Helper.Confirm.confirmDeleteAsync = async function () {
			return true;
		};

		window.Crm.Service.Settings = window.Crm.Service.Settings || {
			ServiceContract: {MaintenanceOrderGenerationMode: "OrderPerInstallation"}
		};

		const dispatchDetailsViewModel = new window.Crm.Service.ViewModels.DispatchDetailsViewModel();
		const dispatchDetailsMaterialsTabViewModel = new window.Crm.Service.ViewModels.DispatchDetailsMaterialsTabViewModel(dispatchDetailsViewModel);
		const serviceOrderMaterial = window.database.CrmService_ServiceOrderMaterial.CrmService_ServiceOrderMaterial.create();
		const documentAttribute = window.database.Crm_DocumentAttribute.Crm_DocumentAttribute.create();
		const fileResource = window.database.Crm_FileResource.Crm_FileResource.create();

		fileResource.Id = $data.createGuid().toString().toLowerCase();
		fileResource.Filename = "AttachedFileToRemove.txt";
		fileResource.ContentType = "text/plain";
		fileResource.Length = 123;
		documentAttribute.FileResourceKey = fileResource.Id;
		documentAttribute.FileName = fileResource.Filename;
		documentAttribute.FileResource = fileResource;
		serviceOrderMaterial.Id = $data.createGuid().toString().toLowerCase();
		serviceOrderMaterial.ActualQty = 1;
		serviceOrderMaterial.ArticleId = $data.createGuid().toString().toLowerCase();
		serviceOrderMaterial.Description = "material desc";
		serviceOrderMaterial.DispatchId = $data.createGuid().toString().toLowerCase();
		serviceOrderMaterial.DocumentAttributes = [documentAttribute];

		window.$.mockjax({
			url: "/api/CrmService_ServiceOrderMaterialSerial?$filter=(OrderMaterialId eq guid'" + serviceOrderMaterial.Id + "')",
			responseText: []
		});

		window.database.attach(serviceOrderMaterial);
		window.database.attach(serviceOrderMaterial.DocumentAttributes[0]);
		window.database.attach(serviceOrderMaterial.DocumentAttributes[0].FileResource);
		expect(serviceOrderMaterial.entityState).toBe($data.EntityState.Unchanged);
		expect(serviceOrderMaterial.DocumentAttributes[0].entityState).toBe($data.EntityState.Unchanged);
		expect(serviceOrderMaterial.DocumentAttributes[0].FileResource.entityState).toBe($data.EntityState.Unchanged);

		window.database.saveChanges = () => {
			expect(serviceOrderMaterial.entityState).toBe($data.EntityState.Deleted);
			expect(serviceOrderMaterial.DocumentAttributes[0].entityState).toBe($data.EntityState.Deleted);
			expect(serviceOrderMaterial.DocumentAttributes[0].FileResource).toBeNull();
		};
		dispatchDetailsMaterialsTabViewModel.deleteServiceOrderMaterial(serviceOrderMaterial.asKoObservable());
	});

	test("PositionNumber", async () => {
		await window.Helper.Database.initialize();
		window.Crm.Service.Settings = window.Crm.Service.Settings || {
			ServiceContract: {MaintenanceOrderGenerationMode: "JobPerInstallation"}
		};

		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		const serviceOrderMaterial = window.database.CrmService_ServiceOrderMaterial.CrmService_ServiceOrderMaterial.create().asKoObservable();
		const serviceOrderTime = window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create().asKoObservable();

		serviceOrder.Id($data.createGuid().toString().toLowerCase());
		dispatch.Id($data.createGuid().toString().toLowerCase());
		dispatch.ServiceOrder = window.ko.observable(serviceOrder);

		serviceOrderMaterial.Id($data.createGuid().toString().toLowerCase());
		serviceOrderMaterial.ArticleId($data.createGuid().toString().toLowerCase());
		serviceOrderMaterial.Description("material desc");
		serviceOrderMaterial.OrderId(serviceOrder.Id());
		serviceOrderMaterial.Quantity(1);

		serviceOrderTime.Id($data.createGuid().toString().toLowerCase());
		serviceOrderTime.OrderId(serviceOrder.Id());


		await window.Helper.ServiceOrder.updateMaterialPosNo(serviceOrderMaterial);
		expect(serviceOrderMaterial.PosNo()).toBe("0001");

		await window.Helper.ServiceOrder.updateMaterialPosNo(serviceOrderTime);
		expect(serviceOrderTime.PosNo()).toBe("0001");

	});

});

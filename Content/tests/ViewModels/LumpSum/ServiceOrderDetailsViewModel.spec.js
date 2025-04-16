require("../../testbase");
require("../../ServiceSettings");
window.Helper.Lookup = require("../../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
window.Helper.StatisticsKey = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.StatisticsKey").HelperStatisticsKey;
window.Helper.Batch = require("../../../../Plugins/Main/Content/ts/helper/Helper.Batch").HelperBatch;
window.Helper.Visibility = require("../../../../Plugins/Main/Content/ts/helper/Helper.Visibility").HelperVisibility;
window.Helper.Service = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.Service").HelperService;
window.Helper.ServiceOrder = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder").HelperServiceOrder;
require("../../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../../JaydataDbModel");
require("../../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../../Plugins/Crm/Content/ts/GenericListViewModel.Geolocation");
require("../../../../Plugins/Crm/Content/ts/ContactDetailsViewModel");
require("../../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../../Plugins/Crm/Content/ts/ContactListViewModel");
require("../../../../Plugins/Crm.Service/Content/ts/ServiceOrderHeadListIndexViewModel");
require("../../../../Plugins/Crm.Service/Content/ts/ServiceOrderCreateViewModel");
require("../../../../Plugins/Crm.Service/Content/ts/DispatchDetailsViewModel");
require("../../../../Plugins/Crm.Service/Content/ts/ServiceOrderDetailsViewModel");


const LumpSumAll = "LumpSumAll";
const LumpSumCostTime = "LumpSumCostTime";

async function createTestData() {
	const serviceOrderId = $data.Guid.NewGuid();
	const jobId = $data.Guid.NewGuid();
	const companyId = $data.Guid.NewGuid();
	window.database.Crm_Company.add({
		Id: companyId
	});
	const serviceOrder = new window.database.CrmService_ServiceOrderHead.createNew();
	serviceOrder.Id = serviceOrderId;
	serviceOrder.InvoicingTypeKey = null;
	serviceOrder.IsCostLumpSum = false;
	serviceOrder.IsMaterialLumpSum = false;
	serviceOrder.IsTimeLumpSum = false;
	serviceOrder.CustomerContactId = companyId;
	serviceOrder.ErrorMessage = "Error";
	serviceOrder.TypeKey = "1";
	serviceOrder.StatusKey = "New";
	window.database.CrmService_ServiceOrderHead.add(serviceOrder);
	window.database.CrmService_ServiceOrderTime.addMany([{
		Id: jobId,
		OrderId: serviceOrderId,
		InvoicingTypeKey: null,
		IsCostLumpSum: false,
		IsMaterialLumpSum: false,
		IsTimeLumpSum: false,
	}]);
	window.database.CrmService_ServiceOrderMaterial.addMany([{
		Id: $data.Guid.NewGuid(),
		OrderId: serviceOrderId,
		ServiceOrderTimeId: jobId,
		ArticleTypeKey: "Material"
	}, {
		Id: $data.Guid.NewGuid(),
		OrderId: serviceOrderId,
		ServiceOrderTimeId: jobId,
		ArticleTypeKey: "Cost"
	}, {
		Id: $data.Guid.NewGuid(),
		OrderId: serviceOrderId,
		ServiceOrderTimeId: null,
		ArticleTypeKey: "Material"
	}, {
		Id: $data.Guid.NewGuid(),
		OrderId: serviceOrderId,
		ServiceOrderTimeId: null,
		ArticleTypeKey: "Cost"
	}]);
	window.database.CrmService_ServiceOrderTimePosting.addMany([{
		Id: $data.Guid.NewGuid(),
		OrderId: serviceOrderId,
		ServiceOrderTimeId: jobId,
	}, {
		Id: $data.Guid.NewGuid(),
		OrderId: serviceOrderId,
		ServiceOrderTimeId: null,
	}]);
	window.database.CrmService_ServiceOrderType.addMany([{
		Id: $data.Guid.NewGuid(),
		Key:"1",
		ServiceOrderType: "1",
		Name: "Maintenance Order",
		Language: "en"
	}]);
	await database.saveChanges();
	return serviceOrderId;
}

async function mockPmbbBlockSave(viewModel) {
	const editServiceOrder = Helper.Database.createClone(viewModel.serviceOrder);
	editServiceOrder.InvoicingTypeKey = LumpSumAll;
	editServiceOrder.IsCostLumpSum = true;
	editServiceOrder.IsMaterialLumpSum = true;
	editServiceOrder.IsTimeLumpSum = true;
	viewModel.serviceOrder().InvoicingTypeKey(editServiceOrder.InvoicingTypeKey);
	viewModel.serviceOrder().IsCostLumpSum(editServiceOrder.IsCostLumpSum);
	viewModel.serviceOrder().IsMaterialLumpSum(editServiceOrder.IsMaterialLumpSum);
	viewModel.serviceOrder().IsTimeLumpSum(editServiceOrder.IsTimeLumpSum);
	Helper.Confirm = {genericConfirm: () => Promise.resolve(true)};
	await viewModel.onSaveInvoicing({
		viewContext: {
			serviceOrder: viewModel.serviceOrder
		},
		editContext: ko.observable({
			serviceOrder: ko.observable(editServiceOrder.asKoObservable())
		})
	});
	await database.saveChanges();
}

describe("LumpSum ServiceOrderDetailsViewModel", () => {
	beforeEach(async () => {
		navigator.geolocation = {
			getCurrentPosition: jest.fn().mockImplementation((success) =>
				Promise.resolve(
					success({
						coords: {
							latitude: 10,
							longitude: 10
						}
					})
				)
			)
		};
		await window.Helper.Database.initialize();
		window.database.Main_InvoicingType.add({
			Id: $data.Guid.NewGuid(),
			Key: LumpSumAll,
			Language: "en",
			ExtensionValues: {
				IsCostLumpSum: true,
				IsMaterialLumpSum: true,
				IsTimeLumpSum: true,
			}
		});
		window.database.Main_InvoicingType.add({
			Id: $data.Guid.NewGuid(),
			Key: LumpSumCostTime,
			Language: "en",
			ExtensionValues: {
				IsCostLumpSum: true,
				IsMaterialLumpSum: false,
				IsTimeLumpSum: true,
			}
		});
		window.database.CrmService_ServiceOrderStatus.add({
			Id: $data.Guid.NewGuid(),
			Key: "New",
			Language: "en",
			Groups: ["Preparation"]
		});
		await window.database.saveChanges();
	});

	afterEach(() => {
		window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode = "OrderPerInstallation";
	});

	test("ServiceOrderDetailsViewModel (onSaveInvoicing) updates job in OrderPerInstallation", async () => {
		const serviceOrderId = await createTestData();
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDetailsViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		await viewModel.init(serviceOrderId.value);
		await mockPmbbBlockSave(viewModel);

		const orderTimes = await database.CrmService_ServiceOrderTime
			.filter("OrderId", "===", serviceOrderId)
			.filter(`it.InvoicingTypeKey === '${LumpSumAll}' && it.IsCostLumpSum && it.IsMaterialLumpSum && it.IsTimeLumpSum`)
			.count();
		expect(orderTimes).toBe(1);

	});
	test("ServiceOrderDetailsViewModel (onSaveInvoicing) updates job in JobPerInstallation", async () => {
		window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode = "JobPerInstallation";
		const serviceOrderId = await createTestData();
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDetailsViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		await viewModel.init(serviceOrderId.value);
		await mockPmbbBlockSave(viewModel);

		const orderTimes = await database.CrmService_ServiceOrderTime
			.filter("OrderId", "===", serviceOrderId)
			.filter(`it.InvoicingTypeKey === '${LumpSumAll}' && it.IsCostLumpSum && it.IsMaterialLumpSum && it.IsTimeLumpSum`)
			.count();
		expect(orderTimes).toBe(1);
	});
});


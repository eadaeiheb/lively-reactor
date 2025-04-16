require("../../testbase");
require("../../ServiceSettings");
require("../../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../../Plugins/Main/Content/ts/knockout.custom");
window.Helper.Lookup = require("../../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
window.Helper.Service = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.Service").HelperService;
window.Helper.ServiceOrder = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder").HelperServiceOrder;
require("../../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../../Plugins/Crm.Service/Content/ts/ServiceOrderTimeEditModalViewModel");
require("../../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../../JaydataDbModel");

const LumpSumAll = "LumpSumAll";
const LumpSumCostTime = "LumpSumCostTime";

async function createTestData() {
	const serviceOrderId = $data.Guid.NewGuid();
	const companyId = $data.Guid.NewGuid();
	window.database.Crm_Company.add({
		Id: companyId
	});
	window.database.CrmService_ServiceOrderHead.add({
		Id: serviceOrderId,
		InvoicingTypeKey: null,
		IsCostLumpSum: false,
		IsMaterialLumpSum: false,
		IsTimeLumpSum: false,
		CustomerContactId: companyId,
		ErrorMessage: "Error",
		TypeKey: "1",
		StatusKey: "New"
	});
	await database.saveChanges();
	return serviceOrderId;
}

describe("LumpSum ServiceOrderTimeEditModalViewModel", () => {
	beforeEach(async () => {
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

	test("ServiceOrderTimeEditModalViewModel new job saves invoicing type", async () => {
		window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode = "JobPerInstallation";
		jQuery.fn.modal = jest.fn();

		const serviceOrderId = await createTestData();
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderTimeEditModalViewModel({
			serviceOrder: ko.observable(new database.CrmService_ServiceOrderHead.createNew({Id: serviceOrderId}).asKoObservable())
		});
		await viewModel.init();
		expect(viewModel.serviceOrderTime().InvoicingTypeKey()).toBeFalsy();
		//mimic auto completer
		const lookup = await window.database.Main_InvoicingType.filter("Key", "===", LumpSumAll).first();
		Helper.Service.onInvoicingTypeSelected(viewModel.serviceOrderTime, lookup);

		await viewModel.save();
		expect(viewModel.errors.isAnyMessageShown()).not.toBeTruthy();

		const job = await window.database.CrmService_ServiceOrderTime.find(viewModel.serviceOrderTime().Id());
		expect(job.InvoicingTypeKey).toBe(lookup.Key);
		expect(job.IsCostLumpSum).toBe(lookup.ExtensionValues.IsCostLumpSum);
		expect(job.IsMaterialLumpSum).toBe(lookup.ExtensionValues.IsMaterialLumpSum);
		expect(job.IsTimeLumpSum).toBe(lookup.ExtensionValues.IsTimeLumpSum);
	});
});



require("../../testbase");
require("../../ServiceSettings");
require("../../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../../Plugins/Main/Content/ts/knockout.custom");
window.async = require("../../../../node_modules/async/dist/async");
window.Helper.Lookup = require("../../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
require("../../../../Plugins/Main/Content/ts/ViewModelBase");
window.Helper.Service = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.Service").HelperService;
window.Helper.ServiceOrder = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder").HelperServiceOrder;
window.Helper.ServiceOrder.CreateServiceOrderData = require("../../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder.createServiceOrderData").HelperCreateServiceOrderData;
window.Helper.Address = require("../../../../Plugins/Crm/Content/ts/helper/Helper.Address").HelperAddress;
require("../../../../Plugins/Main/Content/ts/VisibilityViewModel");
require("../../../../Plugins/Main/Content/ts/NumberingService");
require("../../../../Plugins/Crm.Service/Content/ts/ServiceOrderCreateViewModel");
require("../../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../../JaydataDbModel");

window.NumberingService = window.NumberingService || {};
window.NumberingService.getNextFormattedNumber = () => $.Deferred().resolve("S1").promise();

const LumpSumAll = "LumpSumAll";
const LumpSumCostTime = "LumpSumCostTime";

describe("LumpSum ServiceOrderCreateViewModel", () => {
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
		await window.database.saveChanges();
	});

	afterEach(() => {
		window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode = "OrderPerInstallation";
	});

	test("ServiceOrderCreateViewModel respects template invoicing type and jobs", async () => {
		const TemplateLumpSumAll = $data.Guid.NewGuid();
		const TemplateLumpSumAllJobAll = $data.Guid.NewGuid();
		const TemplateLumpSumAllJobCostTime = $data.Guid.NewGuid();
		const TemplateLumpSumAllJobNone = $data.Guid.NewGuid();
		window.database.CrmService_ServiceOrderHead.add({
			Id: TemplateLumpSumAll,
			InvoicingTypeKey: LumpSumAll,
			IsCostLumpSum: true,
			IsMaterialLumpSum: true,
			IsTimeLumpSum: true,
			IsTemplate: true
		});
		window.database.CrmService_ServiceOrderTime.addMany([{
			Id: TemplateLumpSumAllJobAll,
			OrderId: TemplateLumpSumAll,
			InvoicingTypeKey: LumpSumAll
		}, {
			Id: TemplateLumpSumAllJobCostTime,
			OrderId: TemplateLumpSumAll,
			InvoicingTypeKey: LumpSumCostTime
		}, {
			Id: TemplateLumpSumAllJobNone,
			OrderId: TemplateLumpSumAll
		}]);
		window.database.CrmService_ServiceOrderMaterial.addMany([{
			Id: $data.Guid.NewGuid(),
			OrderId: TemplateLumpSumAll,
			ServiceOrderTimeId: TemplateLumpSumAllJobAll,
		}, {
			Id: $data.Guid.NewGuid(),
			OrderId: TemplateLumpSumAll,
			ServiceOrderTimeId: TemplateLumpSumAllJobCostTime,
		}, {
			Id: $data.Guid.NewGuid(),
			OrderId: TemplateLumpSumAll,
			ServiceOrderTimeId: TemplateLumpSumAllJobNone,
		}, {
			Id: $data.Guid.NewGuid(),
			OrderId: TemplateLumpSumAll,
			ServiceOrderTimeId: null,
		}]);
		await database.saveChanges();
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderCreateViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		viewModel.selectedServiceOrderType({});
		await viewModel.init();
		const serviceOrderTemplate = await window.database.CrmService_ServiceOrderHead.find(TemplateLumpSumAll.value);

		await viewModel.onServiceOrderTemplateSelect(serviceOrderTemplate);
		expect(viewModel.serviceOrder().InvoicingTypeKey()).toBe(LumpSumAll);
		expect(viewModel.serviceOrder().IsCostLumpSum()).toBe(false);
		expect(viewModel.serviceOrder().IsMaterialLumpSum()).toBe(false);
		expect(viewModel.serviceOrder().IsTimeLumpSum()).toBe(false);

		viewModel.serviceOrder().CustomerContactId($data.Guid.NewGuid());
		viewModel.serviceOrder().ErrorMessage("Error");
		viewModel.serviceOrder().TypeKey("1");
		viewModel.serviceOrder().StatusKey("New");
		await viewModel.submit();
		expect(viewModel.errors.isAnyMessageShown()).not.toBeTruthy();

		const serviceOrder = await window.database.CrmService_ServiceOrderHead.find(viewModel.serviceOrder().Id());
		expect(serviceOrder.InvoicingTypeKey).toBe(serviceOrderTemplate.InvoicingTypeKey);
		expect(serviceOrder.IsCostLumpSum).toBe(true);
		expect(serviceOrder.IsMaterialLumpSum).toBe(true);
		expect(serviceOrder.IsTimeLumpSum).toBe(true);

		const jobs = await window.database.CrmService_ServiceOrderTime.filter("OrderId", "===", viewModel.serviceOrder().Id()).toArray();
		expect(jobs).toHaveLength(3);

		for (key of [LumpSumAll, LumpSumCostTime, undefined]) {
			const job = jobs.filter(x => x.InvoicingTypeKey === key)[0];
			const lookup = key ? (await window.database.Main_InvoicingType.filter("Key", "===", key).first()).ExtensionValues : {};
			expect(job.IsCostLumpSum).toBe(lookup.IsCostLumpSum ?? false);
			expect(job.IsMaterialLumpSum).toBe(lookup.IsMaterialLumpSum ?? false);
			expect(job.IsTimeLumpSum).toBe(lookup.IsTimeLumpSum ?? false);
			const material = await window.database.CrmService_ServiceOrderMaterial
				.filter("OrderId", "===", viewModel.serviceOrder().Id())
				.filter("ServiceOrderTimeId", "===", job.Id)
				.toArray();
			expect(material).toHaveLength(1);
		}
	});


	test("ServiceOrderCreateViewModel respects template invoicing type and installations", async () => {
		window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode = "JobPerInstallation";
		const TemplateLumpSumCostTime = $data.Guid.NewGuid();
		window.database.CrmService_ServiceOrderHead.add({
			Id: TemplateLumpSumCostTime,
			InvoicingTypeKey: LumpSumCostTime,
			IsCostLumpSum: true,
			IsMaterialLumpSum: true,
			IsTimeLumpSum: true,
			IsTemplate: true
		});
		window.database.CrmService_ServiceOrderMaterial.addMany([{
			Id: $data.Guid.NewGuid(),
			OrderId: TemplateLumpSumCostTime,
			ServiceOrderTimeId: null,
		}]);
		const installationId1 = $data.Guid.NewGuid();
		const installationId2 = $data.Guid.NewGuid();
		window.database.CrmService_Installation.addMany([{
			Id: installationId1
		}, {
			Id: installationId2
		}]);
		await database.saveChanges();
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderCreateViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		viewModel.selectedServiceOrderType({});
		await viewModel.init();
		const serviceOrderTemplate = await window.database.CrmService_ServiceOrderHead.find(TemplateLumpSumCostTime.value);
		await viewModel.onServiceOrderTemplateSelect(serviceOrderTemplate);
		expect(viewModel.serviceOrder().InvoicingTypeKey()).toBe(LumpSumCostTime);
		expect(viewModel.serviceOrder().IsCostLumpSum()).toBe(false);
		expect(viewModel.serviceOrder().IsMaterialLumpSum()).toBe(false);
		expect(viewModel.serviceOrder().IsTimeLumpSum()).toBe(false);

		viewModel.installationIds.push(installationId1, installationId2);

		viewModel.serviceOrder().CustomerContactId($data.Guid.NewGuid());
		viewModel.serviceOrder().ErrorMessage("Error");
		viewModel.serviceOrder().TypeKey("1");
		viewModel.serviceOrder().StatusKey("New");
		await viewModel.submit();

		expect(viewModel.errors.isAnyMessageShown()).not.toBeTruthy();

		const serviceOrder = await window.database.CrmService_ServiceOrderHead.find(viewModel.serviceOrder().Id());
		expect(serviceOrder.InvoicingTypeKey).toBe(serviceOrderTemplate.InvoicingTypeKey);
		expect(serviceOrder.IsCostLumpSum).toBe(true);
		expect(serviceOrder.IsMaterialLumpSum).toBe(false);
		expect(serviceOrder.IsTimeLumpSum).toBe(true);

		const jobs = await window.database.CrmService_ServiceOrderTime.filter("OrderId", "===", viewModel.serviceOrder().Id()).toArray();
		expect(jobs).toHaveLength(2);

		for (const job of jobs) {
			expect(job.InvoicingTypeKey).toBe(LumpSumCostTime);
			expect(job.IsCostLumpSum).toBe(true);
			expect(job.IsMaterialLumpSum).toBe(false);
			expect(job.IsTimeLumpSum).toBe(true);
			const material = await window.database.CrmService_ServiceOrderMaterial
				.filter("OrderId", "===", viewModel.serviceOrder().Id())
				.filter("ServiceOrderTimeId", "===", job.Id)
				.count();
			expect(material).toBe(0);
		}
		const material = await window.database.CrmService_ServiceOrderMaterial
			.filter("OrderId", "===", viewModel.serviceOrder().Id())
			.toArray();
		expect(material).toHaveLength(1);
	});

	test("ServiceOrderCreateViewModel respects template invoicing type without jobs", async () => {
		const TemplateLumpSumAll = $data.Guid.NewGuid();
		window.database.CrmService_ServiceOrderHead.add({
			Id: TemplateLumpSumAll,
			InvoicingTypeKey: LumpSumAll,
			IsCostLumpSum: true,
			IsMaterialLumpSum: true,
			IsTimeLumpSum: true,
			IsTemplate: true
		});
		window.database.CrmService_ServiceOrderMaterial.addMany([{
			Id: $data.Guid.NewGuid(),
			OrderId: TemplateLumpSumAll,
			ServiceOrderTimeId: null,
		}]);
		await database.saveChanges();
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderCreateViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		viewModel.selectedServiceOrderType({});

		await viewModel.init();
		const serviceOrderTemplate = await window.database.CrmService_ServiceOrderHead.find(TemplateLumpSumAll.value);
		await viewModel.onServiceOrderTemplateSelect(serviceOrderTemplate);
		expect(viewModel.serviceOrder().InvoicingTypeKey()).toBe(LumpSumAll);
		expect(viewModel.serviceOrder().IsCostLumpSum()).toBe(false);
		expect(viewModel.serviceOrder().IsMaterialLumpSum()).toBe(false);
		expect(viewModel.serviceOrder().IsTimeLumpSum()).toBe(false);

		viewModel.serviceOrder().CustomerContactId($data.Guid.NewGuid());
		viewModel.serviceOrder().ErrorMessage("Error");
		viewModel.serviceOrder().TypeKey("1");
		viewModel.serviceOrder().StatusKey("New");
		await viewModel.submit();

		expect(viewModel.errors.isAnyMessageShown()).not.toBeTruthy();

		const serviceOrder = await window.database.CrmService_ServiceOrderHead.find(viewModel.serviceOrder().Id());
		expect(serviceOrder.InvoicingTypeKey).toBe(serviceOrderTemplate.InvoicingTypeKey);
		expect(serviceOrder.IsCostLumpSum).toBe(true);
		expect(serviceOrder.IsMaterialLumpSum).toBe(true);
		expect(serviceOrder.IsTimeLumpSum).toBe(true);

		const jobs = await window.database.CrmService_ServiceOrderTime.filter("OrderId", "===", viewModel.serviceOrder().Id()).toArray();
		expect(jobs).toHaveLength(0);
		const material = await window.database.CrmService_ServiceOrderMaterial
			.filter("OrderId", "===", viewModel.serviceOrder().Id())
			.toArray();
		expect(material).toHaveLength(1);
	});

	test("ServiceOrderCreateViewModel respects invoicing type with installations", async () => {
		window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode = "JobPerInstallation";

		const installationId1 = $data.Guid.NewGuid();
		const installationId2 = $data.Guid.NewGuid();
		window.database.CrmService_Installation.addMany([{
			Id: installationId1
		}, {
			Id: installationId2
		}]);
		await database.saveChanges();

		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderCreateViewModel();
		viewModel.setBreadcrumbs = jest.fn();
		viewModel.selectedServiceOrderType({});
		await viewModel.init();

		//mimic auto completer
		const lookup = await window.database.Main_InvoicingType.filter("Key", "===", LumpSumAll).first();
		Helper.Service.onInvoicingTypeSelected(viewModel.serviceOrder, lookup);

		viewModel.installationIds.push(installationId1, installationId2);

		viewModel.serviceOrder().CustomerContactId($data.Guid.NewGuid());
		viewModel.serviceOrder().ErrorMessage("Error");
		viewModel.serviceOrder().TypeKey("1");
		viewModel.serviceOrder().StatusKey("New");
		await viewModel.submit();

		expect(viewModel.errors.isAnyMessageShown()).not.toBeTruthy();

		const serviceOrder = await window.database.CrmService_ServiceOrderHead.find(viewModel.serviceOrder().Id());
		expect(serviceOrder.InvoicingTypeKey).toBe(lookup.Key);
		expect(serviceOrder.IsCostLumpSum).toBe(lookup.ExtensionValues.IsCostLumpSum);
		expect(serviceOrder.IsMaterialLumpSum).toBe(lookup.ExtensionValues.IsMaterialLumpSum);
		expect(serviceOrder.IsTimeLumpSum).toBe(lookup.ExtensionValues.IsTimeLumpSum);

		const jobs = await window.database.CrmService_ServiceOrderTime.filter("OrderId", "===", viewModel.serviceOrder().Id()).toArray();
		expect(jobs).toHaveLength(2);

		for (const job of jobs) {
			expect(job.InvoicingTypeKey).toBe(lookup.Key);
			expect(job.IsCostLumpSum).toBe(lookup.ExtensionValues.IsCostLumpSum);
			expect(job.IsMaterialLumpSum).toBe(lookup.ExtensionValues.IsMaterialLumpSum);
			expect(job.IsTimeLumpSum).toBe(lookup.ExtensionValues.IsTimeLumpSum);
		}
		const material = await window.database.CrmService_ServiceOrderMaterial.filter("OrderId", "===", viewModel.serviceOrder().Id()).count();
		expect(material).toBe(0);
	});
});


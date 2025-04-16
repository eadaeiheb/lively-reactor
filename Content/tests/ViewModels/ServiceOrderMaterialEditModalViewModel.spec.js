require("../testbase");
window.moment = require("moment");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
window.Helper.Service = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.Service").HelperService;
window.Helper.ServiceOrder = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder").HelperServiceOrder;
window.Helper.ReplenishmentOrder = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.ReplenishmentOrder").HelperReplenishmentOrder;
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderMaterialEditModalViewModel");

describe("ServiceOrderMaterialEditModalViewModel", () => {

	beforeEach(async () => {
		await window.Helper.Database.initialize();
	});

	test("Add new replenishment order item", async () => {
		window.Helper.ServiceOrder.updatePosNo = function () {
			return Promise.resolve();
		};
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderMaterialEditModalViewModel({});
		const material = new window.database.CrmService_ServiceOrderMaterial.createNew({
			Id: $data.createGuid().toString(),
			ArticleId: $data.createGuid("8ec72f4b-fc89-e511-a145-005056c00008"),
			Quantity: 10,
			QuantityUnitKey: "Stk",
		});
		viewModel.updateReplenishmentOrder = ko.observable(true);
		viewModel.serviceOrderMaterial = ko.observable(material.asKoObservable());
		viewModel.currentUser = ko.observable({});
		viewModel.currentUser().Id = "67b41e61-21ee-4678-9c7a-b10d8d35dbc4";

		await viewModel.saveReplenishmentOrderItem();
		expect(viewModel.serviceOrderMaterial().ReplenishmentOrderItem().Quantity()).toBe(10);
		expect(viewModel.serviceOrderMaterial().ReplenishmentOrderItem().ArticleId()).toBe("8ec72f4b-fc89-e511-a145-005056c00008");

	});

	test("Change existing replenishment order item", async () => {
		window.Helper.ServiceOrder.updatePosNo = function () {
			return Promise.resolve();
		};
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderMaterialEditModalViewModel({});
		const replenishmentOrderItem = new window.database.CrmService_ReplenishmentOrderItem.createNew({
			Id: $data.createGuid().toString(),
			ArticleId: $data.createGuid("8ec72f4b-fc89-e511-a145-005056c00008"),
			Quantity: 5,
			QuantityUnitKey: "Stk",
		});
		const material = new window.database.CrmService_ServiceOrderMaterial.createNew({
			Id: $data.createGuid().toString(),
			ArticleId: $data.createGuid("8dc72f4b-fc89-e511-a145-005056c00008"),
			Quantity: 10,
			QuantityUnitKey: "Stk",
			ReplenishmentOrderItem: replenishmentOrderItem,
		});
		viewModel.updateReplenishmentOrder = ko.observable(true);
		viewModel.serviceOrderMaterial = ko.observable(material.asKoObservable());
		viewModel.currentUser = ko.observable({});
		viewModel.currentUser().Id = "67b41e61-21ee-4678-9c7a-b10d8d35dbc4";

		expect(viewModel.serviceOrderMaterial().ReplenishmentOrderItem().Quantity()).toBe(5);
		expect(viewModel.serviceOrderMaterial().ReplenishmentOrderItem().ArticleId()).toBe("8ec72f4b-fc89-e511-a145-005056c00008");

		await viewModel.saveReplenishmentOrderItem();
		expect(viewModel.serviceOrderMaterial().ReplenishmentOrderItem().Quantity()).toBe(10);
		expect(viewModel.serviceOrderMaterial().ReplenishmentOrderItem().ArticleId()).toBe("8dc72f4b-fc89-e511-a145-005056c00008");
	});

	test("Initialize Invoice material without parent material should not throw error", async () => {
		window.Helper.ServiceOrder.updatePosNo = function () {
			return Promise.resolve();
		};
		window.Crm.Service.ServiceOrderMaterialType = {
			Preplanned: "Preplanned",
			Used: "Used",
			Invoice: "Invoice"
		};

		window.database.CrmService_ServiceOrderMaterial.include = function () {
			return window.database.CrmService_ServiceOrderMaterial;
		};
		window.database.CrmService_ServiceOrderMaterial.find = function () {
			const material = new window.database.CrmService_ServiceOrderMaterial.createNew({
				Id: $data.createGuid().toString(),
				ArticleId: $data.createGuid("8ec72f4b-fc89-e511-a145-005056c00008"),
				Quantity: 5,
				QuantityUnitKey: "Stk",
				ServiceOrderMaterialType: window.Crm.Service.ServiceOrderMaterialType.Invoice,
				DocumentAttributes: []
			});
			return Promise.resolve(material);
		};

		window.database.attachOrGet = jest.fn();
		window.database.add = jest.fn();
		window.Helper.Lookup = {
			getLocalizedArrayMaps: jest.fn().mockResolvedValue(true)
		};
		window.Helper.User = {
			getCurrentUser: jest.fn().mockResolvedValue({
				ExtensionValues: {}
			})
		};
		ko.validation = {
			group: jest.fn().mockReturnValue([])
		};

		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderMaterialEditModalViewModel({});
		viewModel.serviceOrder = ko.observable({
			CurrencyKey: ko.observable(null),
			StatusKey: ko.observable("Open")
		});
		viewModel.lookups = {
			serviceOrderStatuses: { "Open": { SortOrder: 1 } },
			documentCategories: { "$array": [] }
		};

		const materialId = $data.createGuid().toString();
		await viewModel.init(materialId, {});

		expect(viewModel.actualQuantity()).toBe(0);
		expect(viewModel.estimatedQuantity()).toBe(0);
		expect(viewModel.invoiceQuantity()).toBe(5);
	});

	test("Initialize Invoice material with parent material should set correct quantities", async () => {
		window.Helper.ServiceOrder.updatePosNo = function () {
			return Promise.resolve();
		};
		window.Crm.Service.ServiceOrderMaterialType = {
			Preplanned: "Preplanned",
			Used: "Used",
			Invoice: "Invoice"
		};

		const parentMaterial = new window.database.CrmService_ServiceOrderMaterial.createNew({
			Id: $data.createGuid().toString(),
			ArticleId: $data.createGuid("8dc72f4b-fc89-e511-a145-005056c00008"),
			Quantity: 10,
			QuantityUnitKey: "Stk",
			ServiceOrderMaterialType: window.Crm.Service.ServiceOrderMaterialType.Used
		});

		window.database.CrmService_ServiceOrderMaterial.include = function () {
			return window.database.CrmService_ServiceOrderMaterial;
		};
		window.database.CrmService_ServiceOrderMaterial.find = function () {
			const material = new window.database.CrmService_ServiceOrderMaterial.createNew({
				Id: $data.createGuid().toString(),
				ArticleId: $data.createGuid("8ec72f4b-fc89-e511-a145-005056c00008"),
				Quantity: 5,
				QuantityUnitKey: "Stk",
				ServiceOrderMaterialType: window.Crm.Service.ServiceOrderMaterialType.Invoice,
				ParentServiceOrderMaterial: parentMaterial,
				DocumentAttributes: []
			});
			return Promise.resolve(material);
		};

		window.database.attachOrGet = jest.fn();
		window.database.add = jest.fn();
		window.Helper.Lookup = {
			getLocalizedArrayMaps: jest.fn().mockResolvedValue(true)
		};
		window.Helper.User = {
			getCurrentUser: jest.fn().mockResolvedValue({
				ExtensionValues: {}
			})
		};
		ko.validation = {
			group: jest.fn().mockReturnValue([])
		};

		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderMaterialEditModalViewModel({});
		viewModel.serviceOrder = ko.observable({
			CurrencyKey: ko.observable(null),
			StatusKey: ko.observable("Open")
		});
		viewModel.lookups = {
			serviceOrderStatuses: { "Open": { SortOrder: 1 } },
			documentCategories: { "$array": [] }
		};

		const materialId = $data.createGuid().toString();
		await viewModel.init(materialId, {});

		expect(viewModel.actualQuantity()).toBe(10);
		expect(viewModel.estimatedQuantity()).toBe(0);
		expect(viewModel.invoiceQuantity()).toBe(5);
	});
});

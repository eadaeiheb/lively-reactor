require("../testbase");
window.moment = require("moment");
ko.validation = require("knockout.validation");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderTimePostingEditModalViewModel");
require("../../../Plugins/Crm.Service/Content/ts/DispatchDetailsViewModel");
window.Helper.TimeEntry = require("../../../Plugins/Crm.PerDiem/Content/ts/helper/Helper.TimeEntry").HelperTimeEntry;
window.Helper.Date = require("../../../Plugins/Main/Content/ts/helper/Helper.Date").HelperDate;
window.Helper.ServiceOrderTimePosting = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrderTimePosting").HelperServiceOrderTimePosting;
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;

describe("ServiceOrderTimePostingEditModalViewModel", () => {
	if (!window.Crm.Service.Settings) {
		window.Crm.Service.Settings = {ServiceOrderTimePosting: {ShowTechnicianSelection: true}};
	}
	const viewModel = new window.Crm.Service.ViewModels.ServiceOrderTimePostingEditModalViewModel({});
	let timePosting = null;
	let timePosting2 = null;
	let dispatch = null;
	let timePostings = null;
	let timepostingId = null;
	let setDbIncludeDispatch = () => {
		window.database.CrmService_ServiceOrderTimePosting.include = function (model) {
			if (model === "ServiceOrderDispatch") {
				timePostings.forEach((timePosting) => {
					timePosting.ServiceOrderDispatch = dispatch;
				})
			}
			return window.database.CrmService_ServiceOrderTimePosting;
		};
	}

	beforeEach(async () => {
		await window.Helper.Database.initialize();
		if (!Crm.PerDiem.Settings) {
			Crm.PerDiem.Settings = {TimeEntry: {DefaultStart: "07:00"}};
		}
		timePosting = new window.database.CrmService_ServiceOrderTimePosting.createNew({
			Id: $data.createGuid().toString(),
			ArticleId: $data.createGuid("94C72F4B-FC89-E511-A145-005056C00008"),
			Username: '1, default',
			From: new Date(2024, 2, 11, 12, 30, 0).toISOString(),
			To: new Date(2024, 2, 11, 12, 40, 0).toISOString(),
			ItemNo: '100018.1'
		});
		timepostingId = timePosting.Id;
		timePosting2 = new window.database.CrmService_ServiceOrderTimePosting.createNew({
			Id: $data.createGuid().toString(),
			ArticleId: $data.createGuid("94C72F4B-FC89-E511-A145-005056C00008"),
			Username: '1, default',
			From: new Date(2024, 2, 11, 12, 0, 0).toISOString(),
			To: new Date(2024, 2, 11, 12, 10, 0).toISOString(),
			ItemNo: '100018.1'
		});

		dispatch = new window.database.CrmService_ServiceOrderDispatch.createNew({
			Id: $data.createGuid().toString(),
		});
		timePostings = [timePosting, timePosting2];
		window.database.CrmService_ServiceOrderTimePosting.include = function (model) {
			if (model === "ServiceOrderDispatch") {
				timePostings.forEach((timePosting) => {
					timePosting.ServiceOrderDispatch = null;
				})
			}
			return window.database.CrmService_ServiceOrderTimePosting;
		};
		window.database.CrmService_ServiceOrderTimePosting.filter = function (expr, obj) {
			return window.database.CrmService_ServiceOrderTimePosting;
		};
		window.database.CrmService_ServiceOrderTimePosting.orderByDescending = function () {
			return window.database.CrmService_ServiceOrderTimePosting;
		};
		window.database.CrmService_ServiceOrderTimePosting.take = function (count) {
			timePostings = timePostings.slice(0, count);
			return window.database.CrmService_ServiceOrderTimePosting;
		};
		window.database.CrmService_ServiceOrderTimePosting.find = function (id) {
			return $.Deferred().resolve(timePostings.find((t) => t.Id === id)).promise();
		};
		window.database.CrmService_ServiceOrderTimePosting.toArray = function () {
			return $.Deferred().resolve(timePostings).promise();
		};
	});

	test("Init - case 1", async () => {
		//Not preplanned, service order side, new
		await viewModel.init("", {})
	});

	test("Init - case 2", async () => {
		//Preplanned, service order side, new
		await viewModel.init("", {prePlanned: true})
	});

	test("Init - case 3", async () => {
		//Not preplanned, service order side, existing
		await viewModel.init(timepostingId, {});
	});

	test("Init - case 4", async () => {
		//Preplanned, service order side, existing
		await viewModel.init(timepostingId, {prePlanned: true});
	});

	test("Init - case 5", async () => {
		//Not preplanned, dispatch side, new
		viewModel.dispatch = ko.observable(dispatch.asKoObservable());
		setDbIncludeDispatch();
		await viewModel.init("", {});
	});

	test("Init - case 6", async () => {
		//Not preplanned, dispatch side, existing
		setDbIncludeDispatch();
		await viewModel.init(timepostingId, {});
	});

	test("Init - case 7", async () => {
		//Preplanned, dispatch side, existing
		setDbIncludeDispatch();
		await viewModel.init(timepostingId, {prePlanned: true});
	});

	test("SetAllDay", async () => {
		//Preplanned, dispatch side, existing
		await viewModel.init(timepostingId, {});
		viewModel.setAllDay();
		expect(viewModel.serviceOrderTimePosting().From().getDate()).toBe(11);
		expect(viewModel.serviceOrderTimePosting().From().getHours()).toBe(0);
		expect(viewModel.serviceOrderTimePosting().From().getMinutes()).toBe(0);
		expect(viewModel.serviceOrderTimePosting().To().getDate()).toBe(12);
		expect(viewModel.serviceOrderTimePosting().To().getHours()).toBe(0);
		expect(viewModel.serviceOrderTimePosting().To().getMinutes()).toBe(0);
	});
});

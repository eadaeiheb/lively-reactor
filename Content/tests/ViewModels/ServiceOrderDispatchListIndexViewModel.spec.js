require("../testbase");
window.moment = require("moment/min/moment-with-locales");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Main/Content/ts/knockout.custom.map");
require("../../../Plugins/Main/Content/ts/GenericListViewModel.Map");
require("../../../Plugins/Crm/Content/ts/GenericListViewModel.Geolocation");
require("../../../Plugins/Main/Content/ts/DashboardCalendarWidgetViewModel");
require("../../../Plugins/Main/Content/ts/knockout.component.dashboardCalendarWidget");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderDispatchListIndexViewModel");

describe("ServiceOrderDispatchListIndexViewModelTests", () => {
	beforeEach(async () => {
		await window.Helper.Database.initialize();
	});

	test("dispatch times are correctly calculated", () => {

		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		dispatch.ServiceOrder(serviceOrder);
		dispatch.Date(new Date(2019, 0, 1, 12, 30, 0));
		dispatch.EndDate(new Date(2019, 0, 1, 17, 0, 0));
		dispatch.StatusKey("ClosedComplete");

		const result = viewModel.getTimelineEvent(dispatch);
		expect(result.start.getTime()).toBe(new Date(2019, 0, 1, 12, 30, 0).getTime());
		expect(result.end.getTime()).toBe(new Date(2019, 0, 1, 17, 0, 0).getTime());
		expect(result.backgroundColor).toBe("#aaaaaa");
	});
	test("dispatch end is calculated ending on next day", () => {
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		dispatch.ServiceOrder(serviceOrder);
		dispatch.Date(new Date(2019, 0, 1, 23, 30, 0));
		dispatch.EndDate(new Date(2019, 0, 2, 4, 0, 0));
		dispatch.StatusKey("InProgress");

		const result = viewModel.getTimelineEvent(dispatch);
		expect(result.end.getTime()).toBe(new Date(2019, 0, 2, 4, 0, 0).getTime());
	});
	test("dispatch end is calculated with duration exceeding 24 hours", () => {
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		dispatch.ServiceOrder(serviceOrder);
		dispatch.Date(new Date(2019, 0, 1, 0, 0, 0));
		dispatch.EndDate(new Date(2019, 0, 2, 1, 30, 0));
		dispatch.StatusKey("InProgress");

		const result = viewModel.getTimelineEvent(dispatch);
		expect(result.end.getTime()).toBe(new Date(2019, 0, 2, 1, 30, 0).getTime());
	});
	test("dispatch end month is calculated with duration exceeding 24 hours", () => {
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		dispatch.ServiceOrder(serviceOrder);
		dispatch.Date(new Date(2019, 0, 31, 0, 0, 0));
		dispatch.EndDate(new Date(2019, 1, 1, 1, 30, 0));
		dispatch.StatusKey("InProgress");

		const result = viewModel.getTimelineEvent(dispatch);
		expect(result.end.getTime()).toBe(new Date(2019, 1, 1, 1, 30, 0).getTime());
	});

	test("applyFilters correctly filters dispatches based on status = closed", async () => {
		window.Helper.Database.initialize();

		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch1 = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		const dispatch2 = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		const dispatch3 = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();
		const dispatch4 = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable();

		dispatch1.ServiceOrder(serviceOrder);
		dispatch1.StatusKey("ClosedComplete");

		dispatch2.ServiceOrder(serviceOrder);
		dispatch2.StatusKey("Cancelled");

		dispatch3.ServiceOrder(serviceOrder);
		dispatch3.StatusKey("Released");

		dispatch3.ServiceOrder(serviceOrder);
		dispatch3.StatusKey("CancelledNotComplete");

		window.database.CrmService_ServiceOrderDispatch.addMany([dispatch1, dispatch2, dispatch3, dispatch4]);
		window.database.saveChanges();
		let query = window.database.CrmService_ServiceOrderDispatch
		// Apply filtering for closed statuses
		viewModel.status = "closed";
		const filteredQuery = await viewModel.applyFilters(query);

		filteredQuery.forEach(dispatch => {
			expect(["ClosedComplete", "Cancelled", "CancelledNotComplete"]).toContain(dispatch.StatusKey);
		});
	});
});

require("../testbase");
require("../../../Plugins/Main/Content/ts/jaydata.custom");
window.moment = require("moment");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.PerDiem/Content/ts/OfflineModel");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Main/Content/ts/DashboardCalendarWidgetViewModel");
require("../../../Plugins/Main/Content/ts/knockout.component.dashboardCalendarWidget");
require("../../../Plugins/Crm.PerDiem/Content/ts/PerDiemReportListViewModel");
require("../../../Plugins/Crm.PerDiem/Content/ts/TimeEntryIndexViewModel");
const {HelperConfirm} = require("../../../Plugins/Main/Content/ts/helper/Helper.Confirm");

describe("TimeEntryIndexViewModel", () => {

	test("Selected time of day stays at utc 0 when changing from/to dst", async () => {
		$("head").append($("<meta id=\"meta.CurrentUser\" name=\"CurrentUser\" content=\"test\">"));
		await window.Helper.Database.initialize();
		namespace("Crm.PerDiem.Settings.TimeEntry")["MaxDaysAgo"] = 7;
		const viewModel = new window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel();
		await viewModel.init({});
		const utcHours = window.moment(viewModel.selectedDate()).utc().hours();

		for (let i = 0; i < 25; i++) {
			viewModel.goToPreviousWeek();
		}
		const utcHours2 = window.moment(viewModel.selectedDate()).utc().hours();

		expect(utcHours).toBe(0);
		expect(utcHours2).toBe(0);
	});
	test("delete expense delete file first", async () => {
		HelperConfirm.confirmDeleteAsync = async function () {
			return true;
		};
		await window.Helper.Database.initialize();
		namespace("Crm.PerDiem.Settings.TimeEntry")["MaxDaysAgo"] = 7;
		const viewModel = new window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel();
		window.database.saveChanges = function () {
			expect(window.database.stateManager.trackedEntities).toHaveLength(2);
			expect(window.database.stateManager.trackedEntities[0].data instanceof window.database.Crm_FileResource.elementType).toBe(true);
			expect(window.database.stateManager.trackedEntities[1].data instanceof window.database.CrmPerDiem_UserExpense.elementType).toBe(true);
			return $.Deferred().resolve().promise();
		};
		const expense = new window.database.CrmPerDiem_UserExpense.createNew({
			FileResource: new window.database.Crm_FileResource.createNew()
		});
		await viewModel.deleteExpense(expense.asKoObservable());
	});
	test("canAddTimeEntryAndExpenseAtTheStartOfTheDay", () => {
		namespace("Crm.PerDiem.Settings.TimeEntry")["MaxDaysAgo"] = 7;
		namespace("Crm.PerDiem.Settings.Expense")["MaxDaysAgo"] = 7;
		const viewModel = new window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel();
		viewModel.selectedDate(new Date("June 28 2021 02:00"));
		Date.now = jest.fn(() => new Date("2021-07-05T00:30:00.000Z"));
		expect(viewModel.canAddTimeEntry()).toBe(true);
		window.moment().startOf("day").utc(true).add(7, "days");
		expect(viewModel.canAddExpense()).toBe(true);
	});
});

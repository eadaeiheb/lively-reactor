require("../testbase");
window.moment = require("moment");
window.Helper.Visit = require("../../../Plugins/Crm.VisitReport/Content/ts/Helper/Helper.Visit").HelperVisit;
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../JaydataDbModel");

describe("VisitDetailViewModel", () => {
	test("visit durations are correctly calculated", async () => {
		expect.assertions(2);
		namespace("Crm.VisitReport.Settings")["DefaultVisitTimeSpanHours"] = 4;
		await window.Helper.Database.initialize();
		let visit = window.database.CrmVisitReport_Visit.defaultType.create().asKoObservable();
		visit.PlannedDate(new Date(2021, 0, 18, 12, 0, 0));

		visit = window.Helper.Visit.calculateDates(visit);
		expect(visit.PlannedDuration()).toBe("PT4H");
		expect(visit.PlannedEndDate().getTime()).toBe(new Date(2021, 0, 18, 16, 0, 0).getTime());
	});
});

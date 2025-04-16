require("../testbase");
window.Helper.Date = require("../../../Plugins/Main/Content/ts/helper/Helper.Date").HelperDate;
window.moment = require("moment");

describe("Helper.Date", () => {
	test("getFromAndToFromString", async () => {
		expect.assertions(12);
		let dateObject = window.Helper.Date.getFromAndToFromString("LastMonth");
		const currentDate = new Date();
		let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
		let endDate = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) - 1);
		expect(dateObject.dateFrom).toEqual(startDate);
		expect(dateObject.dateTo).toEqual(endDate);

		dateObject = window.Helper.Date.getFromAndToFromString("Next3Months");
		startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
		endDate = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth() + 4, 1) - 1);
		expect(dateObject.dateFrom).toEqual(startDate);
		expect(dateObject.dateTo).toEqual(endDate);

		dateObject = window.Helper.Date.getFromAndToFromString("ThisMonth");
		startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
		endDate = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) - 1);
		expect(dateObject.dateFrom).toEqual(startDate);
		expect(dateObject.dateTo).toEqual(endDate);

		dateObject = window.Helper.Date.getFromAndToFromString("NextMonth");
		startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
		endDate = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1) - 1);
		expect(dateObject.dateFrom).toEqual(startDate);
		expect(dateObject.dateTo).toEqual(endDate);

		dateObject = window.Helper.Date.getFromAndToFromString("ThisYear");
		startDate = new Date(currentDate.getFullYear(), 0, 1);
		endDate = new Date(new Date(currentDate.getFullYear()+1, 0, 1) - 1);
		expect(dateObject.dateFrom).toEqual(startDate);
		expect(dateObject.dateTo).toEqual(endDate);

		dateObject = window.Helper.Date.getFromAndToFromString("LastYear");
		startDate = new Date(currentDate.getFullYear()-1, 0, 1);
		endDate = new Date(new Date(currentDate.getFullYear(), 0, 1) - 1);
		expect(dateObject.dateFrom).toEqual(startDate);
		expect(dateObject.dateTo).toEqual(endDate);
	});
})
;

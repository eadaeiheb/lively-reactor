require("../testbase");
window.moment = require("moment/min/moment-with-locales");
const loadCldrData = require("./cldrBase").loadCldrData;
require("../../../../Plugins/Main/Content/ts/knockout.custom.dateText");

describe("knockout dateText custom binding", () => {
	beforeAll(() => {
		loadCldrData();
		window.Globalize.locale("de");
	});

	test("Initializing displays formatted date", () => {
		const date = new Date(1987, 7, 12);
		const observable = window.ko.observable(date);
		const expectedText = "12.08.1987";
		ko.test("span", { dateText: observable }, function (span) {
			expect($(span).text()).toBe( expectedText);
		});
	});
	test("Changing observable updates displayed date", () => {
		const date = new Date(1987, 7, 12);
		const expectedText = "12.08.1987";
		const date2 = new Date(2011, 8, 11);
		const expectedText2 = "11.09.2011";
		const observable = window.ko.observable(date);
		ko.test("span", { dateText: observable }, function (span) {
			expect($(span).text()).toBe( expectedText);
			observable(date2);
			expect($(span).text()).toBe( expectedText2);
		});
	});
	test("datePattern binding is used to format", () => {
		const date = new Date(1987, 7, 12, 4, 20);
		const observable = window.ko.observable(date);
		const expectedText = "04:20";
		ko.test("span", { dateText: { value: observable, pattern: { time: "short" }}}, function (span) {
			expect($(span).text()).toBe( expectedText);
		});
	});

});

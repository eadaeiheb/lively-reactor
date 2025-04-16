require("../testbase");
window.moment = require("moment/min/moment-with-locales");
const loadCldrData = require("./cldrBase").loadCldrData;
require("../../../../Plugins/Main/Content/ts/knockout.custom.dateRange");

describe("knockout dateRange custom binding", () => {

	beforeAll(() => {
		loadCldrData();
		window.Globalize.locale("de");
	});

	test("Initializing displays date range",  () => {
		const start = new Date(2001, 0, 1);
		const end = new Date(2002, 1, 2);
		const startObservable = window.ko.observable(start);
		const endObservable = window.ko.observable(end);
		const expectedText = "1.1.2001 - 2.2.2002";
		ko.test("span", {
			dateRange: {start: startObservable, end: endObservable}
		}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("Changing observable updates displayed date rage", () => {
		const start = new Date(2001, 0, 1);
		const end = new Date(2002, 1, 2);
		const end2 = new Date(2003, 2, 3);
		const startObservable = window.ko.observable(start);
		const endObservable = window.ko.observable(end);
		const expectedText = "1.1.2001 - 2.2.2002";
		const expectedText2 = "1.1.2001 - 3.3.2003";
		ko.test("span", {dateRange: {start: startObservable, end: endObservable}}, function (span) {
			expect($(span).text()).toBe(expectedText);
			endObservable(end2);
			expect($(span).text()).toBe(expectedText2);
		});
	});
	test("Same year omits year", () => {
		const start = new Date(2001, 0, 1);
		const end = new Date(2001, 1, 2);
		const startObservable = window.ko.observable(start);
		const endObservable = window.ko.observable(end);
		const expectedText = "1.1. - 2.2.2001";
		ko.test("span", {
			dateRange: {start: startObservable, end: endObservable}
		}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("Same year & month omits year & month", () => {
		const start = new Date(2001, 0, 1);
		const end = new Date(2001, 0, 2);
		const startObservable = window.ko.observable(start);
		const endObservable = window.ko.observable(end);
		const expectedText = "1 - 2.1.2001";
		ko.test("span", {
			dateRange: {start: startObservable, end: endObservable}
		}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("Same month in different year doesn't omit", () => {
		const start = new Date(2001, 0, 1);
		const end = new Date(2002, 0, 2);
		const startObservable = window.ko.observable(start);
		const endObservable = window.ko.observable(end);
		const expectedText = "1.1.2001 - 2.1.2002";
		ko.test("span", {
			dateRange: {start: startObservable, end: endObservable}
		}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});
});

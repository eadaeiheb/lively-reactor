require("../testbase");
window.moment = require("moment/min/moment-with-locales");
const loadCldrData = require("./cldrBase").loadCldrData;
require("../../../../Plugins/Main/Content/ts/knockout.custom.money");

describe("knockout money custom binding", () => {
	beforeAll(() => {
		loadCldrData();
		window.Globalize.locale("de");
	});
	test("Initializing displays formatted money", () => {
		const observable = window.ko.observable(4711.5);
		const expectedText = "4.711,50";
		ko.test("span", {money: observable}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("Changing observable updates displayed money", () => {
		const money = 4711.5;
		const expectedText = "4.711,50";
		const money2 = 123456.789;
		const expectedText2 = "123.456,79";
		const observable = window.ko.observable(money);
		ko.test("span", {money: observable}, span => {
			expect($(span).text()).toBe(expectedText);
			observable(money2);
			expect($(span).text()).toBe(expectedText2);
		});
	});
	test("NaN values are displayed as '0,00'", () => {
		const observable = window.ko.observable(NaN);
		const expectedText = "0,00";
		ko.test("span", {money: observable}, span => expect($(span).text()).toBe(expectedText));
	});
	test("null values are displayed as '0,00'", () => {
		const observable = window.ko.observable(null);
		const expectedText = "0,00";
		ko.test("span", {money: observable}, span => expect($(span).text()).toBe(expectedText));
	});
});

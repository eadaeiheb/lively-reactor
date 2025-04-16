require("../testbase");
window.moment = require("moment/min/moment-with-locales");
const loadCldrData = require("./cldrBase").loadCldrData;
require("../../../../Plugins/Main/Content/ts/knockout.custom.fileSize");

describe("knockout money custom binding", () => {
	beforeAll(() => {
		loadCldrData();
		window.Globalize.locale("de");
	});
	test("Initializing displays formatted money", () => {
		const length = 1536;
		const expectedText = "1,50 KB";
		ko.test("span", {fileSize: length}, span => expect($(span).text()).toBe(expectedText));
	});
	test("Initializing displays formatted money 2", () => {
		const length = 1572864;
		const expectedText = "1,50 MB";
		ko.test("span", {fileSize: length}, span => expect($(span).text()).toBe(expectedText));
	});
	test("Initializing displays formatted money 3", () => {
		const length = 1610612736;
		const expectedText = "1,50 GB";
		ko.test("span", {fileSize: length}, span => expect($(span).text()).toBe(expectedText));
	});
});

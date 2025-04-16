require("../testbase");
window.moment = require("moment/min/moment-with-locales");
const loadCldrData = require("./cldrBase").loadCldrData;

require("../../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../../Plugins/Main/Content/ts/knockout.validation.custom");

describe("knockout number validation", () => {
	beforeAll(() => {
		loadCldrData();
		window.Globalize.locale("de");
	});
	test("Number validation german", function () {
		expect(ko.validation.rules.number.validator("19500,99", true)).toBe(true);
		expect(ko.validation.rules.number.validator("19.500,99", true)).toBe(true);
		expect(ko.validation.rules.number.validator("1950099", true)).toBe(true);
		expect(ko.validation.rules.number.validator(19500.99, true)).toBe(true);
		expect(ko.validation.rules.number.validator("19,500,99", true)).toBe(false);
		expect(ko.validation.rules.number.validator("a", true)).toBe(false);
	});
});

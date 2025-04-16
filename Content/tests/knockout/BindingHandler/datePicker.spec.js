require("../testbase");
const loadCldrData = require("./cldrBase").loadCldrData;
require("../../../../Plugins/Main/Content/ts/helper/Helper.String");
require("../../../../Plugins/Main/Content/ts/knockout.custom.datePicker");
window.moment = require("moment/min/moment-with-locales");
require("../../../../node_modules/moment-duration-format/lib/moment-duration-format")(window.moment);

describe("knockout datePicker custom binding", () => {
	test("Changing observable updates input value", function () {
		loadCldrData();
		window.Globalize.locale("de");

		const expectedDate = new Date(2007);
		const observable = ko.observable(expectedDate);
		ko.test("input", { datePicker: observable }, function (input) {
			expect($(input).val()).toBe(window.Globalize.formatDate(expectedDate, { date: "medium" }));
			const newDate = new Date(2008, 5, 15);
		newDate.setUTCHours(0);
			observable(newDate);
			expect($(input).val()).toBe(window.Globalize.formatDate(newDate, { date: "medium" }));
		});
	});

	test("Changing input updates observable value", function () {
		loadCldrData();
		window.Globalize.locale("de");

		const expectedDate = new Date(2007);
		const observable = ko.observable(expectedDate);
		ko.test("input", { datePicker: observable }, function (input) {
			expect($(input).val()).toBe(Globalize.formatDate(expectedDate, { date: "medium" }));
			const newDate = new Date(2008, 5, 15);
			$(input).val(Globalize.formatDate(newDate, { date: "medium" }));
			$(input).trigger("change");
			expect(Object.prototype.toString.call(observable())).toBe("[object Date]");
			expect(observable().toString()).toBe(newDate.toString());
		});
	});

	test("Duration picker ignores locale settings", function () {
		loadCldrData();
		window.Globalize.locale("en");

		const expectedDuration = "PT4H";
		const observable = ko.observable(expectedDuration);
		ko.test("input", { datePicker: observable, datePickerOptions: { pickDuration: true } }, function (input) {
			expect($(input).val()).toBe("04:00");
		});
	});
});


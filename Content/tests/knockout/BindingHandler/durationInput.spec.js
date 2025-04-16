require("../testbase");
require("../../../../Plugins/Main/Content/ts/knockout.custom.durationInput");
window.moment = require("moment/min/moment-with-locales");
require("../../../../node_modules/moment-duration-format/lib/moment-duration-format")(window.moment);

describe("knockout durationInput custom binding", () => {
	test("Changing observable updates input value", function () {
		const expectedDuration = window.moment.duration("PT1H");
		const observable = ko.observable(expectedDuration);
		ko.test("input", { durationInput: observable }, function (input) {
			expect($(input).val()).toBe(window.moment.duration(expectedDuration).format("HH:mm", { trim: false }));
			const newDuration = window.moment.duration("PT25H30M");
			observable(newDuration);
			expect($(input).val()).toBe(window.moment.duration(newDuration).format("HH:mm", { trim: false }));
		});
	});

	test("Changing input updates observable value", function () {
		const expectedDuration = window.moment.duration("PT1H");
		const observable = ko.observable(expectedDuration);
		ko.test("input", { durationInput: observable }, function (input) {
			expect($(input).val()).toBe(window.moment.duration(expectedDuration).format("HH:mm", { trim: false }));
			const newDuration = window.moment.duration("P1DT2H30M");
			$(input).val(window.moment.duration(newDuration).format("HH:mm", { trim: false }));
			$(input).trigger("change");
			expect(observable().toString()).toBe(newDuration.toString());
		});
	});

	test("Stepping is respected", function () {
		const expectedDuration = window.moment.duration("PT1H");
		const observable = ko.observable(expectedDuration);
		ko.test("input", { durationInput: observable, datePickerOptions: { config: { stepping: 1 } } }, function (input) {
			expect($(input).val()).toBe(window.moment.duration(expectedDuration).format("HH:mm", { trim: false }));
			const newDuration = window.moment.duration("PT9M");
			$(input).val(window.moment.duration(newDuration).format("HH:mm", { trim: false }));
			$(input).trigger("change");
			expect(observable().toString()).toBe(newDuration.toString());
		});
		observable(window.moment.duration("PT1H"));
		ko.test("input", { durationInput: observable, datePickerOptions: { config: { stepping: 5 } } }, function (input) {
			expect($(input).val()).toBe(window.moment.duration(expectedDuration).format("HH:mm", { trim: false }));
			const newDuration = window.moment.duration("PT9M");
			$(input).val(window.moment.duration(newDuration).format("HH:mm", { trim: false }));
			$(input).trigger("change");
			expect(observable().toString()).toBe("PT10M");
		});
	});
});


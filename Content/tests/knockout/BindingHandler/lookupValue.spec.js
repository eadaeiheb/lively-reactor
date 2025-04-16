require("../testbase");
require("../../../../Plugins/Main/Content/ts/knockout.custom.lookupValue");

describe("knockout lookupValue custom binding", () => {
	test("Changing observable updates displayed lookup value", () => {
		const testLookups = [
			{Key: "LookupKey1", Value: "Lookup value 1"},
			{Key: "LookupKey2", Value: "Second lookup"},
			{Key: "LookupKey3", Value: "Another lookup value"}
		];
		const observable = window.ko.observable("LookupKey1");
		ko.test("lookupValue", {lookupValue: observable, lookups: testLookups}, span => {
			expect($(span).text()).toBe("Lookup value 1");
			observable("LookupKey2");
			expect($(span).text()).toBe("Second lookup");
		});
	});
	test("Unknown lookup key displays empty string", () => {
		const testLookups = [
			{Key: "LookupKey1", Value: "Lookup value 1"},
			{Key: "LookupKey2", Value: "Second lookup"},
			{Key: "LookupKey3", Value: "Another lookup value"}
		];
		const observable = window.ko.observable("LookupKey4711");
		ko.test("lookupValue", {lookupValue: observable, lookups: testLookups}, span => {
			expect($(span).text()).toBe("");
		});
	});
});

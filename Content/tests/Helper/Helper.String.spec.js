require("../testbase");
const {format} = require("../../../Plugins/Main/Content/ts/helper/Helper.String");

describe("Helper.String", function () {
	test("setStringTranslation",  () => {
		expect.assertions(2);
		const beforeSet = window.Helper.String.getTranslatedString("TestResourceKey");
		const translationMissing = beforeSet.includes("Translation Missing");
		expect(translationMissing).toBe(true);
		window.Helper.String.setStringTranslation("TestResourceKey", "Translation set via setStringTranslation");
		const afterSet = window.Helper.String.getTranslatedString("TestResourceKey");
		expect(afterSet).toEqual("Translation set via setStringTranslation");
	});
	test("fetchStringTranslation", async () => {
		expect.assertions(2);
		const url = Helper.Url.resolveUrl("~/Main/Resource/TestFetchResourceKey.json");
		$.mockjax({
			url: url,
			responseTime: 750,
			responseText: {
				Key: "TestFetchResourceKey",
				Value: "Translation returned from REST API"
			}
		});
		const beforeFetch = window.Helper.String.getTranslatedString("TestFetchResourceKey");
		const translationMissing = beforeFetch.includes("Translation Missing");
		expect(translationMissing).toBe(true);

		await window.Helper.String.fetchStringTranslation("TestFetchResourceKey");
		const afterFetch = window.Helper.String.getTranslatedString("TestFetchResourceKey");
		expect(afterFetch).toEqual("Translation returned from REST API");
	});
	test("does not throw with special chars",  () => {
		expect.assertions(1);
		const translation = window.Helper.String.getTranslatedString("...test!\"§$%&/()=?'*'+#~²³{[]}\\,.-;:_test...");
		const translationMissing = translation.includes("Translation Missing");
		expect(translationMissing).toBe(true);
	});
	test("return true when observable or string isNullOrEmpty", () => {
		expect.assertions(4);
		const emptyString = "";
		const nullValue = "";
		const emptyObservable = ko.observable("");
		const nullObservable = ko.observable(null);
		
		const result1 = window.Helper.String.isNullOrEmpty(emptyString);
		const result2 = window.Helper.String.isNullOrEmpty(nullValue);
		const result3 = window.Helper.String.isNullOrEmpty(emptyObservable);
		const result4 = window.Helper.String.isNullOrEmpty(nullObservable);

		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(result3).toBe(true);
		expect(result4).toBe(true);
	});
	test("return false when observable or string is not null or empty", () => {
		expect.assertions(2);
		const value = "testString";
		const observable = ko.observable("TestObservable");
		
		const result1 = window.Helper.String.isNullOrEmpty(value);
		const result2 = window.Helper.String.isNullOrEmpty(observable);
		
		expect(result1).toBe(false);
		expect(result2).toBe(false);
	});
	test("hash return valid value", () => {
		expect.assertions(3);
		const value = "default@example.com";

		const result1 = window.Helper.String.hash(null);
		const result2 = window.Helper.String.hash(undefined);
		const result3 = window.Helper.String.hash(value);

		expect(result1).toEqual(0);
		expect(result2).toEqual(0);
		expect(result3).toEqual(1725008766);
	});
});

describe("format", () => {

	it("should replace all the arguments", () => {
		const text = "{0}, {1}, {2}";
		const args = [1, "2", true];
		expect(format(text, ...args)).toBe("1, 2, true");
	});

	it("should replace only the first arguments", () => {
		const text = "{0}, {1}, {2}";
		const args = [1];
		expect(format(text, ...args)).toBe("1, {1}, {2}");
	});

	it("should replace nothing", () => {
		const text = "{1}, {2}";
		const args = [1];
		expect(format(text, ...args)).toBe("{1}, {2}");
	});

	it("with empty params",  () => {
		const text = "{1}, {2}";
		const args = [];
		expect(format(text, ...args)).toBe("{1}, {2}");
	});


	it("should replace every occurance", () => {
		const text = "{1}, {1}";
		const args = [0, 1];
		expect(format(text, ...args)).toBe("1, 1");
	});

});

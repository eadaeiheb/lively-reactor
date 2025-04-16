require("../testbase");
require("../../../../Plugins/Main/Content/ts/helper/Helper.String");
require("../../../../Plugins/Main/Content/ts/knockout.custom.translatedText");

describe("knockout translatedText custom binding", () => {
	let getTranslatedString;
	let fetchStringTranslation;

	beforeEach(() => {
		getTranslatedString = window.Helper.String.getTranslatedString;
		fetchStringTranslation = window.Helper.String.fetchStringTranslation;
	});

	afterEach(() => {
		window.Helper.String.getTranslatedString = getTranslatedString;
		window.Helper.String.fetchStringTranslation = fetchStringTranslation;
	});

	test("Initializing displays translation", () => {
		const translationKey = "TestTranslationKey";
		const expectedText = "Translated Test String";
		window.Helper.String.getTranslatedString = str => {
			if (str === translationKey) {
				return expectedText;
			}
			throw Error("Expected getTranslatedString to be called with " + translationKey + " but was called with " + str);
		};
		ko.test("span", {translatedText: translationKey}, span => expect($(span).text()).toBe(expectedText));
	});

	test("Changing observable updates displayed translation", () => {
		const translationKey1 = "TestTranslationKey1";
		const expectedText1 = "Translated Test String";
		const translationKey2 = "TestTranslationKey2";
		const expectedText2 = "Another Translated Test String";
		window.Helper.String.getTranslatedString = function (str) {
			if (str === translationKey1) {
				return expectedText1;
			}
			if (str === translationKey2) {
				return expectedText2;
			}
			throw Error("Expected getTranslatedString to be called with " + translationKey1 + " or " + translationKey2 + " but was called with " + str);
		};
		const observable = ko.observable(translationKey1);
		ko.test("span", {translatedText: observable}, function (span) {
			expect($(span).text()).toBe(expectedText1);
			observable(translationKey2);
			expect($(span).text()).toBe(expectedText2);
		});
	});

	test("Unknown translations are being fetched", () => {
		const translationKey = "TestTranslationKey";
		const expectedText = "Translated Test String";
		window.Helper.String.fetchStringTranslation = function (str) {
			if (str === translationKey) {
				return $.Deferred().resolve(expectedText).promise();
			}
			throw Error("Expected fetchStringTranslation to be called with " + translationKey + " but was called with " + str);
		};
		ko.test("span", {translatedText: translationKey}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});

	test("Optional language parameter is used", () => {
		const translationKey = "TestTranslationKey";
		const languageKey = "yo";
		const expectedText = "Translated Test String";
		window.Helper.String.getTranslatedString = function (str, defaultstring, language) {
			if (str === translationKey && language === languageKey) {
				return expectedText;
			}
			throw Error("Expected getTranslatedString to be called with " + translationKey + " and " + languageKey + " but was called with " + str + " and " + language);
		};
		ko.test("span", {translatedText: {key: translationKey, language: languageKey}}, function (span) {
			expect($(span).text()).toBe(expectedText);
		});
	});

});

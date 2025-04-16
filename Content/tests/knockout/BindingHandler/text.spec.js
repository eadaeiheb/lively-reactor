require("../testbase");
require("../../../../Plugins/Main/Content/ts/helper/Helper.String");
require("../../../../Plugins/Main/Content/ts/knockout.custom.text");

describe("knockout text custom binding", () => {
	let init; let update;
	beforeAll(() => {
		init = ko.bindingHandlers.text.init;
		update = ko.bindingHandlers.text.update;
	});
	afterAll(() =>{
		ko.bindingHandlers.text.init = init;
		ko.bindingHandlers.text.update = update;
	});
	test("Default text behavior", () => {
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";
		const expectedText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";

		ko.test("span", {text: longText}, span => {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("Value as object binding", () => {
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";
		const expectedText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";

		ko.test("span", {text: {value: longText}}, span => {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("limit long text with default limit value", () => {
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";
		const expectedText = window.Helper.String.limitStringWithEllipses("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu", 300);

		ko.test("span", {text: {value: longText, expand: true}}, span => expect($(span).text()).toBe(expectedText));
	});
	test("limit long text with given limit value", () => {
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";
		const limit = 50;
		const expectedText = window.Helper.String.limitStringWithEllipses("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu", limit);

		ko.test("span", {text: {value: longText, expand: true, limit: limit}}, span => {
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("testing text length changes", () => {
		const limit = 125;
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu";
		const expectedText = window.Helper.String.limitStringWithEllipses("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu", limit);
		const shortText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
		const expectedText2 = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";

		const observable = ko.observable(longText);
		ko.test("span", {text: {value: observable, expand: true, limit: limit}}, span => {
			expect($(span).text()).toBe(expectedText);
			observable(shortText);
			expect($(span).text()).toBe(expectedText2);
			observable(longText);
			expect($(span).text()).toBe(expectedText);
		});
	});
	test("Keep text format and break long words by default", () => {
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";

		ko.test("span", {text: longText}, span => {
			expect(span.style.whiteSpace).toBe("pre-line");
			expect(span.style.wordBreak).toBe("break-word");
		});
	});
	test("Bind text format and word breaks", () => {
		const longText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
		const whiteSpaceValue = "nowrap";
		const wordBreakValue = "break-all";

		ko.test("span", {text: {value: longText, whiteSpace: whiteSpaceValue, wordBreak: wordBreakValue}}, span => {
			expect(span.style.whiteSpace).toBe(whiteSpaceValue);
			expect(span.style.wordBreak).toBe(wordBreakValue);
		});
	});
});

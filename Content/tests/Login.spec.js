const $ = require("jquery");
global.$ = $;
require("../../Plugins/Main/Content/ts/Login");

describe("Login", () => {
	test("should initialize username with AD name when AD name is set", () => {
		global.localStorage.setItem("email", "test@example.com");
		global.localStorage.setItem("adName", "TestUser");

		document.body.innerHTML = `
			<div id="pre-populated-email"></div>
			<input type="text" name="email" />
		`;

		window.dispatchEvent(new Event("load"));

		expect($("#pre-populated-email").html()).toBe("TestUser");
		expect($("input[name='email']").val()).toBe("TestUser");
	});

	test("should initialize email when email is and ad is not defined", () => {
		global.localStorage.setItem("email", "test@example.com");
		global.localStorage.removeItem("adName");

		document.body.innerHTML = `
			<div id="pre-populated-email"></div>
			<input type="text" name="email" />
		`;

		window.dispatchEvent(new Event("load"));

		expect($("#pre-populated-email").html()).toBe("test@example.com");
		expect($("input[name='email']").val()).toBe("test@example.com");
	});

	test("should initialize with empty values when email is not defined", () => {
		global.localStorage.removeItem("email");
		global.localStorage.setItem("adName", "TestUser");

		document.body.innerHTML = `
			<div id="pre-populated-email"></div>
			<input type="email" name="email" />
		`;

		window.dispatchEvent(new Event("load"));

		expect($("#pre-populated-email").html()).toBe("");
		expect($("input[name='email']").val()).toBe("");
	});
});
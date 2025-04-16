require("../testbase");
require("../../../Plugins/Main/Content/ts/helper/Helper.Url");
require("../../../Plugins/Main/Content/ts/AuthorizationManager");
const {HelperUrl} = require("../../../Plugins/Main/Content/ts/helper/Helper.Url");
const {authManager} = require("../../../Plugins/Main/Content/ts/AuthorizationManager");
const {addFetchMockData} = require("../fetchMock");

describe("AuthorizationManager", () => {
	test("check for existing user permission with isAuthorizedForAction returns true", async () => {
		expect.assertions(1);
		const url = Helper.Url.resolveUrl("~/Main/Authorization/default.1.json");
		addFetchMockData(url, [{Group: "Main", Name: "Company::Create"},
			{Group: "Main", Name: "Company::Delete"},
			{Group: "Main", Name: "Person::Create"}]);
		await authManager.init("default.1");
		const hasPermission = authManager.isAuthorizedForAction("default.1", "Company", "Create");
		expect(hasPermission).toBe(true);
	});

	test("check for existing user permission with hasPermission returns true", async () => {
		expect.assertions(1);
		const url = Helper.Url.resolveUrl("~/Main/Authorization/default.1.json");
		addFetchMockData(url, [{Group: "Main", Name: "Company::Create"},
			{Group: "Main", Name: "Company::Delete"},
			{Group: "Main", Name: "Person::Create"}]);
		await authManager.init("default.1");
		const hasPermission = authManager.hasPermission("default.1", "Company::Create");
		expect(hasPermission).toBe(true);
	});

	test("check for existing user permission with isAuthorizedForAction returns false for missing permission name", async () => {
		expect.assertions(1);
		const url = Helper.Url.resolveUrl("~/Main/Authorization/default.1.json");
		addFetchMockData(url, [{Group: "Main", Name: "Company::Create"},
			{Group: "Main", Name: "Company::Delete"},
			{Group: "Main", Name: "Person::Create"}]);

		await authManager.init("default.1");
		const hasPermission = authManager.isAuthorizedForAction("default.1", "Person", "Delete");
		expect(hasPermission).toBe(false);
	});

	test("check for existing user permission with hasPermission returns false for missing permission name", async () => {
		expect.assertions(1);
		const url = Helper.Url.resolveUrl("~/Main/Authorization/default.1.json");
		addFetchMockData(url, [{Group: "Main", Name: "Company::Create"},
			{Group: "Main", Name: "Company::Delete"},
			{Group: "Main", Name: "Person::Create"}]);

		await authManager.init("default.1");
		const hasPermission = authManager.hasPermission("default.1", "Person::Delete");
		expect(hasPermission).toBe(false);
	});

	test("check for existing user permission returns false for missing permission group", async () => {
		expect.assertions(1);
		const url = Helper.Url.resolveUrl("~/Main/Authorization/default.1.json");
		addFetchMockData(url, [{Group: "Main", Name: "Company::Create"},
			{Group: "Main", Name: "Company::Delete"},
			{Group: "Main", Name: "Person::Create"}]);

		await authManager.init("default.1");
		const hasPermission = authManager.isAuthorizedForAction("default.1", "Address", "Create");
		expect(hasPermission).toBe(false);
	});

	test("throws error if user permissions are not initialized", async () => {
		expect.assertions(1);
		const url = Helper.Url.resolveUrl("~/Main/Authorization/default.1.json");
		addFetchMockData(url, [{Group: "Main", Name: "Company::Create"},
			{Group: "Main", Name: "Company::Delete"},
			{Group: "Main", Name: "Person::Create"}]);

		await authManager.init("default.1");
		expect(() => authManager.isAuthorizedForAction("german.1", "Company", "Create"))
			.toThrow("AuthorizationManager is not initialized");
	});
});
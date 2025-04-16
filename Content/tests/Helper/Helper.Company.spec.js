require("../testbase");
window.Helper.Company = require("../../../Plugins/Crm/Content/ts/helper/Helper.Company").HelperCompany;
require("../JaydataDbModel");

describe("Helper.Company", () => {
	test("getSelect2Filter", async () => {
		expect.assertions(1);
		await window.Helper.Database.initialize();
		const query = window.database.Crm_Company;
		const companyFilterQuery = window.Helper.Company.getSelect2Filter(query);
		expect(companyFilterQuery.expression.selector.source.includes("it.IsEnabled === true")).toBe(true);
	});
})
;

require("../testbase");
require("../JaydataDbModel");
const {addCriteriaToFilterString, createCompanyFilter, createPeopleFilter, createPotentialFilter, createCampaignFilter} =  require("../../../Plugins/Crm.Campaigns/Content/ts/jaydata.custom.functions");

describe("Helper.CampaignPerson", () => {
	beforeEach(async () => {
		await window.Helper.Database.initialize();
	});
	test("add && to the filter string", async () => {
		expect.assertions(1);
		const filter = "it.Id == '123'";
		const criteria = "It.Name.contains(this.name)";
		const result = addCriteriaToFilterString(filter, criteria);
		expect(result).toMatch("it.Id == '123' && It.Name.contains(this.name)");
	});
	
	test("create company filter query", async () => {
		expect.assertions(3);
		let companyQuery =  window.database.Crm_Company;
		let companyBranchQuery =  window.database.Crm_CompanyBranch;
		const toMatchFilterExpression =  "function (it) { return it.ResponsibleUser === this.responsibleUser && it.CompanyTypeKey === this.companyTypeKey && it.StandardAddress.CountryKey === this.countryKey && it.StandardAddress.ZipCode.contains(this.zipCode); }";
		const toMatchObject = {
			responsibleUser: 'default.1',
			zipCode: '08505',
			companyTypeKey: 'Customer',
			countryKey: 'ES',
		}		
		const criteria = {};
		criteria.ResponsibleUser = toMatchObject.responsibleUser;
		criteria.ZipCode = toMatchObject.zipCode;
		criteria.CompanyTypeKey = toMatchObject.companyTypeKey;
		criteria.CountryKey = toMatchObject.countryKey;
		criteria.City = "";

		companyQuery = createCompanyFilter(criteria, companyBranchQuery, companyQuery);
		
		expect(companyQuery.expression.source.selector.parameters).toMatchObject(toMatchObject);
		expect(companyQuery.expression.source.selector.source).toMatch(toMatchFilterExpression);
		expect(companyQuery.expression.source.selector.source).not.toContain("it.StandardAddress.City.contains(this.zipCode)");
	});	
	
	test("create people filter query", async () => {
		expect.assertions(3);
		let peopleQuery =  window.database.Crm_Person;
		const toMatchObject = {
			firstname: "Joan",
			surname: "Lopez",
			departmentTypeKey: "102",
			businessTitleKey: "Mr",
		};
		const toMatchFilterExpression = "function (it) { return it.Name.contains(this.departmentTypeKey) && it.Firstname.contains(this.firstname) && it.Surname.contains(this.surname) && it.BusinessTitleKey.contains(this.businessTitleKey); }";
		const criteria = {};
		criteria.Firstname = toMatchObject.firstname;
		criteria.Surname = toMatchObject.surname;
		criteria.DepartmentTypeKey = toMatchObject.departmentTypeKey;
		criteria.BusinessTitleKey = toMatchObject.businessTitleKey;
		criteria.ParentId = "";

		peopleQuery = createPeopleFilter(criteria, peopleQuery);
		
		expect(peopleQuery.expression.source.selector.parameters).toMatchObject(toMatchObject);
		expect(peopleQuery.expression.source.selector.source).toMatch(toMatchFilterExpression);
		expect(peopleQuery.expression.source.selector.source).not.toContain("it.ParentId === this.parentId");
	});
	
	test("create potential filter query", async () => {
		expect.assertions(3);
		let potentialQuery =  window.database.CrmProject_Potential;
		const toMatchObject = {
			sourceTypeKey: "123",
			productFamilyKey: "654564",
			statusKey: "open",
		};
		const toMatchFilterExpression = "function (it) { return it.SourceTypeKey === this.sourceTypeKey && it.ProductFamilyKey === this.productFamilyKey && it.StatusKey === this.statusKey; }";
		const criteria = {};
		criteria.StatusKey = toMatchObject.statusKey;
		criteria.SourceTypeKey = toMatchObject.sourceTypeKey;
		criteria.ProductFamilyKey = toMatchObject.productFamilyKey;
		criteria.PriorityKey = "";
		
		potentialQuery = createPotentialFilter(criteria, potentialQuery);

		expect(potentialQuery.expression.source.selector.parameters).toMatchObject(toMatchObject);
		expect(potentialQuery.expression.source.selector.source).toMatch(toMatchFilterExpression);
		expect(potentialQuery.expression.source.selector.source).not.toContain("It.PriorityKey === this.priorityKey");

	});

	test("create project filter query", async () => {
		expect.assertions(3);
		let projectQuery =  window.database.CrmProject_Project;
		const toMatchObject = {
			sourceTypeKey: "123",
			productFamilyKey: "654564",
			statusKey: "open",
		};
		const toMatchFilterExpression = "function (it) { return it.SourceTypeKey === this.sourceTypeKey && it.ProductFamilyKey === this.productFamilyKey && it.StatusKey === this.statusKey; }";
		const criteria = {};
		criteria.StatusKey = toMatchObject.statusKey;
		criteria.SourceTypeKey = toMatchObject.sourceTypeKey;
		criteria.ProductFamilyKey = toMatchObject.productFamilyKey;
		criteria.CategoryKey = "";

		projectQuery = createPotentialFilter(criteria, projectQuery);

		expect(projectQuery.expression.source.selector.parameters).toMatchObject(toMatchObject);
		expect(projectQuery.expression.source.selector.source).toMatch(toMatchFilterExpression);
		expect(projectQuery.expression.source.selector.source).not.toContain("It.CategoryKey === this.categoryKey");
	});	
	
	test("create campaign filter query", async () => {
		expect.assertions(3);
		let campaignQuery =  window.database.CrmCampaigns_Campaign;
		const toMatchObject = {
			categoryKey: "123",
			productFamilyKey: "654564",
			statusKey: "open",
		};
		const toMatchFilterExpression = "function (it) { return it.CategoryKey === this.categoryKey && it.ProductFamilyKey === this.productFamilyKey && it.StatusKey === this.statusKey; }";
		const criteria = {};
		criteria.StatusKey = toMatchObject.statusKey;
		criteria.CategoryKey = toMatchObject.categoryKey;
		criteria.ProductFamilyKey = toMatchObject.productFamilyKey;
		criteria.Name = "";

		campaignQuery = createCampaignFilter(criteria, campaignQuery);

		expect(campaignQuery.expression.source.selector.parameters).toMatchObject(toMatchObject);
		expect(campaignQuery.expression.source.selector.source).toMatch(toMatchFilterExpression);
		expect(campaignQuery.expression.source.selector.source).not.toContain("It.Name.contains(this.name)");
	});
	
	
})


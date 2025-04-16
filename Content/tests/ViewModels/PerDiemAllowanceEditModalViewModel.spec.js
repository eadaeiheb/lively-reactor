require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
const {PerDiemAllowanceEditModalViewModel} = require("../../../Plugins/Crm.PerDiem.Germany/Content/ts/PerDiemAllowanceEntryEditModalViewModel");

describe("PerDiemAllowanceEntryEditModalViewModelTests", () => {
	let viewModel;
	beforeEach(async () => {
		await window.Helper.Database.initialize();
		viewModel = new PerDiemAllowanceEditModalViewModel({});
		const allowance = new window.database.CrmPerDiemGermany_PerDiemAllowance.createNew({
			Id: $data.createGuid().toString(), Key: "breakfast", AllDayAmount: 28, PartialDayAmount: 14
		});
		viewModel.perDiemAllowances([allowance]);
	});

	test("Check if percentage deductions calculated correctly", () => {
		const breakfast = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "breakfast", AdjustmentValue: -0.20, IsPercentage: true
		});
		const lunch = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "lunch", AdjustmentValue: -0.40, IsPercentage: true
		});
		const dinner = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "dinner", AdjustmentValue: -0.40, IsPercentage: true
		});
		const entry = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntry.createNew({
			AdjustmentReferences: [breakfast], PerDiemAllowanceKey: "breakfast", AllDay: false
		});

		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast deduction given in percentage not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(8.4);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch deduction given in percentage not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(2.8);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner deduction given in percentage not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(2.8);

		entry.AdjustmentReferences = [breakfast];
		entry.AllDay = true;
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast deduction given in percentage not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(22.4);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch deduction given in percentage not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(16.8);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner deduction given in percentage not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(16.8);

		entry.AdjustmentReferences = [breakfast, lunch, dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Deduction given in percentage not calculated correctly at a full day entry when all three entries are present
		expect(viewModel.calculatedAmount()).toBe(0);
	});

	test("Check if amount deductions calculated correctly", () => {
		const breakfast = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "breakfast", AdjustmentValue: -1, IsPercentage: false
		});
		const lunch = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "lunch", AdjustmentValue: -2, IsPercentage: false
		});
		const dinner = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "dinner", AdjustmentValue: -3, IsPercentage: false
		});
		const entry = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntry.createNew({
			AdjustmentReferences: [breakfast], PerDiemAllowanceKey: "breakfast", AllDay: false
		});

		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast deduction given in amount not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(13);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch deduction given in amount not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(12);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner deduction given in amount not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(11);

		entry.AdjustmentReferences = [breakfast];
		entry.AllDay = true;
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast deduction given in amount not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(27);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch deduction given in amount not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(26);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner deduction given in amount not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(25);

		entry.AdjustmentReferences = [breakfast, lunch, dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Deduction given in amount not calculated correctly at a full day entry when all three entries are present
		expect(viewModel.calculatedAmount()).toBe(22);
	});

	test("Check if percentage surcharges calculated correctly", () => {
		const breakfast = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "breakfast", AdjustmentValue: 0.20, IsPercentage: true
		});
		const lunch = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "lunch", AdjustmentValue: 0.40, IsPercentage: true
		});
		const dinner = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "dinner", AdjustmentValue: 0.40, IsPercentage: true
		});
		const entry = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntry.createNew({
			AdjustmentReferences: [breakfast], PerDiemAllowanceKey: "breakfast", AllDay: false
		});

		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast surcharge given in percentage not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(19.6);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch surcharge given in percentage not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(25.2);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner surcharge given in percentage not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(25.2);

		entry.AdjustmentReferences = [breakfast];
		entry.AllDay = true;
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast surcharge given in percentage not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(33.6);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch surcharge given in percentage not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(39.2);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner surcharge given in percentage not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(39.2);

		entry.AdjustmentReferences = [breakfast, lunch, dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Surcharge given in percentage not calculated correctly at a full day entry when all three entries are present
		expect(viewModel.calculatedAmount()).toBe(56);
	});

	test("Check if amount surcharges calculated correctly", () => {
		const breakfast = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "breakfast", AdjustmentValue: 1, IsPercentage: false
		});
		const lunch = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "lunch", AdjustmentValue: 2, IsPercentage: false
		});
		const dinner = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.createNew({
			Value: "dinner", AdjustmentValue: 3, IsPercentage: false
		});
		const entry = new window.database.CrmPerDiemGermany_PerDiemAllowanceEntry.createNew({
			AdjustmentReferences: [breakfast], PerDiemAllowanceKey: "breakfast", AllDay: false
		});

		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast surcharge given in amount not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(15);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch surcharge given in amount not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(16);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner surcharge given in amount not calculated correctly at a half day entry
		expect(viewModel.calculatedAmount()).toBe(17);

		entry.AdjustmentReferences = [breakfast];
		entry.AllDay = true;
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Breakfast surcharge given in amount not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(29);

		entry.AdjustmentReferences = [lunch];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Lunch surcharge given in amount not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(30);

		entry.AdjustmentReferences = [dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Dinner surcharge given in amount not calculated correctly at a full day entry
		expect(viewModel.calculatedAmount()).toBe(31);

		entry.AdjustmentReferences = [breakfast, lunch, dinner];
		viewModel.perDiemAllowanceEntry(entry.asKoObservable());
		//Surcharge given in amount not calculated correctly at a full day entry when all three entries are present
		expect(viewModel.calculatedAmount()).toBe(34);
	});
});
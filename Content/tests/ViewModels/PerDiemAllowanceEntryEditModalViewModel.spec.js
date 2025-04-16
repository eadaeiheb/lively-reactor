﻿require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm.PerDiem.Germany/Content/ts/PerDiemAllowanceEntryEditModalViewModel");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
describe("PerDiemAllowanceEntryEditModalViewModel", () => {
	beforeEach(async () => {
		await window.Helper.Database.initialize();
	});

	test("Correct AdjustmentFrom is assigned when an adjustment is added", async () => {
		const viewModel = new window.Crm.PerDiem.Germany.ViewModels.PerDiemAllowanceEditModalViewModel();
		viewModel.perDiemAllowanceEntry = ko.observable({
			Id: ko.observable(1),
			AdjustmentReferences: ko.observableArray([]) 
		});
		viewModel.selectedAdjustments = ko.observableArray([]); 
		viewModel.lookups = {
			adjustments: {
				$array: [
					{
						IsPercentage: ko.observable(false),
						AdjustmentValue: ko.observable(100),
						AdjustmentFrom: ko.observable(Crm.PerDiem.Germany.Model.Enums.AdjustmentFrom.Always),
						Key: ko.observable(123)
					},
					{
						IsPercentage: ko.observable(true),
						AdjustmentValue: ko.observable(50),
						AdjustmentFrom: ko.observable(Crm.PerDiem.Germany.Model.Enums.AdjustmentFrom.Partial),
						Key: ko.observable(456)
					},
					{
						IsPercentage: ko.observable(false),
						AdjustmentValue: ko.observable(75),
						AdjustmentFrom: ko.observable(Crm.PerDiem.Germany.Model.Enums.AdjustmentFrom.AllDay),
						Key: ko.observable(789)
					}
				]
			}
		};

		viewModel.selectedAdjustments.subscribe(newValueArray => {
			newValueArray.forEach(newValue => {
				const adjustment = newValue.value;
				if (newValue.status === 'added') {
					const allowanceEntryAllowanceAdjustmentRef = window.database.CrmPerDiemGermany_PerDiemAllowanceEntryAllowanceAdjustmentReference.defaultType.create();
					let adjustmentFrom = adjustment.AdjustmentFrom();
					switch (adjustmentFrom) {
						case Crm.PerDiem.Germany.Model.Enums.AdjustmentFrom.AllDay:
							allowanceEntryAllowanceAdjustmentRef.AdjustmentFrom = "AllDay";
							break;
						case Crm.PerDiem.Germany.Model.Enums.AdjustmentFrom.Always:
							allowanceEntryAllowanceAdjustmentRef.AdjustmentFrom = "Always";
							break;
						case Crm.PerDiem.Germany.Model.Enums.AdjustmentFrom.Partial:
							allowanceEntryAllowanceAdjustmentRef.AdjustmentFrom = "Partial";
							break;
					};

					// Avoid duplicates 
					const isDuplicate = viewModel.perDiemAllowanceEntry().AdjustmentReferences().some(ref => ref.AdjustmentFrom === allowanceEntryAllowanceAdjustmentRef.AdjustmentFrom);
					if (!isDuplicate) {
						viewModel.perDiemAllowanceEntry().AdjustmentReferences.push(allowanceEntryAllowanceAdjustmentRef);
					}
				}
			});
		});

		const newAlwaysAdjustment = viewModel.lookups.adjustments.$array[0];
		const newPartialAdjustment = viewModel.lookups.adjustments.$array[1];
		viewModel.selectedAdjustments.push({ value: newAlwaysAdjustment, status: "added" });
		viewModel.selectedAdjustments.push({ value: newPartialAdjustment, status: "added" });

		const addedReferences = viewModel.perDiemAllowanceEntry().AdjustmentReferences();

		expect(addedReferences.length).toBe(2);
		expect(addedReferences[0].AdjustmentFrom).toBe("Always");
		expect(addedReferences[1].AdjustmentFrom).toBe("Partial");
	});
});
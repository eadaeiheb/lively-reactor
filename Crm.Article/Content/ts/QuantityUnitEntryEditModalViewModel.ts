import {namespace} from "@Main/namespace";

export class QuantityUnitEntryEditModalViewModel extends window.Main.ViewModels.ViewModelBase {
	quantityUnit = ko.observable()
	quantityUnitGroup = ko.observable()

	lookups: LookupType = {
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
	};
	errors: KnockoutValidationErrors;

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		let quantityUnit: Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry;
		if (id) {
			quantityUnit = await window.database.CrmArticle_QuantityUnitEntry
				.find(id);
			window.database.attachOrGet(quantityUnit)
			if(!quantityUnit.IsGroup)
				this.quantityUnitGroup((await window.database.CrmArticle_QuantityUnitEntry.find(quantityUnit.QuantityUnitGroupKey)).asKoObservable())
		} else {
			quantityUnit = window.database.CrmArticle_QuantityUnitEntry.defaultType.create();
			quantityUnit.IsGroup = Boolean(params.isGroup);
			if(params.groupId) {
				quantityUnit.QuantityUnitGroupKey = params.groupId
				this.quantityUnitGroup((await window.database.CrmArticle_QuantityUnitEntry.find(quantityUnit.QuantityUnitGroupKey)).asKoObservable())
			}
			window.database.add(quantityUnit);
		}
		this.quantityUnit(quantityUnit.asKoObservable())
		if(!this.quantityUnit().IsGroup() && !id) {
			this.quantityUnit().Factor(1);
			this.quantityUnit().Divisor(1);
		}
		this.quantityUnit(quantityUnit.asKoObservable())

		this.quantityUnit().Name.extend({
			required: {
				params: true,
				onlyIf: () => this.quantityUnit().IsGroup(),
				message: window.Helper.String
					.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("Name"))
			}
		});
		this.quantityUnit().QuantityUnitKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("QuantityUnit")),
			}
		});
		this.quantityUnit().Factor.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("Factor")),
				onlyIf: () => !this.quantityUnit().IsGroup()
			}
		});
		this.quantityUnit().Divisor.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("Divisor")),
				onlyIf: () => !this.quantityUnit().IsGroup()
			}
		});
		this.errors = ko.validation.group(this.quantityUnit);
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
	};

	async save(): Promise<void> {
		this.loading(true);
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			return;
		}
		await window.database.saveChanges();
		this.loading(false);
		$(".modal:visible").modal("hide");
	};
}

namespace("Crm.Article.ViewModels").QuantityUnitEntryEditModalViewModel = QuantityUnitEntryEditModalViewModel;

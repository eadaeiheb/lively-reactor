import {HelperLookup} from "@Main/helper/Helper.Lookup";
import {namespace} from "@Main/namespace";

export class QuantityUnitEntryListIndexViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry, Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry> {

	lookups: LookupType = {
		quantityUnit: {$tableName: "CrmArticle_QuantityUnit"},
	};
	constructor() {
		super("CrmArticle_QuantityUnitEntry", "Name", "ASC");
		this.pageSize(24);
	}

	applyFilters(query: $data.Queryable<any>): $data.Queryable<any> {
		query = query.filter("IsGroup", "===", true)
		return super.applyFilters(query);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<any> {
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
		await super.init(id, params);
	};

	async remove(quantityUnitEntry: any): Promise<void> {
		try {
			await window.Helper.Confirm.confirmDelete();
		} catch (e) {
			return;
		}
		this.loading(true);
		quantityUnitEntry = window.Helper.Database.getDatabaseEntity<Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry>(quantityUnitEntry);
		window.database.remove(quantityUnitEntry);
		try {
			await window.database.saveChanges();
		} catch (e) {
			this.loading(false);
			let errorMessage = (e as Error).message;
			let parsedErrorMessage = window.Helper.String.tryExtractErrorMessageValue(errorMessage) ?? errorMessage;
			window.database.detach(quantityUnitEntry);
			window.swal(window.Helper.String.getTranslatedString("Error"), parsedErrorMessage, "error");
		}
	}
}

namespace("Crm.Article.ViewModels").QuantityUnitEntryListIndexViewModel = QuantityUnitEntryListIndexViewModel;

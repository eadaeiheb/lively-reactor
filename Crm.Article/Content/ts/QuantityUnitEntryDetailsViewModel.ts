import {HelperLookup} from "@Main/helper/Helper.Lookup";
import {Breadcrumb} from "@Main/breadcrumbs";
import {namespace} from "@Main/namespace";


export class QuantityUnitEntryDetailsViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry, Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry> {

	lookups: LookupType = {
		quantityUnit: {$tableName: "CrmArticle_QuantityUnit"},
	};
	id : string = null
	quantityUnitGroup = ko.observable(null);
	constructor() {
		super("CrmArticle_QuantityUnitEntry", "QuantityUnitKey", "ASC");
	}

	applyFilters(query: $data.Queryable<any>): $data.Queryable<any> {
		query = query.filter("QuantityUnitGroupKey", "===", this.id)
		return super.applyFilters(query);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		this.id = id;
		this.quantityUnitGroup((await window.database.CrmArticle_QuantityUnitEntry.find(this.id)).asKoObservable());
		await this.setBreadcrumbs();
		await super.init(id, params);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
	};

	getEventHandlerDefinition() : any {
		const handlerDefinition = super.getEventHandlerDefinition();
		const baseUpdateEventHandler = handlerDefinition[this.entityType]["afterUpdate"]
		handlerDefinition[this.entityType]["afterUpdate"] = () => {
			baseUpdateEventHandler()
			window.database.CrmArticle_QuantityUnitEntry.find(this.id)
				.then((qtyUnitGroup) => this.quantityUnitGroup(qtyUnitGroup.asKoObservable()))
		}
		return handlerDefinition
	}

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

	async setBreadcrumbs(): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.String.getTranslatedString("QuantityUnitGroups"), null, "#/Crm.Article/QuantityUnitEntryList/IndexTemplate"),
			new Breadcrumb(this.quantityUnitGroup().Name(), null, window.location.hash)
		]);
	}
}

namespace("Crm.Article.ViewModels").QuantityUnitEntryDetailsViewModel = QuantityUnitEntryDetailsViewModel;

import { namespace } from "@Main/namespace";
import { HelperStore } from "./helper/Helper.Store";
import {HelperArticle} from "@Crm.Article/helper/Helper.Article";

export class StoreListIndexViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Store, Crm.Article.Rest.Model.ObservableCrmArticle_Store> {

	constructor() {
		super("CrmArticle_Store", ["Name"], ["ASC"], ["Locations"]);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
	}

	async initItems(items: Crm.Article.Rest.Model.ObservableCrmArticle_Store[]): Promise<Crm.Article.Rest.Model.ObservableCrmArticle_Store[]> {
		await super.initItems(items);
		await HelperStore.loadStoreNames(items, this.currentUser().DefaultLanguageKey);
		return items;
	};

	applyFilter(query: $data.Queryable<any>, filterValue: any, filterName?: string): $data.Queryable<any> {
		if (filterName === "Name") {
			return HelperStore.getStoreAutocompleteFilter(query, filterValue.Value, this.currentUser().DefaultLanguageKey);
		}
		return super.applyFilter(query, filterValue, filterName);
	}

	async deleteStore(store: Crm.Article.Rest.Model.ObservableCrmArticle_Store): Promise<void> {
		try {
			await window.Helper.Confirm.confirmDelete();
			let targetedLocations = await window.database.CrmArticle_Location
				.filter("it.StoreId === this.storeId", { storeId: store.Id() })
				.toArray();
			for (const targetedLocation of targetedLocations) {
				await window.database.remove(targetedLocation);
			}
			let entity = await window.Helper.Database.getDatabaseEntity(store);
			window.database.remove(entity);
			await window.database.saveChanges();
			this.loading(false);
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}

	}

}
namespace("Crm.Article.ViewModels").StoreListIndexViewModel = StoreListIndexViewModel;


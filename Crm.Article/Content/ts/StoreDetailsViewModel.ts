import { Breadcrumb } from "@Main/breadcrumbs";
import { namespace } from "@Main/namespace";

export class StoreDetailsViewModel extends window.Main.ViewModels.ViewModelBase {

	names = ko.observableArray<{
		Value: KnockoutObservable<string>,
		Language: string,
		Name: string,
		StoreName: Crm.Article.Rest.Model.Lookups.CrmArticle_StoreName
	}>([]);
	tabs = ko.observable<{}>({});
	store = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Store>(null);
	lookups: LookupType = {
		articleGroups01: {$tableName: "CrmArticle_ArticleGroup01"},
		articleGroups02: {$tableName: "CrmArticle_ArticleGroup02"},
		articleGroups03: {$tableName: "CrmArticle_ArticleGroup03"},
		articleGroups04: {$tableName: "CrmArticle_ArticleGroup04"},
		articleGroups05: {$tableName: "CrmArticle_ArticleGroup05"},
		articleTypes: {$tableName: "CrmArticle_ArticleType"},
		currencies: {$tableName: "Main_Currency"},
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
		languages: {$tableName: "Main_Language", $filterExpression: "it.IsSystemLanguage === true", $array: undefined},
	};

	constructor() {
		super();
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		let targetStore = await window.database.CrmArticle_Store.find(id);
		this.store(targetStore.asKoObservable());
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		await this.setBreadcrumbs();

		const names = await this.getStoreNames(this.store().StoreNo());
		const storeNameObjects = this.createNameObjects(names);
		this.names(storeNameObjects);
	}

	async getStoreNames(key: string): Promise<Crm.Article.Rest.Model.Lookups.CrmArticle_StoreName[]> {
		return await window.database.CrmArticle_StoreName
			.filter("it.Key == this.Key", {Key: key})
			.toArray();
	}

	createNameObjects(names: Crm.Article.Rest.Model.Lookups.CrmArticle_StoreName[]): any[] {
		return this.lookups.languages.$array.slice(1).map(function (x) {
			const storeName = names.find(function (it) {
				return it.Language === x.Key;
			});
			return {
				Value: window.ko.observable(storeName ? storeName.Value : ""),
				Language: x.Key,
				Name: x.Value,
				StoreName: storeName
			};
		});

	}

	async deleteLocation(location: Crm.Article.Rest.Model.CrmArticle_Location): Promise<void> {
		await window.Helper.Confirm.confirmDelete();
		this.loading(true);
		window.database.remove(location);
		await window.database.saveChanges();
		this.loading(false);
	}

	async deleteStorageArea(storageArea: Crm.Article.Rest.Model.ObservableCrmArticle_StorageArea): Promise<void> {
		await window.Helper.Confirm.confirmDelete();
		this.loading(true);
		storageArea.Locations().forEach((loc) => loc.StorageAreaId(null))
		window.database.remove(storageArea);
		await window.database.saveChanges();
		this.loading(false);
	}

	onSave(): void {
		this.names().forEach(name => {
			if (window.ko.unwrap(name.Value) === "" && name.StoreName === undefined)
				return;
			if (name.StoreName) {
				window.database.attachOrGet(name.StoreName);
				name.StoreName.Value = window.ko.unwrap(name.Value);
				name.StoreName.Key = this.store().StoreNo();
				name.StoreName.Language = name.Language;
				if (!window.ko.unwrap(name.Value)) {
					window.database.remove(name.StoreName);
				}
			} else {
				const storeName = window.database.CrmArticle_StoreName.defaultType.create();
				storeName.Key = this.store().StoreNo();
				storeName.Language = name.Language;
				storeName.Value = window.ko.unwrap(name.Value);
				window.database.add(storeName);
			}
		});
	}

	async setBreadcrumbs(): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.String.getTranslatedString("Stores"), "Store::Index", "#/Crm.Article/StoreList/IndexTemplate"),
			new Breadcrumb(this.store().Name(), null, window.location.hash)
		]);
	}

}
namespace("Crm.Article.ViewModels").StoreDetailsViewModel = StoreDetailsViewModel;


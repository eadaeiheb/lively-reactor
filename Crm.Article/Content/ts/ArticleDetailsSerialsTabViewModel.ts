import type {ArticleDetailsViewModel} from "@Crm.Article/ArticleDetailsViewModel";
import {namespace} from "@Main/namespace";

class ArticleDetailsSerialsTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Store, Crm.Article.Rest.Model.ObservableCrmArticle_Store> {

	loading: KnockoutObservable<boolean> = ko.observable<boolean>(true);
	article: KnockoutObservable<any> = ko.observable(null);
	serialWithoutStoreExists: KnockoutObservable<boolean> = ko.observable(false);
	serialVm: any = null;
	toggleSerials: () => void = null;
	availableSerialStatuses: string[] = [];
	lookups = {
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
	};


	constructor(parentViewModel : ArticleDetailsViewModel) {
		super("CrmArticle_Store", ["StoreNo"], ["ASC"], ["Locations", "StorageAreas", ArticleDetailsSerialsTabViewModel.getSerialInclude2(parentViewModel.article().Id())]);
		this.article = parentViewModel.article;
		this.infiniteScroll(true);
	}

	static getSerialInclude2(articleKey) {
		return {
			Selector: "Serials",
			Operation: "filter(function (serial) {return serial.ArticleKey == '" + articleKey + "';})"
		};
	}

	async init(args): Promise<void> {
		this.loading(true);
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		await super.init(args);
		const orphanedSerialCount = await window.database.CrmArticle_Serial
			.filter(function(serial) {return serial.StoreKey === null && serial.StorageAreaKey === null && serial.LocationKey === null && serial.ArticleKey === this.articleKey}, {articleKey: this.article().Id() })
			.count();
		if(orphanedSerialCount != 0){
			this.serialWithoutStoreExists(true);
			this.serialVm = new SerialListViewModel(this.article().Id(), null, null, null)
			this.serialVm.isInitialized = false;
			this.toggleSerials = function() {
				if(this.serialVm.isInitialized)
					return
				this.serialVm.isInitialized = true
				this.serialVm.init();
			}
		}
	}

	applyFilters(query) {
		const viewModel = this;
		query = super.applyFilters(query);
		if(!window.Helper.Offline || window.Helper.Offline.status === "online")
			return query.filter("it.Serials.some(function (serial) { return serial.ArticleKey == this.articleKey })", { articleKey: viewModel.article().Id() });
		else
			return query.filter("filterStoreBySerials", {articleKey: viewModel.article().Id()});
	}

	initItems(items: Crm.Article.Rest.Model.ObservableCrmArticle_Store[]) : Promise<Crm.Article.Rest.Model.ObservableCrmArticle_Store[]> {
		items.forEach((store) => {
			// @ts-ignore
			store.storageAreasVm = new StorageAreaListViewModel(this.article().Id(), store.Id(), this.availableSerialStatuses)
			// @ts-ignore
			store.storageAreasVm.isInitialized = false;
			// @ts-ignore
			store.toggleLocations = function() {
				if(this.storageAreasVm.isInitialized)
					return
				this.storageAreasVm.isInitialized = true
				this.storageAreasVm.init();
			}
		});
		return super.initItems(items);
	};
}


class StorageAreaListViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_StorageArea, Crm.Article.Rest.Model.ObservableCrmArticle_StorageArea> {

	serialWithoutStorageAreaExists: KnockoutObservable<boolean> = ko.observable(false);
	locationsVm: any = ko.observable({});
	storeKey: string = null;
	articleKey: string = null;
	availableSerialStatuses: string[] = []
	toggleSerials: () => void = null;
	lookups = {
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
	};


	constructor(articleKey : string, storeKey : string, availableSerialStatuses: string[]) {
		super("CrmArticle_StorageArea", ["StorageAreaNo"], ["ASC"], ["Locations", ArticleDetailsSerialsTabViewModel.getSerialInclude2(articleKey)]);
		this.articleKey = articleKey;
		this.storeKey = storeKey;
		this.availableSerialStatuses = availableSerialStatuses;
		this.infiniteScroll(true);
	}

	async init(args): Promise<void> {
		this.loading(true);
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		await super.init(args);
		const orphanedSerialCount = await window.database.CrmArticle_Serial
			.filter(function(serial) {return serial.StoreKey === this.storeKey && serial.StorageAreaKey === null && serial.ArticleKey === this.articleKey}, {articleKey: this.articleKey, storeKey: this.storeKey})
			.count();
		if(orphanedSerialCount != 0){
			this.locationsVm(new LocationStockListViewModel(this.articleKey, this.storeKey, null, null))
			this.locationsVm().isInitialized = true
			this.locationsVm().init();
			this.serialWithoutStorageAreaExists(true);
		}
	}

	applyFilters(query) {
		query = super.applyFilters(query);
		if(!window.Helper.Offline || window.Helper.Offline.status === "online")
			return query.filter("it.Serials.some(function (serial) { return serial.ArticleKey == this.articleKey && serial.StoreKey == this.storeKey })", { articleKey: this.articleKey, storeKey: this.storeKey });
		else
			return query.filter("filterStorageAreaBySerials", {articleKey: this.articleKey});
	}

	initItems(items: Crm.Article.Rest.Model.ObservableCrmArticle_StorageArea[]) : Promise<Crm.Article.Rest.Model.ObservableCrmArticle_StorageArea[]> {
		items.forEach((storageArea) => {
			// @ts-ignore
			storageArea.locationsVm = new LocationStockListViewModel(this.articleKey, this.storeKey, storageArea.Id, this.availableSerialStatuses)
			// @ts-ignore
			storageArea.locationsVm.isInitialized = false;
			// @ts-ignore
			storageArea.toggleLocations = function() {
				if(this.locationsVm.isInitialized)
					return
				this.locationsVm.isInitialized = true
				this.locationsVm.init();
			}
		});
		return super.initItems(items);
	};
}

class LocationStockListViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Location, Crm.Article.Rest.Model.ObservableCrmArticle_Location> {

	noStockExists: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	serialWithoutLocationExists: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	serialVm: any = null;
	toggleSerials: () => void =null;
	availableSerialStatuses: string[] = []
	articleKey: string = null;
	storageAreaKey: string = null;
	storeKey: string = null;


	constructor(articleKey : string, storeKey : string, storageAreaKey : string, availableSerialStatuses: string[]) {
		super("CrmArticle_Location", ["LocationNo"], ["ASC"], [ArticleDetailsSerialsTabViewModel.getSerialInclude2(articleKey)]);
		this.articleKey = articleKey;
		this.storeKey = storeKey;
		this.storageAreaKey = storageAreaKey;
		this.availableSerialStatuses = availableSerialStatuses;
		this.infiniteScroll(true);
	}

	async init(args){
		await super.init(args);
		const orphanedSerialCount = await window.database.CrmArticle_Serial
			.filter(function(x) { return x.StoreKey === this.storeKey && x.LocationKey === null},{storeKey: this.storeKey})
			.count();
		if(orphanedSerialCount != 0){
			this.serialVm = new SerialListViewModel(this.articleKey, this.storeKey, this.storageAreaKey, null)
			this.serialVm.isInitialized = false;
			this.toggleSerials = function() {
				if(this.serialVm.isInitialized)
					return;
				this.serialVm.isInitialized = true;
				this.serialVm.init();
			}
			this.serialWithoutLocationExists(true);
		}
	}

	applyFilters(query) {
		const viewModel = this;
		query = super.applyFilters(query).filter(function (location) {
			return location.StoreId === this.storeKey && location.StorageAreaId === this.storageAreaKey
		}, {storeKey: viewModel.storeKey, storageAreaKey: viewModel.storageAreaKey})
		if(!window.Helper.Offline || window.Helper.Offline.status === "online")
			return query.filter("it.Serials.some((serial) => serial.ArticleKey == this.articleKey)", {articleKey: viewModel.articleKey});
		else
			return query.filter("filterLocationBySerials", {articleKey: viewModel.articleKey});
	}

	initItems(items) {
		items.forEach((location) => {
			location.serialVm = new SerialListViewModel(this.articleKey, this.storeKey, this.storageAreaKey, location.Id())
			location.serialVm.isInitialized = false;
			location.toggleSerials = function() {
				if(this.serialVm.isInitialized)
					return
				this.serialVm.isInitialized = true
				this.serialVm.init();
			}
		});
		return super.initItems(items);
	};
}

class SerialListViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Serial, Crm.Article.Rest.Model.ObservableCrmArticle_Serial> {

	articleKey: string = null;
	storeKey: string = null;
	storageAreaKey: string = null;
	locationKey: string = null;


	constructor(articleKey : any, storeKey : any, storageAreaKey:any, locationKey : any) {
		super("CrmArticle_Serial", ["SerialNo"], ["ASC"]);
		this.articleKey = articleKey;
		this.storeKey = storeKey;
		this.storageAreaKey = storageAreaKey;
		this.locationKey = locationKey;
		this.infiniteScroll(true);
	}

	applyFilters(query) {
		return super.applyFilters(query)
			.filter(function (serial) {return serial.StoreKey === this.storeKey && serial.StorageAreaKey === this.storageAreaKey && serial.LocationKey === this.locationKey && serial.ArticleKey === this.articleKey}, { storeKey: this.storeKey, storageAreaKey: this.storageAreaKey, locationKey: this.locationKey, articleKey: this.articleKey });
	}
}
namespace("Crm.Article.ViewModels").ArticleDetailsSerialsTabViewModel = ArticleDetailsSerialsTabViewModel;


import { namespace } from "@Main/namespace";

export class StorageAreaEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	loading = ko.observable<boolean>(true);
	storageArea = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_StorageArea>(null);
	selectedLocationIds = ko.observableArray<string>([]);
	errors = ko.validation.group(this.storageArea, { deep: true });

	constructor() {
		super();
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		let targetStorageArea: Crm.Article.Rest.Model.CrmArticle_StorageArea;
		if (id) {
			targetStorageArea = await window.database.CrmArticle_StorageArea.include("Locations").find(id);
			const locationIds = await window.database.CrmArticle_Location.filter(function(location) { return location.StorageAreaId == this.storageAreaId }, {storageAreaId: id}).map(function (location) { return location.Id }).toArray()
			this.selectedLocationIds(locationIds)
			window.database.attachOrGet(targetStorageArea);
		} else {
			targetStorageArea = window.database.CrmArticle_StorageArea.defaultType.create();
			targetStorageArea.StoreId = params["storeId"];
			window.database.add(targetStorageArea);
		}
		this.storageArea(targetStorageArea.asKoObservable());
	}

	cancel(): void {
		window.database.detach(this.storageArea().innerInstance);
		$(".modal:visible").modal("hide");
	}

	getLocationsByIds(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Location>, ids: string[]): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Location> {
		return query.filter(function (it) {
				return it.Id in this.ids;
			},
			{ids: ids});
	};

	getLocationsCustomFilter() {
		const viewModel = this
		return function (query,term) {
			return query.filter(function (it) {
				return it.StorageAreaId === null || it.StorageAreaId == this.storageAreaId;
				}, {storageAreaId: viewModel.storageArea().Id()});
		}
	}

	async save(): Promise<void> {
		try {
			this.loading(true);
			if (this.errors().length > 0) {
				this.loading(false);
				this.errors.showAllMessages();
				this.errors.scrollToError();
				return;
			}
			this.storageArea().Locations().forEach((location) => {
				if (this.selectedLocationIds.indexOf(location.Id()) == -1) {
					location.StorageAreaId(null)
				}
			})
			const locationIds = this.storageArea().Locations().map(location => location.Id())
			for (const locationId of this.selectedLocationIds()) {
				if (locationIds.indexOf(locationId) == -1) {
					const location = await window.database.CrmArticle_Location.find(locationId);
					location.StorageAreaId = this.storageArea().Id()
					window.database.attachOrGet(location)
				}
			}
			await window.database.saveChanges();
			$(".modal:visible").modal("hide");
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}

}
namespace("Crm.Article.ViewModels").StorageAreaEditModalViewModel = StorageAreaEditModalViewModel;


import { namespace } from "@Main/namespace";
import type {StoreDetailsViewModel} from "./StoreDetailsViewModel";

export class LocationEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	loading = ko.observable<boolean>(true);
	location = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Location>(null);
	store = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Store>(null);
	errors = ko.validation.group(this.location, { deep: true });

	constructor(parentViewModel: StoreDetailsViewModel) {
		super();
		this.store(parentViewModel.store());
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		let targetLocation: Crm.Article.Rest.Model.CrmArticle_Location;
		if (id) {
			targetLocation = await window.database.CrmArticle_Location.find(id);
			window.database.attachOrGet(targetLocation);
		} else {
			targetLocation = window.database.CrmArticle_Location.defaultType.create();
			targetLocation.StoreId = this.store().Id();
			window.database.add(targetLocation);
		}
		this.location(targetLocation.asKoObservable());
	}

	storageAreaFilter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_StorageArea>, term: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_StorageArea> {
		query = query.filter('it.StoreId == this.storeId', { storeId: this.store().Id() });
		if (term) {
			query = query.filter('it.StorageAreaNo.contains(this.term)', { term: term });
		}
		return query;
	};

	cancel(): void {
		window.database.detach(this.location().innerInstance);
		$(".modal:visible").modal("hide");
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
			await window.database.saveChanges();
			$(".modal:visible").modal("hide");
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}

}
namespace("Crm.Article.ViewModels").LocationEditModalViewModel = LocationEditModalViewModel;


import { namespace } from "@Main/namespace";
import type {StoreDetailsViewModel} from "./StoreDetailsViewModel";

export class StoreDetailsStorageAreasTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Store, Crm.Article.Rest.Model.ObservableCrmArticle_Store> {

	store = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Store>(null);

	constructor(parentViewModel: StoreDetailsViewModel) {
		super("CrmArticle_StorageArea", ["StorageAreaNo"], ["ASC"], ["Locations"]);
		this.store(parentViewModel.store());
		this.getFilter("StoreId").extend({ filterOperator: "===" })(this.store().Id());
		this.infiniteScroll(true);
	}

	async init(): Promise<void> {
		await super.init();
	}

}
namespace("Crm.Article.ViewModels").StoreDetailsStorageAreasTabViewModel = StoreDetailsStorageAreasTabViewModel;


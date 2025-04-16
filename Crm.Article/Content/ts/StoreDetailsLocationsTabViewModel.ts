import { namespace } from "@Main/namespace";
import type {StoreDetailsViewModel} from "./StoreDetailsViewModel";

export class StoreDetailsLocationsTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Location, Crm.Article.Rest.Model.ObservableCrmArticle_Location> {

	store = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Store>(null);

	constructor(parentViewModel: StoreDetailsViewModel) {
		super("CrmArticle_Location", ["LocationNo"], ["ASC"], ["StorageArea"]);
		this.store(parentViewModel.store());
		this.getFilter("StoreId").extend({ filterOperator: "===" })(this.store().Id());
		this.infiniteScroll(true);
	}

	async init(): Promise<void> {
		await super.init();
	}

}
namespace("Crm.Article.ViewModels").StoreDetailsLocationsTabViewModel = StoreDetailsLocationsTabViewModel;


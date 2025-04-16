import {namespace} from "@Main/namespace";
import type {ArticleDetailsViewModel} from "./ArticleDetailsViewModel";

export class ArticleDetailsStockTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Stock, Crm.Article.Rest.Model.ObservableCrmArticle_Stock> {

	loading: KnockoutObservable<boolean> = ko.observable<boolean>(true);
	article: KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_Article> = ko.observable(null);


	constructor(parentViewModel : ArticleDetailsViewModel) {
		super("CrmArticle_Stock", ["Store.StoreNo"], ["ASC"], ["Store", "StorageArea", "Location"]);
		this.article = parentViewModel.article;
		this.infiniteScroll(true);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		this.loading(true);
		await super.init(id, params);
	}

	applyFilters(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Stock>) {
		query = query.filter("it.ArticleKey === this.articleKey", { articleKey: this.article().Id() });
		query = super.applyFilters(query);
		return query;
	}
}
namespace("Crm.Article.ViewModels").ArticleDetailsStockTabViewModel = ArticleDetailsStockTabViewModel;


import type {ArticleDetailsViewModel} from "./ArticleDetailsViewModel";
import {namespace} from "@Main/namespace";

export class ArticleDetailsQuantityUnitsTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry, Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry> {
	article : KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_Article>
	constructor(parentViewModel: ArticleDetailsViewModel) {
		super("CrmArticle_QuantityUnitEntry", "QuantityUnitKey", "ASC")
		this.article = parentViewModel.article;
	}

	applyFilters(query: $data.Queryable<any>): $data.Queryable<any> {
		query = query.filter("QuantityUnitGroupKey", "===", this.article().QuantityUnitEntryKey())
		return super.applyFilters(query);
	}
}

namespace("Crm.Article.ViewModels").ArticleDetailsQuantityUnitsTabViewModel = ArticleDetailsQuantityUnitsTabViewModel;

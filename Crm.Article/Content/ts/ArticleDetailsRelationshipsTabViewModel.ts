import {namespace} from "@Main/namespace";
import {HelperLookup} from "@Main/helper/Helper.Lookup";
import type {ArticleDetailsViewModel} from "./ArticleDetailsViewModel";
import type {ArticleRelationshipListViewModel} from "./ArticleRelationshipListViewModel";
import type {ArticleCompanyRelationshipListViewModel} from "./ArticleCompanyRelationshipListViewModel";

export class ArticleDetailsRelationshipsTabViewModel extends window.Crm.ViewModels.BaseRelationshipsTabViewModel {
	genericArticleRelationships: ArticleRelationshipListViewModel;
	articleRelationships = ko.observableArray<Crm.Article.Rest.Model.ObservableCrmArticle_ArticleRelationship>([]);
	genericArticleCompanyRelationships: ArticleCompanyRelationshipListViewModel;
	articleCompanyRelationships = ko.observableArray<Crm.Article.Rest.Model.ObservableCrmArticle_ArticleCompanyRelationship>([]);
	articleId: string;
	lookups: LookupType = {
		regions: {$tableName: "Main_Region"},
		companyTypes: {$tableName: "Crm_CompanyType"},
		countries: {$tableName: "Main_Country"},
		articleCompanyRelationshipTypes: {$tableName: "CrmArticle_ArticleCompanyRelationshipType"}
	};

	constructor(parentViewModel: ArticleDetailsViewModel) {
		super(parentViewModel);
		this.articleId = parentViewModel.article().Id();

		this.genericArticleRelationships = new window.Crm.Article.ViewModels.ArticleRelationshipListViewModel(parentViewModel);
		this.articleRelationships = this.genericArticleRelationships.items;
		this.subViewModels.push(this.genericArticleRelationships);

		this.genericArticleCompanyRelationships = new window.Crm.Article.ViewModels.ArticleCompanyRelationshipListViewModel(this.articleId);
		this.articleCompanyRelationships = this.genericArticleCompanyRelationships.items;
		window.Helper.Distinct.createIndex(this.articleCompanyRelationships, "RelationshipTypeKey");
		this.subViewModels.push(this.genericArticleCompanyRelationships);
	}

	async init(): Promise<void> {
		this.loading(true);
		await super.init();
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
	}
	async getInverseRelationship(): Promise<void> {
		return;
	}
}

namespace("Crm.Article.ViewModels").ArticleDetailsRelationshipsTabViewModel = ArticleDetailsRelationshipsTabViewModel;

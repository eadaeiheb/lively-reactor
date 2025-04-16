import type {GenericListViewModel} from "@Main/GenericListViewModel";
import type {CompanyDetailsViewModel} from "@Crm/CompanyDetailsViewModel";
import {Mixin} from "ts-mixer";

export class CompanyDetailsRelationshipsTabViewModelExtension extends window.Crm.ViewModels.CompanyDetailsRelationshipsTabViewModel {

	genericArticleCompanyRelationships: GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_ArticleCompanyRelationship, Crm.Article.Rest.Model.ObservableCrmArticle_ArticleCompanyRelationship>;
	articleCompanyRelationships: KnockoutObservableArray<Crm.Article.Rest.Model.ObservableCrmArticle_ArticleCompanyRelationship>;

	constructor(parentViewModel: CompanyDetailsViewModel) {
		super(parentViewModel)
		this.lookups.articleCompanyRelationshipTypes = {$tableName: "CrmArticle_ArticleCompanyRelationshipType"};
		this.lookups.articleGroups01 = {$tableName: "CrmArticle_ArticleGroup01"};
		this.lookups.articleGroups02 = {$tableName: "CrmArticle_ArticleGroup02"};
		this.lookups.articleGroups03 = {$tableName: "CrmArticle_ArticleGroup03"};
		this.lookups.articleGroups04 = {$tableName: "CrmArticle_ArticleGroup04"};
		this.lookups.articleGroups05 = {$tableName: "CrmArticle_ArticleGroup05"};
		this.lookups.articleTypes = {$tableName: "CrmArticle_ArticleType"};
		const documentAttributes = {
			Selector: "Parent.DocumentAttributes",
			Operation: "filter(function(x) { x.UseForThumbnail === null || x.UseForThumbnail === true })"
		}
		this.genericArticleCompanyRelationships = new window.Main.ViewModels.GenericListViewModel(
			"CrmArticle_ArticleCompanyRelationship",
			["RelationshipTypeKey"],
			["ASC"],
			["Parent", "Parent.Tags", documentAttributes, "Parent.DocumentAttributes.FileResource", "Parent.ProductFamily"]
		);
		this.genericArticleCompanyRelationships.getFilter("ChildId").extend({filterOperator: "==="})(this.companyId);
		this.articleCompanyRelationships = this.genericArticleCompanyRelationships.items;
		window.Helper.Distinct.createIndex(this.articleCompanyRelationships, "RelationshipTypeKey");
		this.genericArticleCompanyRelationships.pageSize(5);
		this.subViewModels.push(this.genericArticleCompanyRelationships);
	}
}

window.Crm.ViewModels.CompanyDetailsRelationshipsTabViewModel = Mixin(CompanyDetailsRelationshipsTabViewModelExtension);

import {namespace} from "@Main/namespace";

export class ArticleCompanyRelationshipListViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_ArticleCompanyRelationship, Crm.Article.Rest.Model.ObservableCrmArticle_ArticleCompanyRelationship> {

	constructor(articleId: string) {
		super("CrmArticle_ArticleCompanyRelationship"
			, ["RelationshipTypeKey", "Child.Name"], ["ASC", "ASC"]
			, ["Child", {
				Selector: "Child.Addresses",
				Operation: "filter(function (a) {return a.IsCompanyStandardAddress == true;})"
			}, "Child.ResponsibleUserUser", "Child.Tags", "Child.ParentCompany"]);
		this.getFilter("ParentId").extend({filterOperator: "==="})(articleId);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
	}
}

namespace("Crm.Article.ViewModels").ArticleCompanyRelationshipListViewModel = ArticleCompanyRelationshipListViewModel;

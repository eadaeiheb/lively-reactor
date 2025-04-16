import {namespace} from "@Main/namespace";
import {HelperString} from "@Main/helper/Helper.String";

export class ArticleRelationshipListViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_ArticleRelationship, Crm.Article.Rest.Model.ObservableCrmArticle_ArticleRelationship> {

	args: any;

	constructor(args: any) {
		super("CrmArticle_ArticleRelationship", ["RelationshipTypeKey", "CreateDate"], ["DESC", "DESC"], ["Parent", "Parent.DocumentAttributes.FileResource", "Parent.Tags", "Child", "Child.Tags", "Child.DocumentAttributes.FileResource"]);
		this.args = args;
	}

	deleteRelationship = window.Crm.ViewModels.BaseRelationshipsTabViewModel.prototype.deleteRelationship;

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
	}

	applyFilters(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ArticleRelationship>): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ArticleRelationship> {
		return super.applyFilters(query).filter("it.ParentId === this.id || it.ChildId === this.id", {id: this.args.article().Id()});
	}

	getItemGroup(item: Crm.Article.Rest.Model.ObservableCrmArticle_ArticleRelationship): ItemGroup {
		if (item.ParentId() !== this.args.article().Id() && item.ChildId() === this.args.article().Id()) {
			if (item.RelationshipTypeKey() === "VariableValue") {
				return {title: HelperString.getTranslatedString("VariableValue")};
			} else if (item.RelationshipTypeKey() === "Accessory") {
				return {title: HelperString.getTranslatedString("AccessoryOf")};
			}
			return {title: ""};
		} else {
			const value = this.args.lookups.articleRelationshipTypes[`${item.RelationshipTypeKey()}`].Value;
			return {title: value};
		}
	}

	async getInverseRelationship(): Promise<void> {
		return;
	}

}

namespace("Crm.Article.ViewModels").ArticleRelationshipListViewModel = ArticleRelationshipListViewModel;

import {namespace} from "@Main/namespace";
import type {ArticleDetailsViewModel} from "./ArticleDetailsViewModel";
import {HelperArticle} from "./helper/Helper.Article";
import {HelperCompany} from "@Crm/helper/Helper.Company";
import type {CompanyDetailsViewModel} from "@Crm/CompanyDetailsViewModel";

export class ArticleCompanyRelationshipEditModalViewModel extends window.Crm.ViewModels.BaseRelationshipEditModalViewModel {

	mode: string;
	contactType: string;

	constructor(parentViewModel: CompanyDetailsViewModel | ArticleDetailsViewModel) {
		super(parentViewModel);
		this.lookups.languages = {
			$tableName: "Main_Language",
			$filterExpression: "it.IsSystemLanguage === true",
			$array: undefined
		};
		this.lookups.articleGroups01 = {$tableName: "CrmArticle_ArticleGroup01"};
		this.lookups.articleGroups02 = {$tableName: "CrmArticle_ArticleGroup02"};
		this.lookups.articleGroups03 = {$tableName: "CrmArticle_ArticleGroup03"};
		this.lookups.articleGroups04 = {$tableName: "CrmArticle_ArticleGroup04"};
		this.lookups.articleGroups05 = {$tableName: "CrmArticle_ArticleGroup05"};
		this.lookups.articleTypes = {$tableName: "CrmArticle_ArticleType"};
		this.lookups.currencies = {$tableName: "Main_Currency"};
		this.lookups.articleRelationshipTypes = {$tableName: "CrmArticle_ArticleRelationshipType"};
		this.lookups.quantityUnit = {$tableName: "CrmArticle_QuantityUnit"};
		this.lookups.vatLevel = {$tableName: "CrmArticle_VATLevel"};
		this.lookups.regions = {$tableName: "Main_Region"};
		this.lookups.companyTypes = {$tableName: "Crm_CompanyType"};
		this.lookups.countries = {$tableName: "Main_Country"};
		this.lookups.articleCompanyRelationshipTypes = {$tableName: "CrmArticle_ArticleCompanyRelationshipType"};
		this.relationshipTypeLookup = this.lookups.articleCompanyRelationshipTypes;
		this.table = window.database.CrmArticle_ArticleCompanyRelationship;
		this.setMode(parentViewModel);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		this.contactType = params.contactType || "";
		this.showCustomPersonSelector(true);
		await super.init(id, params);
	}

	setMode(parentViewModel: CompanyDetailsViewModel | ArticleDetailsViewModel): void {
		if (parentViewModel instanceof window.Crm.ViewModels.CompanyDetailsViewModel) {
			this.mode = "company";
		} else if (parentViewModel instanceof window.Crm.Article.ViewModels.ArticleDetailsViewModel) {
			this.mode = "article";
		}
	};

	getQueryForEditing(): $data.EntitySet<typeof Crm.Article.Rest.Model.CrmArticle_ArticleCompanyRelationship, Crm.Article.Rest.Model.CrmArticle_ArticleCompanyRelationship> {
		return window.database.CrmArticle_ArticleCompanyRelationship
	};

	getEditableId(relationship: Crm.Article.Rest.Model.ObservableCrmArticle_ArticleCompanyRelationship): KnockoutObservable<string> {
		switch (this.mode) {
			case "company":
				return relationship.ParentId;
			case "article":
				return relationship.ChildId;
		}
		return super.getEditableId(relationship);
	};

	getAutoCompleterOptions(): Select2AutoCompleterOptions {
		switch (this.mode) {
			case "company":
				return {
					key: "Id",
					table: 'CrmArticle_Article',
					orderBy: ['Name'],
					mapDisplayObject: HelperArticle.mapArticleForSelect2Display
				}
			case "article":
				return {
					key: "Id",
					table: "Crm_Company",
					orderBy: ["Name"],
					mapDisplayObject: HelperCompany.mapForSelect2Display,
					customFilter: HelperCompany.getSelect2Filter
				};

		}

		return super.getAutoCompleterOptions();
	};

	getAutoCompleterCaption(): string {
		switch (this.mode) {
			case "company":
				return "Article";
			case "article":
				return "Company";
		}
		return super.getAutoCompleterCaption();
	};

	createNewEntity(): Crm.Article.Rest.Model.CrmArticle_ArticleCompanyRelationship {
		let relationship = super.createNewEntity();
		switch (this.mode) {
			case "article":
				relationship.ParentId = this.contactId();
				break;
			case "company":
				relationship.ParentId = null;
				relationship.ChildId = this.contactId();
				break;
			default:
				break;
		}
		return relationship;
	};

}

namespace("Crm.Article.ViewModels").ArticleCompanyRelationshipEditModalViewModel = ArticleCompanyRelationshipEditModalViewModel;

import {HelperLookup} from "@Main/helper/Helper.Lookup";
import {namespace} from "@Main/namespace";
import {HelperArticle} from "./helper/Helper.Article";
import {HelperString} from "@Main/helper/Helper.String";

export class ArticleRelationshipEditModalViewModel extends window.Crm.ViewModels.BaseRelationshipEditModalViewModel {

	lookups: LookupType = {
		articleRelationshipTypes: {$tableName: "CrmArticle_ArticleRelationshipType"}
	};
	table = window.database.CrmArticle_ArticleRelationship;
	relationshipTypeLookup = this.lookups.articleRelationshipTypes;
	articleType: string;
	currentUser = ko.observable<Main.Rest.Model.ObservableMain_User>(null);

	constructor(args) {
		super(args);
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		const currentUser = await window.Helper.User.getCurrentUser()
		this.currentUser(currentUser.asKoObservable());
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
		if (params.articleType) {
			this.articleType = params.articleType;
		}
	};

	getAutoCompleterCaption(): string {
		return "Article";
	};

	getAutoCompleterOptions(): Select2AutoCompleterOptions {
		return {
			table: "CrmArticle_Article",
			mapDisplayObject: HelperArticle.mapArticleForSelect2Display,
			key: "Id"
		};
	};

	getAutocompleteOptionsRelationshipType(): Select2AutoCompleterOptions {
		return {
			customFilter: query => {
				if (this.articleType !== "Variable") {
					return query.filter("it.Key !== this.key && it.Language === this.language",
						{key: "VariableValue", language: this.currentUser().DefaultLanguageKey()});
				}
				return query.filter("it.Language === this.language", {language: this.currentUser().DefaultLanguageKey()});
			},
			table: "CrmArticle_ArticleRelationshipType",
			mapDisplayObject: HelperLookup.mapLookupForSelect2Display,
			getElementByIdQuery: HelperLookup.getLookupByKeyQuery
		};
	}

	getQueryForEditing(): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ArticleRelationship> {
		return window.database.CrmArticle_ArticleRelationship.include("Child");
	};

	getEditableId(relationship: Crm.Article.Rest.Model.ObservableCrmArticle_ArticleRelationship): KnockoutObservable<string> {
		return relationship.ChildId;
	};

	async save(): Promise<void> {
		const key = this.relationship().RelationshipTypeKey();
		const hasQuantity = this.lookups.articleRelationshipTypes[key].HasQuantity;

		try {
			this.loading(true)
			if (hasQuantity) {
				const article = await window.database.CrmArticle_Article.include("QuantityUnitEntry").find(this.relationship().ChildId());
				const quantityUnit = article.QuantityUnitEntry.QuantityUnitKey == null ? "" : article.QuantityUnitEntry.QuantityUnitKey;
				this.relationship().QuantityValue(1);
				this.relationship().QuantityUnitKey(quantityUnit);
			} else {
				this.relationship().QuantityValue(0);
			}
			await super.save();
			this.loading(false);

		} catch (e) {
			this.loading(false);
			window.swal(HelperString.getTranslatedString("Error"), (e as Error).message, "error");
		}

	}
}

namespace("Crm.Article.ViewModels").ArticleRelationshipEditModalViewModel = ArticleRelationshipEditModalViewModel;

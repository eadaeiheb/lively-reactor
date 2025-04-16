import {namespace} from "@Main/namespace";
import {HelperString} from "@Main/helper/Helper.String";
import {HelperDatabase} from "@Main/helper/Helper.Database";
import {HelperArticle} from "./helper/Helper.Article";
import {HelperLookup} from "@Main/helper/Helper.Lookup";
import {HelperConfirm} from "@Main/helper/Helper.Confirm";

export class ArticleListIndexViewModel extends window.Crm.ViewModels.ContactListViewModel<Crm.Article.Rest.Model.CrmArticle_Article, Crm.Article.Rest.Model.ObservableCrmArticle_Article> {

	lookups: LookupType = {
		articleGroups01: {$tableName: "CrmArticle_ArticleGroup01"},
		articleGroups02: {$tableName: "CrmArticle_ArticleGroup02"},
		articleGroups03: {$tableName: "CrmArticle_ArticleGroup03"},
		articleGroups04: {$tableName: "CrmArticle_ArticleGroup04"},
		articleGroups05: {$tableName: "CrmArticle_ArticleGroup05"},
		articleTypes: {$tableName: "CrmArticle_ArticleType"},
		currencies: {$tableName: "Main_Currency"},
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
	};
	filterByType= ko.observable<boolean>(false);
	imageIndex: KnockoutObservable<number> = ko.observable<number>(0);

	constructor() {
		const documentAttributes = {
			Selector: "DocumentAttributes",
			Operation: "filter(function(x) { x.UseForDisplay })"
		}

		super("CrmArticle_Article", "ItemNo", "ASC", ["Tags", documentAttributes, "DocumentAttributes.FileResource", "ProductFamily", "QuantityUnitEntry", "Stocks"]);

		this.viewModes.push({
			Key: "Thumbnails",
			Value: HelperString.getTranslatedString("Thumbnails")
		});
		this.pageSize(24);
	}

	applyFilter(query: $data.Queryable<any>, filterValue: any, filterName?: string): $data.Queryable<any> {
		if (filterName === "Description") {
			return HelperArticle.getArticleAutocompleteFilter(query, filterValue.Value, this.currentUser().DefaultLanguageKey);
		}
		return super.applyFilter(query, filterValue, filterName);
	}

	applyFilters(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article>): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article> {
		query = super.applyFilters(query);
		if (this.filterByType()) {
			query = query.filter(function (it) {
				return it.ArticleTypeKey in ["Vehicle", "Tool"];
			});
		}
		return query;
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<any> {
		if (params?.filterByType === "VehicleAndTool") {
			this.filterByType(true);
		}
		await super.init(id, params);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
	};

	async initItems(items: Crm.Article.Rest.Model.ObservableCrmArticle_Article[]): Promise<Crm.Article.Rest.Model.ObservableCrmArticle_Article[]> {
		await super.initItems(items);
		await HelperArticle.loadArticleDescriptions(items, this.currentUser().DefaultLanguageKey);
		return items;
	};

	async deleteArticle(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): Promise<void> {
		if (await HelperConfirm.confirmDeleteAsync()) {
			this.loading(true);
			try {
				await window.database.CrmArticle_ArticleDescription
					.filter(function (it) {
						return it.Key === this.Key;
					}, {Key: article.ItemNo()})
					.forEach(articleDescription => window.database.remove(articleDescription));
				const entity = HelperDatabase.getDatabaseEntity(article);
				window.database.remove(entity);
				await window.database.saveChanges();
			} catch (e) {
				this.loading(false);
				let errorMessage;
				if (typeof e === "string") {
					errorMessage = e.toUpperCase();
				} else if (e instanceof Error) {
					errorMessage = window.Helper.String.tryExtractErrorMessageValue(e.message) ?? e.message;
				}
				swal(HelperString.getTranslatedString("Error"), errorMessage, "error");
			}
		}
	};

	getDocumentAttributeCount(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): number {
		return window._.size(article.DocumentAttributes());
	}

	getDocumentAttributeByCurrentIndex(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): Crm.Rest.Model.ObservableCrm_DocumentAttribute {
		const adjustedIndex = Math.abs(this.imageIndex()) % this.getDocumentAttributeCount(article);
		return window._.orderBy(article.DocumentAttributes(), x => x.UseForThumbnail()).reverse()[adjustedIndex];
	}

	stepImageLeft(): void {
		this.imageIndex(this.imageIndex() - 1);
	};

	stepImageRight(): void {
		this.imageIndex(this.imageIndex() + 1);
	};

	keyDown(keyCode: number): void {
		switch (keyCode) {
			case 37:
				this.stepImageLeft();
				break;
			case 39:
				this.stepImageRight();
				break;
		}
	};

	CrmArticle_ArticleTypeCustomFilter(lookupName: string | $data.EntitySet<any, any> | $data.Queryable<any>, key: string = null, filterExpression: string = null, filterParameters: {} = null): $data.Queryable<any> {
		let viewModel = this;
		if (viewModel.filterByType()) {
			return HelperLookup.queryLookup(lookupName, key, "it.Key in this.keys", { keys: ["Vehicle", "Tool"] })
		}
		return HelperLookup.queryLookup(lookupName, key, filterExpression, filterParameters);
	};
}

namespace("Crm.Article.ViewModels").ArticleListIndexViewModel = ArticleListIndexViewModel;

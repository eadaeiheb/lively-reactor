import type {ArticleDetailsViewModel} from "./ArticleDetailsViewModel";
import {namespace} from "@Main/namespace";

export class ArticleDetailsPricesTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Price, Crm.Article.Rest.Model.ObservableCrmArticle_Price> {

	article: KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_Article>

	constructor(parentVm: ArticleDetailsViewModel) {
		super("CrmArticle_Price", ["CompanyKey", "CompanyPriceLevelKey", "CompanyPriceGroupKey", "MinQuantity"], ["ASC"], ["Company", "QuantityUnitEntry"]);
		this.article = parentVm.article
		this.lookups = {
			currencies: { $tableName: "Main_Currency" },
			companyTypes: { $tableName: "Crm_CompanyType" },
			quantityUnits: { $tableName: "CrmArticle_QuantityUnit" },
			companyPriceGroups: { $tableName: "CrmArticle_CompanyPriceGroup" },
			companyPriceLevels: { $tableName: "CrmArticle_CompanyPriceLevel" },
		};


		const allBookmark = {
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("AllPrices"),
			Key: "AllPrices",
			Expression: function (query) {
				return query;
			}
		};
		this.bookmarks.push(allBookmark);
		this.bookmark(allBookmark);
		this.bookmarks.push({
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("CompanyPrices"),
			Key: "CompanyPrices",
			Expression: function (query) {
				return query.filter("it.CompanyKey !== null");
			}
		});
		this.bookmarks.push({
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("PriceLevelPrices"),
			Key: "PriceLevel",
			Expression: function (query) {
				return query.filter("it.CompanyPriceLevelKey !== null");
			}
		});
		this.bookmarks.push({
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("PriceGroupPrices"),
			Key: "PriceGroup",
			Expression: function (query) {
				return query.filter("it.CompanyPriceGroupKey !== null");
			}
		});

	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);

	}

	applyFilters(query: $data.Queryable<any>): $data.Queryable<any> {
		query = super.applyFilters(query);
		return query.filter(function (x) {
			return x.ArticleKey == this.articleKey
		}, {
			articleKey: this.article().Id(),
		})

	};

	getAvatarAbbreviation(price: Crm.Article.Rest.Model.ObservableCrmArticle_Price) {
		if (price.CompanyKey())
		{ // @ts-ignore
			return window.Helper.Company.getTypeAbbreviation(price.Company, this.lookups.companyTypes)
		}
		if (price.CompanyPriceLevelKey())
			return this.lookups.companyPriceLevels[price.CompanyPriceLevelKey()]?.Value[0]
		if (price.CompanyPriceGroupKey())
			return this.lookups.companyPriceGroups[price.CompanyPriceGroupKey()]?.Value[0]
	}

}
namespace("Crm.Article.ViewModels").ArticleDetailsPricesTabViewModel = ArticleDetailsPricesTabViewModel;

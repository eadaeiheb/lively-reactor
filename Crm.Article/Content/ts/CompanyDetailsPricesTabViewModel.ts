import type {CompanyDetailsViewModel} from "@Crm/CompanyDetailsViewModel";
import {namespace} from "@Main/namespace";


export class CompanyDetailsPricesTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Price, Crm.Article.Rest.Model.ObservableCrmArticle_Price> {

	company: KnockoutObservable<Crm.Rest.Model.ObservableCrm_Company>

	constructor(parentVm: CompanyDetailsViewModel) {
		super("CrmArticle_Price", ["Article.ItemNo", "MinQuantity"], ["ASC", "ASC"], ["Article", CompanyDetailsPricesTabViewModel.getDocumentAttributeJoin(), "Article.DocumentAttributes.FileResource", "QuantityUnitEntry"]);
		this.company = parentVm.company
		this.lookups = {
			visitAims: { $tableName: "CrmVisitReport_VisitAim" },
			addressTypes: { $tableName: "Main_AddressType" },
			articleTypes: { $tableName: "CrmArticle_ArticleType" },
			currencies: { $tableName: "Main_Currency" },
			quantityUnits: { $tableName: "CrmArticle_QuantityUnit" },
			companyPriceGroups: { $tableName: "CrmArticle_CompanyPriceGroup" },
			companyPriceLevels: { $tableName: "CrmArticle_CompanyPriceLevel" },
			countries: { $tableName: "Main_Country" }
		};


		const companyBookmark = {
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("CompanyPrices"),
			Key: "CompanyPrices",
			Expression: function (query) {
				return query.filter("it.CompanyKey !== null");
			}
		};
		this.bookmarks.push(companyBookmark);
		this.bookmark(companyBookmark);
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
		this.bookmarks.push({
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("AllPrices"),
			Key: "AllPrices",
			Expression: function (query) {
				return query;
			}
		});

	}

	static getDocumentAttributeJoin() {
		return{
			Selector: "Article.DocumentAttributes",
			Operation: "filter(function(x) { x.UseForDisplay })"
		}
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);

	}

	applyFilters(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Price>): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Price> {
		query = super.applyFilters(query);
		return window.Crm.Article.ViewModels.PriceSelectorViewModel.filterByCustomer(query, this.company)

	};

}
namespace("Crm.ViewModels").CompanyDetailsPricesTabViewModel = CompanyDetailsPricesTabViewModel;

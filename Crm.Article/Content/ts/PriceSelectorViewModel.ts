import _ from "lodash";
import {namespace} from "@Main/namespace";

export class PriceSelectorViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_Price, Crm.Article.Rest.Model.ObservableCrmArticle_Price> {
	private companyId: KnockoutObservable<string>;
	private company: KnockoutObservable<Crm.Rest.Model.ObservableCrm_Company> = ko.observable();
	private articleId: KnockoutObservable<string>;
	private quantityUnitEntry: KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry>;
	private quantity: KnockoutObservable<Edm.Decimal>;
	private nextQuantity: KnockoutObservable<Edm.Decimal>;
	private updateNextDummyObservable: KnockoutObservable<Boolean> = ko.observable()
	private setPrice: (value: number) => void;
	private selectedPrice = null
	private allPrices = []

	show: KnockoutObservable<boolean> = ko.observable(false)
	constructor(articleId: KnockoutObservable<string>, companyId: KnockoutObservable<string>, quantityUnitEntry: KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry>, quantity: KnockoutObservable<Edm.Decimal>, setPrice: (value: number) => void) {
		super("CrmArticle_Price", "MinQuantity", "ASC", ["QuantityUnitEntry", "Company", "Article", "Article.QuantityUnitEntry"]);
		this.lookups = {
			currencies: { $tableName: "Main_Currency" },
			companyTypes: { $tableName: "Crm_CompanyType" },
			quantityUnits: { $tableName: "CrmArticle_QuantityUnit" },
			companyPriceGroups: { $tableName: "CrmArticle_CompanyPriceGroup" },
			companyPriceLevels: { $tableName: "CrmArticle_CompanyPriceLevel" },
		};
		this.articleId = articleId;
		this.companyId = companyId
		this.quantityUnitEntry = quantityUnitEntry
		this.quantity = quantity
		this.setPrice = setPrice

		quantity.subscribe(() => this.updatePrices())
		articleId.subscribe(() => {
			this.search(false, true, true)
			this.selectedPrice = null
		})
		companyId.subscribe(async (value) => {
			this.loading(true)
			this.selectedPrice = null
			if (value != null)
				this.company((await window.database.Crm_Company.find(value)).asKoObservable())
			else
				this.company(null)
			this.search(false, true, true)
		})
		this.nextQuantity = ko.pureComputed(() => {
			this.updateNextDummyObservable()
			let prices = this.sortPricesForNextQuantity(this.allPrices)
			prices = prices.filter(price => {
				if (this.selectedPrice === null || this.selectedPrice === undefined)
					return true

				let conversionRate: number
				if (this.quantityUnitEntry() !== null && this.quantityUnitEntry() !== undefined)
					conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, this.quantityUnitEntry)
				else
					conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, price.Article().QuantityUnitEntry)
				return this.getConvertedPrice(price, this.quantityUnitEntry) < this.getConvertedPrice(this.selectedPrice, this.quantityUnitEntry) &&
					price.MinQuantity() * conversionRate > this.quantity()
			})
			if (prices.length == 0)
				return null

			let conversionRate: number
			if (this.quantityUnitEntry() !== null && this.quantityUnitEntry() !== undefined)
				conversionRate = Helper.QuantityUnit.getConversionRate(prices[0].QuantityUnitEntry, this.quantityUnitEntry)
			else
				conversionRate = Helper.QuantityUnit.getConversionRate(prices[0].QuantityUnitEntry, prices[0].Article().QuantityUnitEntry)
			return conversionRate * prices[0].MinQuantity()
		});
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
	}

	applyFilters(query: $data.Queryable<any>): $data.Queryable<any> {
		query = super.applyFilters(query);
		query =  query.filter(function (x) {
			return x.ArticleKey == this.articleKey
		}, {
			articleKey: this.articleId() == undefined ? null : this.articleId(),
		})
		if (this.company() != null)
			query = PriceSelectorViewModel.filterByCustomer(query, this.company)
		return query

	};
	static filterByCustomer(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Price>, company: Crm.Rest.Model.ObservableCrm_Company | KnockoutObservable<Crm.Rest.Model.ObservableCrm_Company>) : $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Price> {
		company = ko.unwrap(company)
		return query.filter(function (x) {
			return x.CompanyKey == this.companyKey ||
				(this.companyPriceGroupKey != null && x.CompanyPriceGroupKey == this.companyPriceGroupKey) ||
				(this.companyPriceLevelKey != null && x.CompanyPriceLevelKey == this.companyPriceLevelKey)
		}, {
			companyKey: company.Id(),
			companyPriceGroupKey: company.ExtensionValues().CompanyPriceGroupKey(),
			companyPriceLevelKey: company.ExtensionValues().CompanyPriceLevelKey(),
		})
	}
	async initItems(items: Crm.Article.Rest.Model.ObservableCrmArticle_Price[]): Promise<Crm.Article.Rest.Model.ObservableCrmArticle_Price[]> {
		items.forEach(price => {
			// @ts-ignore
			price.convertedPrice = ko.pureComputed(() => {
				return this.getConvertedPrice(price, this.quantityUnitEntry)
			});
			// @ts-ignore
			price.convertedMinQuantity = ko.pureComputed(() => {
				let conversionRate: number
				if (this.quantityUnitEntry() !== null && this.quantityUnitEntry() !== undefined)
					conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, this.quantityUnitEntry)
				else
					conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, price.Article().QuantityUnitEntry)
				return price.MinQuantity() * conversionRate
			})
		});
		this.allPrices = items
		return items
	}

	updatePrices() {
		this.selectCorrectPrices()
		const sortedPrices = this.sortPrices(this.items())
		if (sortedPrices.length != 0) {
			this.selectPrice(sortedPrices[0])
			this.selectedPrice = sortedPrices[0]
		}
		this.updateNextDummyObservable.notifySubscribers()
	}

	selectCorrectPrices() {
		let prices = this.allPrices.filter(item => {
			// @ts-ignore
			return item.convertedMinQuantity() <= this.quantity()
		})
		prices = this.sortPrices(prices)
		this.items(prices)
	}

	sortPrices(prices) {
		return _.orderBy(prices,[(price) => price.CompanyKey(), (price) => price.convertedPrice()], ["asc", "asc"])
	}

	sortPricesForNextQuantity(prices) {
		return _.orderBy(prices,[(price) => price.CompanyKey(), (price) => price.convertedMinQuantity()], ["asc", "asc"])
	}

	async search(scrollToTop: boolean, resetTotalCount?: any, setLoading?: boolean): Promise<void> {
		await super.search(scrollToTop, resetTotalCount, setLoading)
		this.updatePrices()
	}

	getConvertedPrice(price: Crm.Article.Rest.Model.ObservableCrmArticle_Price, quantityUnitEntry) {
		let conversionRate: number
		if (quantityUnitEntry() !== null && quantityUnitEntry() !== undefined)
			conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, quantityUnitEntry())
		else
			conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, price.Article().QuantityUnitEntry)

		return price.NetPricePerUnit() / conversionRate
	}

	toggleShow() {
		this.show(!this.show())
	}

	hide() {
		this.show(false)
	}

	selectPrice(price:Crm.Article.Rest.Model.ObservableCrmArticle_Price) {
		this.setPrice(this.getConvertedPrice(price, this.quantityUnitEntry))
	}
}

namespace("Crm.Article.ViewModels").PriceSelectorViewModel = PriceSelectorViewModel
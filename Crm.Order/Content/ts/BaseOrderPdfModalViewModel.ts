import {namespace} from "@Main/namespace";
import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";

export class BaseOrderPdfModalViewModel extends window.Main.ViewModels.ViewModelBase{
	parentViewModel: BaseOrderDetailsViewModel;
	address = ko.observable<Crm.Rest.Model.ObservableCrm_Address>(null);
	order: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order>;
	items: KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>;
	deliveryDates = ko.pureComputed(() => {
		return window._.uniqBy(this.items().map(function (item) { return item.DeliveryDate(); }), function (date) { return date != null ? date.toDateString() : date; });
	});
	responsibleUser = ko.observable<Main.Rest.Model.ObservableMain_User>(null);
	footerHeight = ko.observable<number>(null);
	headerHeight = ko.observable<number>(null);
	userToken = ko.observable<string>(null);
	site = ko.observable<Main.Rest.Model.Main_Site>(null);
	calculationPositions = ko.observableArray<Crm.Order.Rest.Model.CrmOrder_CalculationPosition>([]);
	lookups: LookupType = {
		currencies: { $tableName: "Main_Currency" },
		calculationPositionType: { $tableName: "CrmOrder_CalculationPositionType" },
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
		vatLevel: {},
	};
	company = ko.pureComputed<Crm.Rest.Model.ObservableCrm_Company>(() => {
		return !!this.order() && !!this.order().Company() ? this.order().Company() : null;
	});
	date = ko.pureComputed<Date>(() => {
		return !!this.order() && !!this.order().OrderDate() ? this.order().OrderDate() : new Date();
	});
	usedVATTypes = ko.pureComputed<string[]>(() => {
		const types = [];
		this.items().filter(function (it) { return it.VATLevelKey() }).forEach(function(it) {
			if(!types.some(function(type) { return type === it.VATLevelKey() })) {
				types.push(it.VATLevelKey());
			}
		});
		return types.sort();
	});
	
	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
		this.order = parentViewModel ? parentViewModel.baseOrder : ko.observable(null)
		this.items = parentViewModel ? parentViewModel.orderItems : ko.observableArray([]);
	}

	async init(): Promise<void> {
		const responsibleUser = this.order().ResponsibleUser() || (document.getElementById("meta.CurrentUser") as HTMLMetaElement).content;

		let user = await window.database.Main_User
			.find(responsibleUser);
		this.responsibleUser(user.asKoObservable());
		let calculationPositions = await window.database.CrmOrder_CalculationPosition
			.filter(function (x) { return x.BaseOrderId == this.baseOrderId; }, { baseOrderId: this.order().Id() }).toArray();
		this.calculationPositions(calculationPositions);
		if (!!this.order().ContactId()) {
			let addresses = await window.database.Crm_Address.filter(function(address) {
				return address.CompanyId == this.companyId && address.IsCompanyStandardAddress == true;
			}, { companyId: this.order().ContactId() })
				.take(1)
				.toArray();
					if (addresses.length > 0) {
						this.address(addresses[0].asKoObservable());
					}
		}
		let site = await window.database.Main_Site.GetCurrentSite().first();
		this.site(site);
		if (window.Main &&
			window.Main.Settings &&
			window.Main.Settings.Report) {
			const headerHeight = +window.Main.Settings.Report.HeaderHeight +
				+window.Main.Settings.Report.HeaderSpacing;
			this.headerHeight(headerHeight);
			const footerHeight = +window.Main.Settings.Report.FooterHeight +
				+window.Main.Settings.Report.FooterSpacing;
			this.footerHeight(footerHeight);
		}
		this.userToken((await window.Helper.User.getCurrentUser()).GeneralToken);
		for (let item of this.items()) {
			(item as any).CurrencyKey = this.order().CurrencyKey;

			if (!item.VATLevelKey() && item.Article()) {
				item.VATLevelKey(item.Article().VATLevelKey());
			}

			if (item.ArticleId()) {
				const articleWithLatestDocuments = await window.database.CrmArticle_Article
					.include2("DocumentAttributes.filter(function(x){ return x.UseForThumbnail === true; })")
					.include("DocumentAttributes.FileResource")
					.find(item.ArticleId());

				if (articleWithLatestDocuments) {
					item.Article().DocumentAttributes(articleWithLatestDocuments.DocumentAttributes.map(da => da.asKoObservable()));
				}
			}
		}
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		let lookup = await window.Helper.Lookup.getLocalizedArrayMap("CrmArticle_VATLevel");
		this.lookups.vatLevel = lookup;
	}

	getAlternatives(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[] {
		const alternatives = this.items().filter(item => item.ParentOrderItemId() === orderItem.Id()) || [];
		return alternatives.filter(x => x.IsAlternative() === true)
			.sort((a, b) => a.Price() - b.Price());
	}

	getVATCategoryTotalPrice(VAT: string): { TotalPrice: number, TotalPriceWithVAT: number, OnlyVAT: number } {
		const orderItems = this.items().filter(it => VAT === it.VATLevelKey());
		if(!orderItems) {
			return null;
		}
		let totalPrice = 0;
		let totalPriceWithVAT = 0;
		orderItems.forEach(it => {
			totalPrice += this.getCalculatedPriceWithDiscount(it)();
			totalPriceWithVAT += this.getCalculatedPriceWithVAT(it)();
		});
		return { TotalPrice: totalPrice, TotalPriceWithVAT: totalPriceWithVAT, OnlyVAT: totalPriceWithVAT - totalPrice };
	}

	getTotalPriceWithVAT(): number {
		let total = 0;
		this.items().forEach(it => { total += this.getCalculatedPriceWithVAT(it)(); });
		return total;
	}

	getCalculatedPriceWithVAT(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): KnockoutObservable<number> {
		// @ts-ignore
		orderItem.calculatedPriceWithVAT = orderItem.calculatedPriceWithVAT ||
			window.ko.pureComputed(() => {
				const VATlevel = this.lookups.vatLevel.$array.filter(function (v) {
					return v.Key === orderItem.VATLevelKey()
				})[0];
				let price = this.getCalculatedPriceWithDiscount(orderItem)();
				price *= 1 + (VATlevel.PercentageValue / 100);
				return price;
			});
		// @ts-ignore
		return orderItem.calculatedPriceWithVAT;
	}

	getCalculatedPriceWithDiscount = function (orderItem) {
		const viewModel = this;
		return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getCalculatedPriceWithDiscount.call(viewModel, orderItem);
	};

	getDiscountPercentageValue = function (orderItem) {
		const viewModel = this;
		return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getDiscountPercentageValue.call(viewModel, orderItem);
	};

	getDiscountExactValue = function (orderItem) {
		const viewModel = this;
		return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getDiscountExactValue.call(viewModel, orderItem);
	};
}

namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel = BaseOrderPdfModalViewModel;
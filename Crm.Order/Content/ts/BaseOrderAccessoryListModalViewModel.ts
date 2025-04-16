import {namespace} from "@Main/namespace";
import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";

export class BaseOrderAccessoryListModalViewModel extends window.Main.ViewModels.ViewModelBase {
	baseOrder: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order>;
	currencies: KnockoutObservableArray<Main.Rest.Model.Lookups.ObservableMain_Currency>;
	getCurrencyValue: (currencyKey: string) => string;
	loading: KnockoutObservable<boolean>;
	orderItems: KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>;

	articles = ko.observableArray<Crm.Article.Rest.Model.ObservableCrmArticle_Article>([]);
	articleFilter = ko.observable<string>("");
	articlePager = window.ko.custom.paging();
	parentOrderItem = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>(null);
	selectedArticleIds = ko.observableArray<string>([]);

	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.baseOrder = parentViewModel.baseOrder;
		this.currencies = parentViewModel.currencies;
		this.getCurrencyValue = parentViewModel.getCurrencyValue;
		this.loading = parentViewModel.loading;
		this.orderItems = parentViewModel.orderItems;
	}

	async init(id: string): Promise<void> {
		this.parentOrderItem(window.ko.utils.arrayFirst(this.orderItems(), orderItem => orderItem.Id() === id) || null);
		const query = window.database.CrmArticle_ArticleRelationship
			.include("Child")
			.filter("it.ParentId == this.parentId && (this.filter == '' || it.Child.ItemNo.contains(this.filter) || it.Child.Description.contains(this.filter))", {
				parentId: this.parentOrderItem().ArticleId(),
				filter: this.articleFilter
			});
		let count = await query.count();
		this.articlePager.totalItemCount(count);
		let articles = await query
			.orderBy(function (x) {
				return x.Child.ItemNo;
			})
			.orderBy(function (x) {
				return x.Child.Description;
			})
			.map(function (x) {
				return x.Child;
			})
			.skip(this.articlePager.skip)
			.take(this.articlePager.pageSize())
			.toArray();
		this.articles(articles.map(x => x.asKoObservable()));
		const selectedOrderItems = window.ko.utils.arrayFilter(this.orderItems(), orderItem => orderItem.ParentOrderItemId() === id);
		const selectedArticleIds = window.ko.utils.arrayMap(selectedOrderItems, orderItem => orderItem.ArticleId());
		this.selectedArticleIds(selectedArticleIds);
	}

	addArticle(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): void {
		let orderItem = window.ko.utils.arrayFirst(this.orderItems(), x => x.ArticleId() === article.Id());
		if (!orderItem) {
			orderItem = window.database.CrmOrder_OrderItem.defaultType.create().asKoObservable();
			window.database.add(orderItem);
			orderItem.Id(window.$data.createGuid().toString().toLowerCase());
			orderItem.ArticleId(article.Id());
			orderItem.ArticleNo(article.ItemNo());
			orderItem.ArticleDescription(article.Description());
			orderItem.OrderId(this.baseOrder().Id());
			orderItem.Price(article.Price());
			orderItem.PurchasePrice(article.PurchasePrice());
			orderItem.QuantityUnitKey(article.QuantityUnitEntry().QuantityUnitKey());
			orderItem.QuantityValue(1);
			this.orderItems().push(orderItem);
		}
		orderItem.IsOption(false);
		orderItem.IsAccessory(true);
		orderItem.IsAlternative(false);
		orderItem.ParentOrderItemId(this.parentOrderItem().Id());
	}

	async applyArticles(): Promise<void> {
		this.loading(true);
		await window.database.CrmArticle_Article.include("QuantityUnitEntry").filter("it.Id in this.selectedArticleIds", {selectedArticleIds: this.selectedArticleIds})
			.forEach(article => {
				this.addArticle(article.asKoObservable());
			});
		const deselectedOrderItems = window.ko.utils.arrayFilter(this.orderItems(),
			x => x.ParentOrderItemId() === this.parentOrderItem().Id() && this.selectedArticleIds().indexOf(x.ArticleId()) === -1);
		this.orderItems.removeAll(deselectedOrderItems);
		this.orderItems.valueHasMutated();
		this.loading(false);
		$(".modal:visible").modal("hide");
	}
}

namespace("Crm.Order.ViewModels").BaseOrderAccessoryListModalViewModel = BaseOrderAccessoryListModalViewModel;
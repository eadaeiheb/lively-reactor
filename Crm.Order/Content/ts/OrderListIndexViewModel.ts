import {namespace} from "@Main/namespace";
import type {TimeLineEvent} from "@Main/DashboardCalendarWidgetViewModel";

export class OrderListIndexViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Order.Rest.Model.CrmOrder_Order, Crm.Order.Rest.Model.ObservableCrmOrder_Order> {
	lookups: LookupType = {
		currencies: {$tableName: "Main_Currency"},
		entryTypes: {$tableName: "CrmOrder_OrderEntryType"},
		statuses: {$tableName: "CrmOrder_OrderStatus"}
	};

	constructor() {
		super("CrmOrder_Order", "CreateDate", "DESC", ["Company", "Person", "ResponsibleUserUser"]);

		const allOrdersBookmark = {
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: "All orders",
			Key: "AllOrders",
			Expression: function (query) {
				return query;
			}
		};
		const openOrdersBookmark = {
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("OpenOrders"),
			Key: "OpenOrders",
			Expression: function (query) {
				return query.filter(function (x) {
					return x.StatusKey === "Open";
				});
			}
		};
		const closedOrdersBookmark = {
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("ClosedOrders"),
			Key: "ClosedOrders",
			Expression: query => {
				return query.filter(function (x) {
					return x.StatusKey === "Closed";
				});
			}
		};
		this.bookmarks.push(allOrdersBookmark);
		this.bookmarks.push(openOrdersBookmark);
		this.bookmarks.push(closedOrdersBookmark);
		this.bookmark(openOrdersBookmark);
		this.timelineProperties.push({
			Start: "OrderDate",
			End: "OrderDate",
			Caption: window.Helper.String.getTranslatedString("OrderDate")
		});
	}

	downloadIcs = window.Crm.Order.ViewModels.OfferListIndexViewModel.prototype.downloadIcs;

	getIcsLinkAllowed(): boolean {
		return window.AuthorizationManager.isAuthorizedForAction("Order", "Ics");
	};

	getTimelineEvent(order: Crm.Order.Rest.Model.ObservableCrmOrder_Order, timelineProperty: { Start: string, End: string, Caption: string }): TimeLineEvent {
		let timeLineEvent = window.Main.ViewModels.GenericListViewModel.prototype.getTimelineEvent.call(this, order, timelineProperty);
		timeLineEvent.entityType = window.Helper.getTranslatedString("Order");
		timeLineEvent.title = order.OrderNo() + " - " + window.Helper.Company.getDisplayName(order.Company());
		timeLineEvent.url = "#/Crm.Order/Order/DetailsTemplate/" + order.Id();
		return timeLineEvent;
	}

	async init(id?: string, params?: any): Promise<void> {
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		await super.init(id, params);
	};

	applyFilters(query: $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Order>): $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Order> {
		query = super.applyFilters(query);
		if (!window.AuthorizationManager.isAuthorizedForAction("Order", "SeeAllUsersOrders")) {
			query = query.filter(function (order) {
				return (order.CreateUser === this.username || order.ResponsibleUser === this.username)
			}, {username: this.currentUser().Id});
		}

		return query;
	};

}

namespace("Crm.Order.ViewModels").OrderListIndexViewModel = OrderListIndexViewModel;
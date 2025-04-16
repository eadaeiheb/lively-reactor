import {Mixin} from "ts-mixer";
import type {
	DashboardCalendarWidgetFilter,
	TimeLineEvent
} from "@Main/DashboardCalendarWidgetViewModel";

export class DashboardCalendarWidgetViewModelExtension extends window.Main.ViewModels.DashboardCalendarWidgetViewModel {
	constructor(options) {
		super(options);
	}

	getTimelineEvent(item: Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order | any): TimeLineEvent {
		if (window.database.CrmOrder_Offer &&
			item.innerInstance instanceof
			window.database.CrmOrder_Offer.defaultType) {
			return window.Crm.Order.ViewModels.OfferListIndexViewModel.prototype.getTimelineEvent.call(this, item, {
				Start: "OrderDate",
				End: "OrderDate",
				Caption: "OrderDate"
			});
		}
		if (window.database.CrmOrder_Order &&
			item.innerInstance instanceof
			window.database.CrmOrder_Order.defaultType) {
			return window.Crm.Order.ViewModels.OrderListIndexViewModel.prototype.getTimelineEvent.call(this, item, {
				Start: "OrderDate",
				End: "OrderDate",
				Caption: "OrderDate"
			});
		}
		return super.getTimelineEvent(item as any);
	};

	getTimelineEventQueries(): { query: $data.Queryable<any>, filter: DashboardCalendarWidgetFilter }[] {
		let queries = super.getTimelineEventQueries();
		if (window.database.CrmOrder_Offer && window.AuthorizationManager.isAuthorizedForAction("Offer", "CalendarEntry")) {
			queries.push({
				query: window.database.CrmOrder_Offer
					.include("Company")
					.filter(function (it) {
							return it.ResponsibleUser === this.currentUser &&
								it.OrderDate >= this.start &&
								it.OrderDate <= this.end;
						},
						{
							currentUser: this.currentUser(),
							start: this.timelineStart(),
							end: this.timelineEnd()
						}), filter: {
					Value: window.database.CrmOrder_Offer.defaultType.name,
					Caption: window.Helper.String.getTranslatedString("Offers")
				}
			});
		}
		if (window.database.CrmOrder_Order && window.AuthorizationManager.isAuthorizedForAction("Order", "CalendarEntry")) {
			queries.push({
				query: window.database.CrmOrder_Order
					.include("Company")
					.filter(function (it) {
							return it.ResponsibleUser === this.currentUser &&
								it.OrderDate >= this.start &&
								it.OrderDate <= this.end;
						},
						{
							currentUser: this.currentUser(),
							start: this.timelineStart(),
							end: this.timelineEnd()
						}), filter: {
					Value: window.database.CrmOrder_Order.defaultType.name,
					Caption: window.Helper.String.getTranslatedString("Orders")
				}
			});
		}
		return queries;
	}
}

window.Main.ViewModels.DashboardCalendarWidgetViewModel = Mixin(DashboardCalendarWidgetViewModelExtension);
import {namespace} from "@Main/namespace";
import type {TimeLineEvent} from "@Main/DashboardCalendarWidgetViewModel";

export class OfferListIndexViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Order.Rest.Model.CrmOrder_Offer, Crm.Order.Rest.Model.ObservableCrmOrder_Offer> {
	lookups: LookupType = {
		currencies: {$tableName: "Main_Currency"},
		entryTypes: {$tableName: "CrmOrder_OrderEntryType"},
		statuses: {$tableName: "CrmOrder_OrderStatus"},
		cancelReasonCategories: {$tableName: "CrmOrder_OrderCancelReasonCategory"}
	};

	constructor() {
		super("CrmOrder_Offer", "CreateDate", "DESC", ["Company", "Person", "ResponsibleUserUser"]);
		this.timelineProperties.push({
			Start: "OrderDate",
			End: "OrderDate",
			Caption: window.Helper.String.getTranslatedString("OfferDate")
		});
	}

	async downloadIcs(): Promise<void> {
		const cal = window.ics();
		let result = await this.query().toArray();
		result.forEach(function (x) {
			const title = x.OrderNo;
			const description = window.Helper.Company.getDisplayName(x.Company);
			cal.addEvent(title, description, "", x.OrderDate, x.OrderDate);
		});
		cal.download(this.entityType);
	}

	getIcsLinkAllowed(): boolean {
		return window.AuthorizationManager.isAuthorizedForAction("Offer", "Ics");
	};

	getTimelineEvent(offer: Crm.Order.Rest.Model.ObservableCrmOrder_Offer, timelineProperty: { Start: string, End: string, Caption: string }): TimeLineEvent {
		let timeLineEvent = window.Main.ViewModels.GenericListViewModel.prototype.getTimelineEvent.call(this, offer, timelineProperty);
		timeLineEvent.entityType = window.Helper.getTranslatedString("Offer");
		timeLineEvent.title = offer.OrderNo() + " - " + window.Helper.Company.getDisplayName(offer.Company());
		timeLineEvent.url = "#/Crm.Order/Offer/Details/" + offer.Id();
		return timeLineEvent;
	}

	async init(id?: string, params?: any): Promise<void> {
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups)
		await super.init(id, params);
	};

	applyFilters(query: $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Offer>): $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Offer> {
		query = super.applyFilters(query);
		if (!window.AuthorizationManager.isAuthorizedForAction("Offer", "SeeAllUsersOffers")) {
			query = query.filter(function (offer) {
				return (offer.CreateUser === this.username || offer.ResponsibleUser === this.username)
			}, {username: this.currentUser().Id});
		}

		return query;
	};
}

namespace("Crm.Order.ViewModels").OfferListIndexViewModel = OfferListIndexViewModel;
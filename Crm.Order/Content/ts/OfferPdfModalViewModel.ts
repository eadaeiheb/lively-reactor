import {namespace} from "@Main/namespace";

export class OfferPdfModalViewModel extends window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel {
	async init(id?: string, params?: any): Promise<void> {
		this.loading(true);
		if (this.parentViewModel) {
			await super.init();
			this.loading(false);
			return;
		} else {
			await window.Helper.Database.initialize();
			await window.Crm.Offline.Bootstrapper.initializeSettings();
			let offer = await window.database.CrmOrder_Offer
				.include("Company")
				.include("Person")
				.find(id);
			this.order(offer.asKoObservable());
			let items = await window.database.CrmOrder_OrderItem
				.filter(function (orderItem) {
					return orderItem.OrderId === this.orderId;
				}, {orderId: this.order().Id()})
				.include2("Article.DocumentAttributes.filter(function(x){ return x.UseForThumbnail === true; })")
				.include("Article.DocumentAttributes.FileResource")
				.orderBy("it.Position")
				.toArray();
			this.items(items.map(x => x.asKoObservable()));
			await super.init();
			this.loading(false);
		}
	}
}

namespace("Crm.Order.ViewModels").OfferPdfModalViewModel = OfferPdfModalViewModel;
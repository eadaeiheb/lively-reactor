import {namespace} from "@Main/namespace";

export class OfferSaveModalViewModel extends window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel {
	offer = this.baseOrder;

	async init(): Promise<void> {
		if (!this.baseOrder()) {
			let offer = await window.database.CrmOrder_Offer
				.find(this.baseOrderId);
			window.database.attachOrGet(offer);
			this.baseOrder(offer.asKoObservable());
		}
		await super.init();
	};
}

namespace("Crm.Order.ViewModels").OfferSaveModalViewModel = OfferSaveModalViewModel;
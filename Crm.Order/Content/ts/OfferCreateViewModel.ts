import {namespace} from "@Main/namespace";
import { Breadcrumb } from "@Main/breadcrumbs";

export class OfferCreateViewModel extends window.Crm.Order.ViewModels.BaseOrderCreateViewModel {
	offer = this.baseOrder;
	numberingSequence(): string { return "CRM.Offer"};

	async init(id?: string, params?: any): Promise<void> {
		const offer = window.database.CrmOrder_Offer.defaultType.create();
		offer.Id = window.$data.createGuid().toString().toLowerCase();
		offer.OrderDate = new Date();
		offer.ValidTo = window.moment().startOf("day").add(parseInt(window.Crm.Order.Settings.ValidToDefaultTimespan), "days").toDate();
		this.offer(offer.asKoObservable());
		await super.init(id, params);
		this.offer().ResponsibleUser(this.user().Id);
		await this.setBreadcrumbs();
		window.database.add(offer);
	}

	async submit(): Promise<void> {
		this.loading(true);

		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			this.errors.scrollToError();
			this.errors.expandCollapsiblesWithErrors();
			return;
		}

		let offerNo = await window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Order.Settings.Offer.OfferNoIsGenerated, window.Crm.Order.Settings.Offer.OfferNoIsCreateable, this.offer().OrderNo(), window.Crm.Order.ViewModels.OfferCreateViewModel.prototype.numberingSequence(), window.database.CrmOrder_Offer, "OrderNo");
		if (!this.offer().OrderNo()) {
			this.offer().OrderNo(offerNo);
		}
		await super.submit();
		window.location.hash = "/Crm.Order/Offer/Details/" + this.offer().Id();
	}

	async setBreadcrumbs(): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.getTranslatedString("Offer"), "Offer::Index", "#/Crm.Order/OfferList/IndexTemplate"),
			new Breadcrumb(window.Helper.getTranslatedString("CreateOffer"), null, window.location.hash, null, null)
		]);
	};
}

namespace("Crm.Order.ViewModels").OfferCreateViewModel = OfferCreateViewModel;
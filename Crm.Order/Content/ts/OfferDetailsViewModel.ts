import {namespace} from "@Main/namespace";
import {Breadcrumb} from "@Main/breadcrumbs";

export class OfferDetailsViewModel extends window.Crm.Order.ViewModels.BaseOrderDetailsViewModel {
	imageIndex = ko.observable<number>(0);
	offer: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer> = this.baseOrder as KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer>;
	offerId: string;
	isEditable = ko.computed<boolean>(() => this.offer() && !this.offer().IsLocked());

	constructor() {
		super();
		this.showUpcomingArticles(true);
		this.lookups.orderStatuses = {$tableName: "CrmOrder_OrderStatus"};
		this.lookups.cancelReasonCategories = {$tableName: "CrmOrder_OrderCancelReasonCategory"};
	}

	async init(id?: string, params?: any): Promise<void> {
		window.Helper.Database.registerEventHandlers(this, {CrmOrder_Offer: {afterUpdate: this.refresh}});
		this.offerId = id;
		if (this.offerId) {
			await this.refresh();
		} else {
			const newOffer = window.database.CrmOrder_Offer.defaultType.create();
			newOffer.Id = window.$data.createGuid().toString().toLowerCase();
			newOffer.OrderDate = new Date();
			this.offerId = newOffer.Id;
			this.baseOrder(newOffer.asKoObservable());
		}
		if (id) {
			await this.setBreadcrumbs();
		}
		await super.init(id, params);
		if (!id) {
			window.database.add(this.baseOrder().innerInstance);
		}
	}

	async refresh(): Promise<void> {
		await super.refresh();
		let offer = await window.database.CrmOrder_Offer
			.include("Company")
			.include("Person")
			.find(this.offerId);
		this.offer(offer.asKoObservable());
	};

	async sendConfirmation(): Promise<void> {
		if (this.hasCustomerEmail()) {
			window.database.attachOrGet(this.offer().innerInstance);
			this.offer().IsLocked(true);
		}
		await super.sendConfirmation();
	}

	async setBreadcrumbs(): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.String.getTranslatedString("Offer"), "Offer::Index", "#/Crm.Order/OfferList/IndexTemplate"),
			new Breadcrumb(this.offer().OrderNo(), null, window.location.hash)
		]);
	};

	async exportOffer(): Promise<void> {
		let confirm = await window.Helper.Confirm.genericConfirmAsync({
			text: window.Helper.String.getTranslatedString("ConfirmExportOffer"),
			type: "warning"
		});
		if (!confirm) {
			return;
		}
		this.loading(true);
		window.database.attachOrGet(this.offer().innerInstance);
		this.offer().IsLocked(true);
		this.offer().ReadyForExport(true);
		await window.database.saveChanges();
		this.loading(false);
	}

	async cancelExport(): Promise<void> {
		this.loading(true);
		let latestOffer = await window.database.CrmOrder_Offer.find(this.baseOrder().Id())
		if (latestOffer.IsExported === true) {
			await window.Helper.Confirm.genericConfirmAsync({
				text: window.Helper.String.getTranslatedString("OfferAlreadyExported"),
				type: "error"
			});
			this.baseOrder(latestOffer.asKoObservable());
			this.loading(false);
			return
		}
		window.database.attachOrGet(this.offer().innerInstance);
		this.offer().IsLocked(false);
		this.offer().ReadyForExport(false);
		await window.database.saveChanges();
		this.loading(false);
	}

	async cancel(): Promise<void> {
		window.database.attachOrGet(this.offer().innerInstance);
		this.offer().IsLocked(true);
		this.offer().StatusKey("Canceled");
		await window.database.saveChanges();
		$(".modal:visible").modal("hide");
	}
}

namespace("Crm.Order.ViewModels").OfferDetailsViewModel = OfferDetailsViewModel;
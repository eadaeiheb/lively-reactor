import {namespace} from "@Main/namespace";
import type {OfferDetailsViewModel} from "./OfferDetailsViewModel";

export class OfferCopyModalViewModel extends window.Main.ViewModels.ViewModelBase {
	errors = ko.validation.group(this, {deep: true});
	shouldCopyCalculationPositions = ko.observable<boolean>(true);
	getCurrencyValue = window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getCurrencyValue;
	lookups: LookupType = {currencies: {$tableName: 'Main_Currency'}};
	offer: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer>;
	offerItems: KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>;
	calculationPositions = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_CalculationPosition>([]);
	newOffer = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer>(null);
	newOfferItems = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>([]);
	newCalculationPositions = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_CalculationPosition>([]);

	constructor(parentViewModel: OfferDetailsViewModel) {
		super();
		this.offer = parentViewModel.offer;
		this.offerItems = parentViewModel.orderItems;
	}

	async init(): Promise<void> {
		this.loading(true);

		const newOffer = window.database.CrmOrder_Offer.defaultType.create(this.offer().innerInstance);
		newOffer.Id = window.$data.createGuid().toString().toLowerCase();
		newOffer.IsLocked = false;
		newOffer.SendConfirmation = false;
		newOffer.ConfirmationSent = false;
		newOffer.IsExported = false;
		newOffer.ReadyForExport = false;
		newOffer.CancelReasonCategoryKey = null;
		newOffer.CancelReasonText = null;
		newOffer.ReadyForExport = false;
		newOffer.StatusKey = "Open";
		newOffer.OrderDate = new Date();
		this.newOffer(newOffer.asKoObservable());

		this.offerItems().forEach(offerItem => {
			const newOfferItem = window.database.CrmOrder_OrderItem.defaultType.create(offerItem.innerInstance);
			newOfferItem.Id = window.$data.createGuid().toString().toLowerCase();
			newOfferItem.OrderId = newOffer.Id;
			this.newOfferItems().push(newOfferItem.asKoObservable());
		});
		let calculationPositions = await window.database.CrmOrder_CalculationPosition.filter(function (pos) {
			return pos.BaseOrderId === this.baseOrderId;
		}, {baseOrderId: this.offer().Id()}).toArray();
		this.calculationPositions(calculationPositions.map(x => x.asKoObservable()));
	}

	async submit(): Promise<void> {
		if (this.errors().length > 0) {
			this.errors.showAllMessages();
			return;
		}

		this.loading(true);

		window.database.add(this.newOffer().innerInstance);
		this.newOfferItems()
			.forEach(offerItem => {
				offerItem.OrderId(this.newOffer().Id());
				window.database.add(offerItem.innerInstance);
			});
		if (this.shouldCopyCalculationPositions()) {
			this.calculationPositions().forEach(pos => {
				const newPos = window.database.CrmOrder_CalculationPosition.defaultType.create(pos.innerInstance);
				newPos.Id = window.$data.createGuid().toString().toLowerCase();
				this.newCalculationPositions().push(newPos.asKoObservable());
			});
			this.newCalculationPositions()
				.forEach(pos => {
					pos.BaseOrderId(this.newOffer().Id());
					window.database.add(pos.innerInstance);
				});
		}
		let offerNo = await window.NumberingService.getNextFormattedNumber(window.Crm.Order.ViewModels.OfferCreateViewModel.prototype.numberingSequence());
		this.newOffer().OrderNo(offerNo);
		await window.database.saveChanges();
		this.loading(false);
		window.location.hash = "/Crm.Order/Offer/Details/" + this.newOffer().Id();
	};
}

namespace("Crm.Order.ViewModels").OfferCopyModalViewModel = OfferCopyModalViewModel;
import {namespace} from "@Main/namespace";
import type {OfferDetailsViewModel} from "./OfferDetailsViewModel";

export class OfferLoadModalViewModel extends window.Crm.Order.ViewModels.OfferListIndexViewModel {
	currentOfferId = ko.observable<string>(null);

	constructor(parentViewModel: OfferDetailsViewModel) {
		super();
		this.currentOfferId(parentViewModel.baseOrder().Id());
	}

	discard(offer: Crm.Order.Rest.Model.ObservableCrmOrder_Offer): void {
		const $modal = $(".modal:visible");
		$modal.hide();
		window.swal({
			title: window.Helper.String.getTranslatedString("DiscardOffer"),
			text: window.Helper.String.getTranslatedString("DiscardOfferConfirmationMessage"),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: window.Helper.String.getTranslatedString("Discard"),
			cancelButtonText: window.Helper.String.getTranslatedString("Cancel"),
			closeOnConfirm: false
		}, async isConfirm => {
			if (isConfirm) {
				window.database.remove(offer.innerInstance);
				await window.database.saveChanges();
				window.swal({
					title: window.Helper.String.getTranslatedString("Discarded"),
					text: window.Helper.String.getTranslatedString("DiscardOfferSuccessMessage"),
					type: "success",
					confirmButtonText: window.Helper.String.getTranslatedString("Close")
				}, () => {
					this.filter();
					$modal.show();
				});
			} else {
				$modal.show();
			}
		});
	}
}

namespace("Crm.Order.ViewModels").OfferLoadModalViewModel = OfferLoadModalViewModel;
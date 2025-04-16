import {namespace} from "@Main/namespace";
import type {OrderDetailsViewModel} from "./OrderDetailsViewModel";

export class OrderLoadModalViewModel extends window.Crm.Order.ViewModels.OrderListIndexViewModel {
	currentOrderId = ko.observable<string>(null);

	constructor(parentViewModel: OrderDetailsViewModel) {
		super();
		this.currentOrderId(parentViewModel.baseOrder().Id());
	}

	async discard(order: Crm.Order.Rest.Model.ObservableCrmOrder_Order): Promise<void> {
		const $modal = $(".modal:visible");
		$modal.hide();
		window.swal({
			title: window.Helper.String.getTranslatedString("DiscardOrder"),
			text: window.Helper.String.getTranslatedString("DiscardOrderConfirmationMessage"),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: window.Helper.String.getTranslatedString("Discard"),
			cancelButtonText: window.Helper.String.getTranslatedString("Cancel"),
			closeOnConfirm: false
		}, async isConfirm => {
			if (isConfirm) {
				window.database.remove(order.innerInstance);
				await window.database.saveChanges();
				window.swal({
					title: window.Helper.String.getTranslatedString("Discarded"),
					text: window.Helper.String.getTranslatedString("DiscardOrderSuccessMessage"),
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

namespace("Crm.Order.ViewModels").OrderLoadModalViewModel = OrderLoadModalViewModel;
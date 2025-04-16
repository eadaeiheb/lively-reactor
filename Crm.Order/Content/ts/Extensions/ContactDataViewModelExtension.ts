import {Mixin} from "ts-mixer";

export class ContactDataViewModelExtension extends window.Crm.ViewModels.ContactDataViewModel {
	initRemoveAddressChecks(): void {
		super.initRemoveAddressChecks();
		this.removeAddressChecks.push(this.isOrderDeliveryOrBillingAddress);
		this.removeAddressChecks.push(this.isOfferDeliveryOrBillingAddress);
	};

	async isOrderDeliveryOrBillingAddress(): Promise<string> {
		try {
			let order = await window.database.CrmOrder_Order
				.first("it.BillingAddressId === this.addressId || it.DeliveryAddressId === this.addressId",
					{addressId: this.address.Id()});
			return window.Helper.String.getTranslatedString("Order") + ": " + order.OrderNo;
		} catch (e) {
			return null;
		}
	};

	async isOfferDeliveryOrBillingAddress(): Promise<string> {
		try {
			let offer = await window.database.CrmOrder_Offer
				.first("it.BillingAddressId === this.addressId || it.DeliveryAddressId === this.addressId",
					{addressId: this.address.Id()});
			return window.Helper.String.getTranslatedString("Offer") + ": " + offer.OrderNo;
		} catch (e) {
			return null;
		}
	};
}

window.Crm.ViewModels.ContactDataViewModel = Mixin(ContactDataViewModelExtension);
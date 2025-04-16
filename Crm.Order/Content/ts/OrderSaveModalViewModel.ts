import {namespace} from "@Main/namespace";

export class OrderSaveModalViewModel extends window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel {
	order = this.baseOrder;
	signatureAcceptanceRequired = window.Crm.Order.Settings.Order.Show.PrivacyPolicy;
	site = ko.observable<Main.Rest.Model.Main_Site>(null);

	async init(): Promise<void> {
		if (!this.baseOrder()) {
			let order = await window.database.CrmOrder_Order
				.find(this.baseOrderId);
			window.database.attachOrGet(order);
			this.baseOrder(order.asKoObservable());
			this.order().SignPrivacyPolicyAccepted.extend({
				validation: {
					validator: (val, showPrivacyPolicy) => !showPrivacyPolicy || !this.order().Signature() || !!this.order().Signature() && val,
					message: window.Helper.String.getTranslatedString("PleaseAcceptDataPrivacyPolicy"),
					params: this.signatureAcceptanceRequired
				}
			});
		}
		let site = await window.database.Main_Site.GetCurrentSite().first();
		this.site(site);
		await super.init();
	};
}

namespace("Crm.Order.ViewModels").OrderSaveModalViewModel = OrderSaveModalViewModel;
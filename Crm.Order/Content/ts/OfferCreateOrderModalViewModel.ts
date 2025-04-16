import {namespace} from "@Main/namespace";
import type {OfferDetailsViewModel} from "./OfferDetailsViewModel";

export class OfferCreateOrderModalViewModel extends window.Main.ViewModels.ViewModelBase {
	errors = ko.validation.group(this, {deep: true});
	showQuantities = ko.observable<boolean>(false);
	getCurrencyValue = window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getCurrencyValue;
	currencies = ko.observableArray<Main.Rest.Model.Lookups.ObservableMain_Currency>([]);
	offer: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer>;
	offerItems: KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>;
	order = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_Order>(null);
	orderItems = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>([]);
	orderRecipients = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderRecipient>([]);
	dataProtectionInfoVisibility = ko.observable<boolean>(false);
	signatureAcceptanceRequired = window.Crm.Order.Settings.Order.Show.PrivacyPolicy;
	site = ko.observable<Main.Rest.Model.Main_Site>(null);
	alternatives = ko.pureComputed<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[]>(() => {
		return window.ko.utils.arrayFilter(this.offerItems(), item => item.IsAlternative());
	});
	alternativeGroups = ko.pureComputed<{ alternatives: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[], parentOrderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem, parentOrderItemId: string, selectedAlternative: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem> }[]>(() => {
		return window.ko.utils.arrayMap(window.Helper.Distinct.getIndexKeys(this.alternatives, "ParentOrderItemId"), parentOrderItemId => {
			const parentOrderItem = window.ko.utils.arrayFirst(this.offerItems(), offerItem => offerItem.Id().toString() === parentOrderItemId.toString()) || null;
			return {
				alternatives: window.Helper.Distinct.getIndex(this.alternatives, "ParentOrderItemId")[parentOrderItemId],
				parentOrderItem: parentOrderItem,
				parentOrderItemId: parentOrderItemId,
				selectedAlternative: window.ko.observable(parentOrderItem)
			};
		});
	});
	optionalItems = ko.pureComputed<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[]>(() => {
		return window.ko.utils.arrayFilter(this.offerItems(), item => item.IsOption());
	});
	selectedOptionalItems = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>([]);

	constructor(parentViewModel: OfferDetailsViewModel) {
		super();
		this.showQuantities(parentViewModel.offer().OrderEntryType() === "SingleDelivery" || parentViewModel.offer().OrderEntryType() === "MultiDelivery");
		this.offer = parentViewModel.offer;
		this.offerItems = parentViewModel.orderItems;
		window.Helper.Distinct.createIndex(this.orderItems, "DeliveryDate");
		window.Helper.Distinct.createIndex(this.alternatives, "ParentOrderItemId");
	}

	async init(): Promise<void> {
		this.loading(true);
		const newOrder = window.database.CrmOrder_Order.defaultType.create();
		newOrder.Id = window.$data.createGuid().toString().toLowerCase();
		newOrder.BillingAddressId = this.offer().BillingAddressId();
		newOrder.CalculatedPrice = this.offer().CalculatedPrice();
		newOrder.CalculatedPriceWithDiscount = this.offer().CalculatedPriceWithDiscount();
		newOrder.CommunicationType = this.offer().CommunicationType();
		newOrder.ContactId = this.offer().ContactId();
		newOrder.ContactAddressId = this.offer().ContactAddressId();
		newOrder.ContactPersonId = this.offer().ContactPersonId();
		newOrder.CurrencyKey = this.offer().CurrencyKey();
		newOrder.CustomFax = this.offer().CustomFax();
		newOrder.DeliveryAddressId = this.offer().DeliveryAddressId();
		newOrder.DeliveryDate = this.offer().DeliveryDate();
		newOrder.Discount = this.offer().Discount();
		newOrder.DiscountType = this.offer().DiscountType();
		newOrder.OfferId = this.offer().Id();
		newOrder.OrderCategoryKey = this.offer().OrderCategoryKey();
		newOrder.OrderDate = new Date();
		newOrder.OrderEntryType = this.offer().OrderEntryType();
		newOrder.Price = this.offer().Price();
		newOrder.PrivateDescription = this.offer().PrivateDescription();
		newOrder.PublicDescription = this.offer().PublicDescription();
		newOrder.RealizedDiscount = this.offer().RealizedDiscount();
		newOrder.ResponsibleUser = this.offer().ResponsibleUser();
		newOrder.Visibility = this.offer().Visibility();
		newOrder.VisibleToUsergroupIds = this.offer().VisibleToUsergroupIds();
		newOrder.VisibleToUserIds = this.offer().VisibleToUserIds();
		
		this.offer().OrderRecipients().forEach(recipient => {
			const newRecipient = window.database.CrmOrder_OrderRecipient.defaultType.create(recipient.innerInstance);
			newRecipient.Id = window.$data.createGuid().toString().toLowerCase();
			newRecipient.BaseOrderId = newOrder.Id;
			this.orderRecipients().push(newRecipient.asKoObservable());
		});

		this.order(newOrder.asKoObservable());
		this.offerItems().forEach(offerItem => {
			const hasAlternative = window.Helper.Distinct.getIndexKeys(this.alternatives, "ParentOrderItemId").indexOf(offerItem.Id().toString()) !== -1;
			if (offerItem.QuantityValue() !== 0 && !offerItem.IsAlternative() && !offerItem.IsOption() && !hasAlternative) {
				const orderItem = window.database.CrmOrder_OrderItem.defaultType.create(offerItem.innerInstance);
				orderItem.Id = window.$data.createGuid().toString().toLowerCase();
				orderItem.OrderId = newOrder.Id;
				this.orderItems().push(orderItem.asKoObservable());
			}
		});
		this.orderItems.valueHasMutated();
		this.order().SignPrivacyPolicyAccepted.extend({
			validation: {
				validator: (val, showPrivacyPolicy) => !showPrivacyPolicy || !this.order().Signature() || !!this.order().Signature() && val,
				message: window.Helper.String.getTranslatedString("PleaseAcceptDataPrivacyPolicy"),
				params: this.signatureAcceptanceRequired
			}
		});
		let currencies = await window.database.Main_Currency
			.orderByDescending(function (x) {
				return x.Favorite;
			})
			.orderBy(function (x) {
				return x.SortOrder;
			})
			.toArray();
		this.currencies(currencies.map(x => x.asKoObservable()));
		let site = await window.database.Main_Site.GetCurrentSite().first();
		this.site(site);
	}

	async submit(): Promise<void> {
		if (this.errors().length > 0) {
			this.errors.showAllMessages();
			return;
		}

		this.loading(true);

		window.database.attach(this.offer())
		this.offer().StatusKey("OrderCreated");
		this.offer().IsLocked(true);

		this.alternativeGroups()
			.forEach(alternativeGroup => {
				const orderItem = window.database.CrmOrder_OrderItem.defaultType.create(alternativeGroup.selectedAlternative().innerInstance);
				orderItem.Id = window.$data.createGuid().toString().toLowerCase();
				orderItem.IsAlternative = false;
				orderItem.OrderId = this.order().Id();
				orderItem.ParentOrderItemId = null;
				this.orderItems().push(orderItem.asKoObservable());
			});
		this.selectedOptionalItems()
			.forEach(offerItem => {
				const orderItem = window.database.CrmOrder_OrderItem.defaultType.create(offerItem.innerInstance);
				orderItem.Id = window.$data.createGuid().toString().toLowerCase();
				orderItem.IsOption = false;
				orderItem.OrderId = this.order().Id();
				this.orderItems().push(orderItem.asKoObservable());
			});
		window.database.add(this.order().innerInstance);
		this.orderItems()
			.forEach(orderItem => {
				window.database.add(orderItem.innerInstance);
			});
		this.orderRecipients()
			.forEach(orderRecipient => {
				window.database.add(orderRecipient.innerInstance);
			});
		
		let orderNo = await window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Order.Settings.Order.OrderNoIsGenerated, window.Crm.Order.Settings.Order.OrderNoIsCreateable, this.order().OrderNo(), window.Crm.Order.ViewModels.OrderCreateViewModel.prototype.numberingSequence(), window.database.CrmOrder_Order, "OrderNo");
		if (orderNo !== null) {
			this.order().OrderNo(orderNo);
		}
		await window.database.saveChanges();
		this.loading(false);
		window.location.hash = "/Crm.Order/Order/DetailsTemplate/" + this.order().Id();
	};

	toggleDataProtectionInfo(): void {
		this.dataProtectionInfoVisibility(!this.dataProtectionInfoVisibility());
	};
}

namespace("Crm.Order.ViewModels").OfferCreateOrderModalViewModel = OfferCreateOrderModalViewModel;
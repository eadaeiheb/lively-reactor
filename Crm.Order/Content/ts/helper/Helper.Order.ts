import _ from "lodash";

export class HelperOrder {

	static closeSidebar() : void{
		const $toggled = $(".sidebar.toggled");
		$(".open[data-trigger=\"#right-nav\"]").removeClass("open");
		$toggled.removeClass("toggled");
		$("#header").removeClass("sidebar-toggled");
		$toggled.trigger("sidebar.closed");
	}

	static getTypeAbbreviation(order : Crm.Order.Rest.Model.ObservableCrmOrder_Order, orderEntryTypes: { [key: string]: Crm.Order.Rest.Model.Lookups.CrmOrder_OrderEntryType }) : string {
		if (!order) {
			return "";
		}
		order = ko.unwrap(order);
		const orderEntryTypeKey = ko.unwrap(order.OrderEntryType);
		if (orderEntryTypeKey) {
			const orderEntryType = (orderEntryTypes || {})[orderEntryTypeKey];
			if (orderEntryType && orderEntryType.Value) {
				return orderEntryType.Value[0];
			}
		}
		return "";
	}

	static filterOrderItemsByDeliveryDate(orderItems : KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem> | Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[], deliveryDate : string | Date) {
		if (ko.unwrap(deliveryDate)) {
			deliveryDate = ko.unwrap(deliveryDate);
			deliveryDate = deliveryDate instanceof Date ? deliveryDate.toISOString() : deliveryDate;
			// @ts-ignore
			if (orderItems.index && orderItems.index.DeliveryDate)
				{ // @ts-ignore
					orderItems = ko.unwrap(orderItems.index.DeliveryDate()[deliveryDate]);
				}
			else{
				orderItems = ko.unwrap(orderItems)
				orderItems = _.filter(orderItems, (x) => x.DeliveryDate().toISOString() == deliveryDate)
			}

		}
		else {
			orderItems = ko.unwrap(orderItems)
		}
		return orderItems
	}

	static getSubTotals(orderItems : KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem> | Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[], deliveryDate : string | Date) : {
		key: string;
		value: any;
	}[] {
		orderItems = HelperOrder.filterOrderItemsByDeliveryDate(orderItems, deliveryDate);
		// @ts-ignore
		const groupedOrderItems = window._.groupBy(orderItems, (x) => x.QuantityUnitKey())
		for (const qtyKey in groupedOrderItems) {
			// @ts-ignore
			groupedOrderItems[qtyKey] = window._.sum(groupedOrderItems[qtyKey].map(orderItem => orderItem.QuantityValue()))
		}
		return Object.entries(groupedOrderItems).map(x => {return {key: x[0], value: x[1]}})
	}

	static getSum(orderItems : KnockoutObservableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem> | Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[], deliveryDate : string | Date): number{
		orderItems = HelperOrder.filterOrderItemsByDeliveryDate(orderItems, deliveryDate);
		if (orderItems === null || orderItems === undefined)
			return 0
		// @ts-ignore
		return window._.sum(orderItems.map(orderItem => HelperOrder.getOrderItemPrice(orderItem)))
	}

	static getOrderItemPrice(orderItem : Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): number {
		orderItem = ko.unwrap(orderItem)

		var price = orderItem.Price() * orderItem.QuantityValue();
		if (orderItem.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage) {
			price *= 1 - (orderItem.Discount() / 100);
		} else {
			price -= orderItem.Discount() * orderItem.QuantityValue();
		}
		return price;
	}
}
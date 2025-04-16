
window.Helper.Database.addIndex("CrmArticle_ArticleRelationship", ["ChildId"]);
window.Helper.Database.addIndex("CrmArticle_ArticleRelationship", ["RelationshipTypeKey", "ParentId"]);
window.Helper.Database.addIndex("CrmOrder_Offer", ["ContactId"]);
window.Helper.Database.addIndex("CrmOrder_Offer", ["ResponsibleUser"]);

window.Helper.Database.addIndex("CrmOrder_Order", ["ContactId"]);
window.Helper.Database.addIndex("CrmOrder_Order", ["ResponsibleUser"]);

window.Helper.Database.setTransactionId("CrmOrder_CalculationPosition",
	async function (calculationPosition: Crm.Order.Rest.Model.CrmOrder_CalculationPosition) {
		return calculationPosition.BaseOrderId;
	});
window.Helper.Database.setTransactionId("CrmOrder_OrderRecipient",
	async function(orderRecipient: Crm.Order.Rest.Model.CrmOrder_OrderRecipient) {
		return [orderRecipient.BaseOrderId];
	});
window.Helper.Database.setTransactionId("CrmOrder_Offer",
	async function (offer: Crm.Order.Rest.Model.CrmOrder_Offer) {
		return [offer.Id, offer.BillingAddressId, offer.ContactAddressId, offer.ContactId, offer.ContactPersonId, offer.DeliveryAddressId];
	});
window.Helper.Database.setTransactionId("CrmOrder_Order",
	async function (order: Crm.Order.Rest.Model.CrmOrder_Order) {
		return [order.Id, order.BillingAddressId, order.ContactAddressId, order.ContactId, order.ContactPersonId, order.DeliveryAddressId];
	});
window.Helper.Database.setTransactionId("CrmOrder_OrderItem",
	async function (orderItem: Crm.Order.Rest.Model.CrmOrder_OrderItem) {
		return [orderItem.OrderId];
	});
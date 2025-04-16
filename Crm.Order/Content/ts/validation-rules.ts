window.ko.validationRules.add("CrmOrder_Offer", function (entity: Crm.Order.Rest.Model.ObservableCrmOrder_Offer) {
	entity.OrderNo.extend({
		unique: {
			params: [window.database.CrmOrder_Offer, 'OrderNo', entity.Id],
			message: window.Helper.String.getTranslatedString("RuleViolation.Unique")
				.replace("{0}", window.Helper.String.getTranslatedString("OrderNo"))
		}
	});
	entity.OrderCategoryKey.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("OrderCategory")),
			onlyIf: function () {
				return entity.OrderEntryType() === "SingleDelivery" || entity.OrderEntryType() === "MultiDelivery";
			}
		}
	});
	entity.BillingAddressId.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("BillAddress")),
			onlyIf: function () {
				return window.Crm.Order.Settings.OrderBillingAddressEnabled;
			}
		}
	});
	entity.DeliveryAddressId.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryAddress")),
			onlyIf: function () {
				return window.Crm.Order.Settings.OrderDeliveryAddressEnabled;
			}
		}
	});
	ko.validation.addRule(entity.OrderEntryType, {
		rule: "required",
		message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("OrderEntryType")),
		params: true
	});
	ko.validation.addRule(entity.ContactId, {
		rule: "required",
		message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Contact")),
		params: true
	});
	ko.validation.addRule(entity.CurrencyKey, {
		rule: "required",
		message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Currency")),
		params: true
	});
	ko.validation.addRule(entity.ValidTo, {
		rule: "required",
		message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ValidTo")),
		params: true
	});
});
window.ko.validationRules.add("CrmOrder_Order", function (entity: Crm.Order.Rest.Model.ObservableCrmOrder_Order) {
	entity.OrderNo.extend({
		unique: {
			params: [window.database.CrmOrder_Order, 'OrderNo', entity.Id],
			message: window.Helper.String.getTranslatedString("RuleViolation.Unique")
				.replace("{0}", window.Helper.String.getTranslatedString("OrderNo"))
		}
	});
	entity.OrderCategoryKey.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("OrderCategory")),
			onlyIf: function () {
				return entity.OrderEntryType() === "SingleDelivery" || entity.OrderEntryType() === "MultiDelivery";
			}
		},
	});
	entity.BillingAddressId.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("BillAddress")),
			onlyIf: function () {
				return window.Crm.Order.Settings.OrderBillingAddressEnabled;
			}
		}
	});
	entity.DeliveryAddressId.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryAddress")),
			onlyIf: function () {
				return window.Crm.Order.Settings.OrderDeliveryAddressEnabled;
			}
		}
	});
	ko.validation.addRule(entity.OrderEntryType, {
		rule: "required",
		message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("OrderEntryType")),
		params: true
	});
	ko.validation.addRule(entity.CurrencyKey, {
		rule: "required",
		message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Currency")),
		params: true
	});
	entity.DeliveryDate.extend({
		validation: {
			message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
				.replace("{0}", window.Helper.String.getTranslatedString("OrderDate"))
				.replace("{1}", window.Helper.String.getTranslatedString("DeliveryDate").toLowerCase()),
			validator: function (val) {
				if (!!entity.DeliveryDate() && !!entity.OrderDate())
					return window.moment(val).add(1, "day").isAfter(entity.OrderDate());
				else
					return true;
			}
		}
	});
});
window.ko.validationRules.add("CrmOrder_OrderItem", function (entity: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem) {
	entity.ArticleNo.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Material"))
		}
	});
	entity.QuantityValue.extend({
		validation: {
			validator: function (val) {
				return val >= 0;
			},
			message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
				.replace("{0}", window.Helper.String.getTranslatedString("Discount")),
		}
	});
	entity.Price.extend({
		validation: {
			validator: function (val) {
				return val >= 0;
			},
			message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
				.replace("{0}", window.Helper.String.getTranslatedString("Price")),
		}
	});
	entity.Discount.extend({
		validation: {
			validator: function (val) {
				return val >= 0;
			},
			message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
				.replace("{0}", window.Helper.String.getTranslatedString("Discount")),
		}
	});
	entity.Discount.extend({
		validation: {
			validator: function (val) {
				return entity.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage ? val <= 100 : val <= entity.Price();
			},
			message: window.Helper.String.getTranslatedString("RuleViolation.DiscountBiggerThanPrice")
		}
	});
});

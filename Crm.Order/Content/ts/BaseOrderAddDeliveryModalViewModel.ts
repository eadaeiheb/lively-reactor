import {namespace} from "@Main/namespace";
import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";

export class BaseOrderAddDeliveryModalViewModel extends window.Main.ViewModels.ViewModelBase {
	parent: BaseOrderDetailsViewModel;
	deliveryDates: KnockoutObservableArray<Date>;
	deliveryDate = ko.observable<Date>(null);

	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.parent = parentViewModel;
		this.deliveryDates = parentViewModel.deliveryDates;
		this.deliveryDate.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryDate")),
				params: true
			}
		});
		this.deliveryDate.extend({
			validation: {
				validator: function (val, otherVals) {
					return !otherVals.find(function (x) {
						return window.moment(x).isSame(window.moment(val));
					});
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Unique").replace("{0}", window.Helper.String.getTranslatedString("DeliveryDate")),
				params: this.deliveryDates
			}
		});
	}

	async addDeliveryDate(): Promise<void> {
		const errors = window.ko.validation.group(this.deliveryDate);
		if (errors().length > 0) {
			errors.showAllMessages();
			return;
		}
		errors.showAllMessages(false);
		if (this.deliveryDates.indexOf(this.deliveryDate()) === -1) {
			if (this.deliveryDates.indexOf(null) >= 0) {
				await this.replaceNullDeliveryDate();
				return;
			}
			this.deliveryDates.push(this.deliveryDate());
		}
		$(".modal:visible").modal("hide");
		this.deliveryDate(null);
	}

	async replaceNullDeliveryDate(): Promise<void> {
		this.deliveryDates.splice(this.deliveryDates.indexOf(null), 1);
		for (const orderItem of this.parent.orderItems().filter(function (it) {
			return it.DeliveryDate() === null
		})) {
			window.database.attachOrGet(orderItem.innerInstance);
			orderItem.DeliveryDate(this.deliveryDate());
		}
		await window.database.saveChanges();
		this.deliveryDates.push(this.deliveryDate());
		$(".modal:visible").modal("hide");
		this.deliveryDate(null);
	}
}

namespace("Crm.Order.ViewModels").BaseOrderAddDeliveryModalViewModel = BaseOrderAddDeliveryModalViewModel;
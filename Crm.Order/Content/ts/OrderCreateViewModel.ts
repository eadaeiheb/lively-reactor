import {namespace} from "@Main/namespace";
import { Breadcrumb } from "@Main/breadcrumbs";

export class OrderCreateViewModel extends window.Crm.Order.ViewModels.BaseOrderCreateViewModel {
	order = this.baseOrder;
	numberingSequence(): string { return "CRM.Order"};

	async init(id?: string, params?: { companyId?: string }): Promise<void> {
		const order = window.database.CrmOrder_Order.defaultType.create();
		order.Id = window.$data.createGuid().toString().toLowerCase();
		order.OrderDate = new Date();
		this.order(order.asKoObservable());
		await super.init(id, params)
		this.order().ResponsibleUser(this.user().Id);
		await this.setBreadcrumbs();
		window.database.add(order);
	}

	async submit(): Promise<void> {
		this.loading(true);

		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			this.errors.scrollToError();
			this.errors.expandCollapsiblesWithErrors();
			return;
		}

		let orderNo = await window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Order.Settings.Order.OrderNoIsGenerated, window.Crm.Order.Settings.Order.OrderNoIsCreateable, this.order().OrderNo(), window.Crm.Order.ViewModels.OrderCreateViewModel.prototype.numberingSequence(), window.database.CrmOrder_Order, "OrderNo");
		if (orderNo !== null) {
			this.order().OrderNo(orderNo);
		}
		await super.submit();
		window.location.hash = "/Crm.Order/Order/DetailsTemplate/" + this.order().Id();
	}

	async setBreadcrumbs(): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.getTranslatedString("Order"), "Order::Index", "#/Crm.Order/OrderList/IndexTemplate"),
			new Breadcrumb(window.Helper.getTranslatedString("CreateOrder"), null, window.location.hash, null, null)
		]);
	};
}

namespace("Crm.Order.ViewModels").OrderCreateViewModel = OrderCreateViewModel;
import {namespace} from "@Main/namespace";
import {Breadcrumb} from "@Main/breadcrumbs";

export class OrderDetailsViewModel extends window.Crm.Order.ViewModels.BaseOrderDetailsViewModel {
	imageIndex = ko.observable<number>(0);
	order: KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Order> = this.baseOrder as KnockoutObservable<Crm.Order.Rest.Model.ObservableCrmOrder_Order>;
	orderId: string;
	isClosed = ko.computed<boolean>(() => this.order() != null && this.order().StatusKey() === "Closed");
	isEditable = ko.computed<boolean>(() => this.order() != null && !this.isClosed() && !this.order().ReadyForExport());

	constructor() {
		super();
	}

	async init(id?: string, params?: any): Promise<void> {
		window.Helper.Database.registerEventHandlers(this, {CrmOrder_Order: {afterUpdate: this.refresh}});
		this.orderId = id;
		if (this.orderId) {
			await this.refresh();
		} else {
			const newOrder = window.database.CrmOrder_Order.defaultType.create();
			window.database.add(newOrder);
			newOrder.Id = window.$data.createGuid().toString().toLowerCase();
			newOrder.OrderDate = new Date();
			this.orderId = newOrder.Id;
			this.baseOrder(newOrder.asKoObservable());
		}
		await super.init(id, params);
		await this.setBreadcrumbs();
	};

	async exportOrder(): Promise<void> {
		let confirm = await window.Helper.Confirm.genericConfirmAsync({
			text: window.Helper.String.getTranslatedString("ConfirmExportOrder"),
			type: "warning"
		});
		if (!confirm) {
			return;
		}
		this.loading(true);
		window.database.attachOrGet(this.baseOrder().innerInstance);
		this.baseOrder().ReadyForExport(true);
		await window.database.saveChanges();
		this.loading(false);
	}

	async cancelExport(): Promise<void> {
		this.loading(true);
		let latestOrder = await window.database.CrmOrder_Order.find(this.baseOrder().Id());
		if (latestOrder.IsExported === true) {
			await window.Helper.Confirm.genericConfirmAsync({
				text: window.Helper.String.getTranslatedString("OrderAlreadyExported"),
				type: "error"
			});
			this.baseOrder(latestOrder.asKoObservable());
			this.loading(false);
			return
		}
		window.database.attachOrGet(this.baseOrder().innerInstance);
		this.baseOrder().ReadyForExport(false);
		await window.database.saveChanges();
		this.loading(false);
	}

	async complete(): Promise<void> {
		if (!this.orderItems().length) {
			window.swal({
				title: window.Helper.String.getTranslatedString("CannotCompleteOrder"),
				text: window.Helper.String.getTranslatedString("NoOrderItemsInfo"),
				type: "warning",
				showCancelButton: false,
				confirmButtonText: window.Helper.String.getTranslatedString("Ok"),
				closeOnConfirm: true
			}, () => {
				return;
			});
		} else {
			window.swal({
				title: window.Helper.String.getTranslatedString("CloseOrder"),
				text: window.Helper.String.getTranslatedString("ReallyCloseOrder"),
				type: "warning",
				showCancelButton: true,
				confirmButtonText: window.Helper.String.getTranslatedString("Complete"),
				cancelButtonText: window.Helper.String.getTranslatedString("Cancel")
			}, async isConfirm => {
				if (isConfirm) {
					window.database.attachOrGet(this.order().innerInstance);
					this.order().StatusKey("Closed");
					await window.database.saveChanges()
					this.showSnackbar(window.Helper.String.getTranslatedString("OrderCompleted"));
				} else {
					return;
				}
			});
		}
	};

	async refresh(): Promise<void> {
		await super.refresh();
		let order = await window.database.CrmOrder_Order
			.include("Company")
			.include("Person")
			.find(this.orderId);
		this.order(order.asKoObservable());
	};

	async setBreadcrumbs(): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.String.getTranslatedString("Order"), "Order::Index", "#/Crm.Order/OrderList/IndexTemplate"),
			new Breadcrumb(this.order().OrderNo(), null, window.location.hash)
		]);
	};
}

namespace("Crm.Order.ViewModels").OrderDetailsViewModel = OrderDetailsViewModel;
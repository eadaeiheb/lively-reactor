import {namespace} from "@Main/namespace";
import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";

export class BaseOrderSaveModalViewModel extends window.Main.ViewModels.ViewModelBase {
	addresses = ko.observableArray<Crm.Rest.Model.ObservableCrm_Address>([]);
	baseOrderId: string
	baseOrder = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order>(null);
	errors = ko.validation.group(this.baseOrder, {deep: true});
	totalPrice: KnockoutComputed<number>;
	parentViewModel: BaseOrderDetailsViewModel;
	lookups: LookupType = {
		addressTypes: {$tableName: "Crm_AddressType"},
		regions: {$tableName: "Main_Region"},
		countries: {$tableName: "Main_Country"}
	};
	originalContactPersonId: string;

	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.baseOrderId = parentViewModel.baseOrder().Id();
		if (parentViewModel.baseOrder().innerInstance.entityState === window.$data.EntityState.Added) {
			this.baseOrder(parentViewModel.baseOrder());
		}
		this.totalPrice = parentViewModel.totalPrice;
		this.parentViewModel = parentViewModel;
	}

	personAutocompleteFilter(query: $data.Queryable<Crm.Rest.Model.Crm_Person>, term: string): $data.Queryable<Crm.Rest.Model.Crm_Person> {
		const contactId = this.baseOrder().ContactId();
		if (contactId) {
			query = query.filter(function (x) {
				return x.ParentId === this.parentId;
			}, {parentId: this.baseOrder().ContactId()});
		}
		if (term) {
			query = query.filter('it.Surname.toLowerCase().contains(this.term)||it.Firstname.toLowerCase().contains(this.term)', {term: term});
		}
		return query.filter(function (x) {
			return x.IsRetired === false;
		});
	};

	onPersonSelect(person: Crm.Rest.Model.Crm_Person): void {
		if (person) {
			this.baseOrder().ContactId(person.ParentId);
		}
		this.parentViewModel.contactPerson(person);
	};

	async init(): Promise<void> {
		const viewModel = this;

		async function loadAddresses(companyId: string): Promise<void> {
			if (companyId) {
				let results = await window.database.Crm_Address
					.filter(function (x) {
						return x.CompanyId === this.companyId;
					}, {companyId: companyId})
					.toArray();
				viewModel.addresses(results.map(function (x) {
					return x.asKoObservable();
				}));
			} else {
				viewModel.addresses([]);
			}
		}

		await loadAddresses(viewModel.baseOrder().ContactId());
		if (viewModel.baseOrder().PrivateDescription() === null && window.Crm.Order.Settings.OrderPrivateDescriptionEnabled === true) {
			viewModel.baseOrder().PrivateDescription(viewModel.getDefaultPrivateDescription());
		}
		viewModel.baseOrder().ContactId.subscribe(function (contactId) {
			viewModel.baseOrder().ContactPersonId(null);
			loadAddresses(contactId);
		});
		viewModel.originalContactPersonId = viewModel.baseOrder().ContactPersonId();
		
		await window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	};

	getDefaultPrivateDescription(): string {
		return window.Globalize.formatDate(new Date());
	};
	
	addEmailRecipient(recipientEmail: string): void {
		const recipient = window.database.CrmOrder_OrderRecipient.defaultType.create();
		recipient.BaseOrderId = this.baseOrder().Id();
		recipient.Email = recipientEmail;
		recipient.ContactPersonId = this.baseOrder().ContactPersonId();
		window.database.add(recipient);
		this.parentViewModel.orderRecipients.push(recipient.asKoObservable());
	};

	removeOldRecipient(): void {
		let oldContactRecipient = ko.utils.arrayFirst(this.parentViewModel.orderRecipients(), recipient => recipient.ContactPersonId() === this.originalContactPersonId);
		if (!!oldContactRecipient && !!oldContactRecipient.innerInstance) {
			let index = this.parentViewModel.orderRecipients().indexOf(oldContactRecipient);
			this.parentViewModel.orderRecipients().splice(index,1)
			window.database.remove(oldContactRecipient.innerInstance);
		}
	};

	getPrimaryEmail(emails: Crm.Rest.Model.Crm_Email[]): string {
		if (emails.length === 0) {
			return null;
		}
		return ko.unwrap(window.Helper.Address.getPrimaryCommunication(emails).Data);
	};
	
	async save(): Promise<void> {
		this.loading(true);
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			return;
		}
		this.baseOrder().Price(this.baseOrder().Price() || this.totalPrice());
		
		if (!this.baseOrder().ContactPersonId() || this.baseOrder().ContactPersonId() != this.originalContactPersonId) {
			this.removeOldRecipient();
		}
		
		if (this.baseOrder().ContactPersonId()) {
			let contactPerson = await window.database.Crm_Person.include("Emails").find(this.baseOrder().ContactPersonId());
			var email = this.getPrimaryEmail(contactPerson.Emails);
			if (email) {
				this.addEmailRecipient(email);
			}
		}
		
		await window.database.saveChanges();
		this.loading(false);
		$(".modal:visible").modal("hide");
	};

	dispose(): void {
		if (this.baseOrder().innerInstance.entityState !== window.$data.EntityState.Added) {
			window.database.detach(this.baseOrder().innerInstance);
		}
	};
}

namespace("Crm.Order.ViewModels").BaseOrderSaveModalViewModel = BaseOrderSaveModalViewModel;
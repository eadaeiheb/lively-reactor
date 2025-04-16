import {namespace} from "@Main/namespace";

export class BaseOrderCreateViewModel extends window.Main.ViewModels.ViewModelBase {
	addresses = ko.observableArray<Crm.Rest.Model.ObservableCrm_Address>([]);
	baseOrder = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order>(null);
	errors = ko.validation.group(this.baseOrder, {deep: true});
	user = ko.observable<Main.Rest.Model.Main_User>(null);
	lookups: LookupType = {
		addressTypes: {$tableName: "Crm_AddressType"},
		regions: {$tableName: "Main_Region"},
		countries: {$tableName: "Main_Country"},
		currencies: {$tableName: "Main_Currency"},
		orderCategories: {$tableName: "CrmOrder_OrderCategory"},
		orderEntryTypes: {$tableName: "CrmOrder_OrderEntryType"}
	};

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
		this.baseOrder().ContactId(person.ParentId);
	};

	async init(id?: string, params?: { companyId?: string }): Promise<void> {
		let user = await window.Helper.User.getCurrentUser();
		this.user(user);
		this.baseOrder().ContactId.subscribe(async companyId => {
			if (companyId) {
				let addresses = await window.database.Crm_Address
					.filter(function (x) {
						return x.CompanyId === this.companyId;
					}, {companyId: companyId})
					.toArray();
				this.addresses(addresses.map(x => x.asKoObservable()));
				const standardAddress = window.ko.utils.arrayFirst(this.addresses(), function (address) {
					return address.IsCompanyStandardAddress();
				});
				const standardAddressId = standardAddress ? standardAddress.Id() : null;
				this.baseOrder().BillingAddressId(this.baseOrder().BillingAddressId() || standardAddressId);
				this.baseOrder().DeliveryAddressId(this.baseOrder().DeliveryAddressId() || standardAddressId);
			} else {
				this.addresses([]);
			}
		});
		let oldContactId = this.baseOrder().ContactId();
		this.baseOrder().ContactId.subscribe(value => {
			if (oldContactId) {
				this.baseOrder().ContactPersonId(null);
			}
			oldContactId = value;
		});
		if (params.companyId) {
			this.baseOrder().ContactId(params.companyId);
		}
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		this.baseOrder().CurrencyKey(window.Helper.Lookup.getDefaultLookupValueSingleSelect(this.lookups.currencies, this.baseOrder().CurrencyKey()));
		this.baseOrder().OrderCategoryKey(window.Helper.Lookup.getDefaultLookupValueSingleSelect(this.lookups.orderCategories, this.baseOrder().OrderCategoryKey()));
		this.baseOrder().OrderEntryType(window.Helper.Lookup.getDefaultLookupValueSingleSelect(this.lookups.orderEntryTypes, this.baseOrder().OrderEntryType()));
		this.baseOrder().DiscountType(window.Crm.Article.Model.Enums.DiscountType.NoDiscount);
	};

	addressDisplay(address: Crm.Rest.Model.ObservableCrm_Address): string {
		const addressParts = [];
		if (!!address.Name1()) {
			addressParts.push(address.Name1());
		}
		if (!!address.Street()) {
			addressParts.push(address.Street());
		}
		if (!!address.ZipCode() || !!address.City()) {
			addressParts.push((address.ZipCode() || "") + " " + (address.City() || ""));
		}
		return addressParts.map(function (x) {
			return x.trim();
		}).join(", ");
	};

	cancel(): void {
		window.database.detach(this.baseOrder().innerInstance);
		window.history.back();
	};

	getDefaultPrivateDescription(): string {
		return window.Globalize.formatDate(new Date());
	};
	
	getPrimaryEmail(emails: Crm.Rest.Model.Crm_Email[]): string {
		if (emails.length === 0) {
			return null;
		}
		return ko.unwrap(window.Helper.Address.getPrimaryCommunication(emails).Data);
	};

	async submit(): Promise<void> {
		this.loading(true);
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			throw this.errors();
		}
		if (this.baseOrder().ContactPersonId()) {
			let contactPerson = await window.database.Crm_Person.include("Emails").find(this.baseOrder().ContactPersonId());
			var email = this.getPrimaryEmail(contactPerson.Emails);
			if (email) {
				const recipient = window.database.CrmOrder_OrderRecipient.defaultType.create();
				recipient.BaseOrderId = this.baseOrder().Id();
				recipient.Email = email;
				recipient.ContactPersonId = this.baseOrder().ContactPersonId();
				window.database.add(recipient);
				this.baseOrder().OrderRecipients.push(recipient.asKoObservable());
			}
		}

		await window.database.saveChanges();
	};
}

namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel = BaseOrderCreateViewModel;

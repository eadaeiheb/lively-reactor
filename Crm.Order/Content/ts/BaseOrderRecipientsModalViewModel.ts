import {namespace} from "@Main/namespace";
import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";

export class BaseOrderRecipientsModalViewModel extends window.Main.ViewModels.ViewModelBase {
	customRecipient = ko.observable<boolean>(false);
	sending = ko.observable<boolean>(false);
	sendConfirmation: () => Promise<void>;
	email = ko.observable<string>(null).extend({
		email: {params: true, message: window.Helper.String.getTranslatedString("RuleViolation.InvalidEmail")}
	});
	customEmail = ko.observable<string>(null).extend({
		email: {params: true, message: window.Helper.String.getTranslatedString("RuleViolation.InvalidEmail")}
	});
	orderRecipients = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderRecipient>([]);
	baseOrder = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order>(null);
	company = ko.observable<Crm.Rest.Model.ObservableCrm_Company>(null);
	persons = ko.pureComputed<Crm.Rest.Model.ObservableCrm_Person[]>(() => {
		return this.company() ? this.company().Staff() : [];
	});
	selectableContacts = ko.pureComputed<{ Contact: Crm.Rest.Model.ObservableCrm_Person | Crm.Rest.Model.ObservableCrm_Company, DisplayName: string, Value: string }[]>(() => {
		if (!this.baseOrder()) {
			return [];
		}
		const selectedEmails = this.orderRecipients().reduce(function (map, item) {
			map[item.Email()] = true;
			return map;
		}, {});
		const personEmails = this.getPersonsEmails();
		const companyEmails = this.getCompanyEmails();
		const result: { Contact: Crm.Rest.Model.ObservableCrm_Person | Crm.Rest.Model.ObservableCrm_Company, DisplayName: string, Value: string }[] = [];
		Object.keys(personEmails).sort().forEach(function (email) {
			if (selectedEmails[email]) {
				return;
			}
			result.push({
				Contact: personEmails[email].Contact,
				DisplayName: personEmails[email].DisplayName,
				Value: email
			});
		});
		Object.keys(companyEmails).sort().forEach(function (email) {
			if (selectedEmails[email]) {
				return;
			}
			result.push({
				Contact: companyEmails[email].Contact,
				DisplayName: companyEmails[email].DisplayName,
				Value: email
			});
		});
		return result;
	});
	errors = ko.validation.group(this.baseOrder, {deep: true});
	parentViewModel: BaseOrderDetailsViewModel;

	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
		this.orderRecipients(parentViewModel.orderRecipients());
		this.baseOrder(parentViewModel.baseOrder());
		this.sendConfirmation = parentViewModel.sendConfirmation.bind(parentViewModel);
	}

	refreshParentViewModel(): void {
		this.parentViewModel.init(this.baseOrder().Id());
	};

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		this.sending(params.sending === "true");
		if (this.baseOrder().ContactId()) {
			let company = await window.database.Crm_Company
				.include2("Staff.filter(function(x) { return x.IsRetired === false })")
				.include("Staff.Emails")
				.include("Emails")
				.find(this.baseOrder().ContactId());
			this.company(company.asKoObservable());
		}
	};

	dispose(): void {
		window.database.detach(this.baseOrder().innerInstance);
		this.orderRecipients().forEach(x => window.database.detach(x.innerInstance));
	};

	addRecipient(): void {
		let recipientEmail = null;
		if (this.email() && this.email.isValid()) {
			recipientEmail = this.email();
		}
		else if (this.customEmail() && this.customEmail.isValid()) {
			recipientEmail = this.customEmail();
		}
		else {
			return;
		}

		const index = this.orderRecipients
			.indexOf(ko.utils.arrayFirst(this.orderRecipients(),
				item => {
					return item.Email() === recipientEmail;
				}));
		if (recipientEmail && index === -1) {
			const recipient = window.database.CrmOrder_OrderRecipient.defaultType.create();
			recipient.BaseOrderId = this.baseOrder().Id();
			recipient.Email = recipientEmail;
			if (this.email()) {
				recipient.ContactPersonId = ko.utils.arrayFirst(this.selectableContacts(), contact => contact.Value === recipientEmail).Contact.Id();
			}
			window.database.add(recipient);
			this.orderRecipients.push(recipient.asKoObservable());
			this.orderRecipients.sort((a, b) => a.Email().localeCompare(b.Email()));
			this.email(null);
			this.customEmail(null);
		}
	};

	removeRecipient(recipient: Crm.Order.Rest.Model.ObservableCrmOrder_OrderRecipient): void {
		const index = this.orderRecipients
			.indexOf(ko.utils.arrayFirst(this.orderRecipients(),
				item => {
					return item === recipient;
				}));
		this.orderRecipients.splice(index, 1);
		window.database.remove(recipient.innerInstance);
	};

	async save(): Promise<void> {
		this.loading(true);

		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			return;
		}

		try {
			await window.database.saveChanges();
			this.loading(false);
			if (this.sending()) {
				await this.sendConfirmation();
			}
			$(".modal:visible").modal("hide");
		} catch {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		}
	};

	getPersonsEmails(): { [key: string]: { Contact: Crm.Rest.Model.ObservableCrm_Person, DisplayName: string } } {
		return this.persons().reduce(function (emails, person) {
			const email = window.ko.unwrap((window.Helper.Address.getPrimaryCommunication(person.Emails) || {}).Data);
			if (email) {
				const name = window.Helper.Person.getDisplayName(person) + " (" + email + ")";
				if (!emails[email]) {
					emails[email] = {Contact: person, DisplayName: name};
				}
			}
			return emails;
		}, {});
	};

	getCompanyEmails(): { [key: string]: { Contact: Crm.Rest.Model.ObservableCrm_Company, DisplayName: string } } {
		const company = this.company();
		const emails = {};
		if (!company) {
			return emails;
		}
		(ko.unwrap(company.Emails) || []).forEach(function (item) {
			const email = item.Data();
			const name = window.Helper.Company.getDisplayName(company) + " (" + email + ")";
			if (!emails[email]) {
				emails[email] = {Contact: company, DisplayName: name};
			}
		});
		return emails;
	};

	toggleCustomRecipient(): void {
		this.customRecipient(!this.customRecipient());
		this.email(null);
		this.customEmail(null);
	};
}

namespace("Crm.Order.ViewModels").BaseOrderRecipientsModalViewModel = BaseOrderRecipientsModalViewModel;
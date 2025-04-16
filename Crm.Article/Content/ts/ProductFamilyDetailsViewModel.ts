import {Breadcrumb} from "@Main/breadcrumbs";
import {namespace} from "@Main/namespace";
import {HelperString} from "@Main/helper/Helper.String";
import {HelperLookup} from "@Main/helper/Helper.Lookup";

export class ProductFamilyDetailsViewModel extends window.Crm.ViewModels.ContactDetailsViewModel {

	lookups: LookupType = {
		productFamilyStatuses: {$tableName: "CrmArticle_ProductFamilyStatus"},
		languages: {$tableName: "Main_Language", $filterExpression: "it.IsSystemLanguage === true"}
	};
	productFamily = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_ProductFamily>(null);
	descriptions = ko.observableArray<{ Value: KnockoutObservable<string>, Language: string, Name: string, ProductFamilyDescription: Crm.Article.Rest.Model.Lookups.CrmArticle_ProductFamilyDescription }>([]);
	productFamilyDescriptions = ko.observableArray<Crm.Article.Rest.Model.Lookups.CrmArticle_ProductFamilyDescription>([]);
	title = ko.observable<string>(null);

	constructor() {
		super();
		this.contactType("ProductFamily");
	}

	settableStatuses: KnockoutComputed<Crm.Article.Rest.Model.Lookups.CrmArticle_ProductFamilyStatus[]> = window.ko.pureComputed(() => {
		return this.lookups.productFamilyStatuses.$array.filter(function (status: Crm.Article.Rest.Model.Lookups.CrmArticle_ProductFamilyStatus) {
			return status !== null && status.Key !== null;
		});
	});
	canSetStatus: KnockoutComputed<boolean> = window.ko.pureComputed(() => {
		return this.settableStatuses().length > 1;
	});

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		this.contactId(id);
		const productFamily = await window.database.CrmArticle_ProductFamily
			.include("ParentProductFamily")
			.include("ResponsibleUserUser")
			.include2("ChildProductFamilies.orderBy(function(x) { return x.Name; })")
			.find(id);
		this.productFamily(productFamily.asKoObservable());
		this.contact(this.productFamily());
		this.contactName(this.productFamily().Name());

		await HelperLookup.getLocalizedArrayMaps(this.lookups);
		const productFamilyDescriptions = await window.database.CrmArticle_ProductFamilyDescription
			.filter("it.Key === this.Key", {Key: this.productFamily().Id()})
			.toArray();
		this.productFamilyDescriptions(productFamilyDescriptions);
		this.descriptions(this.lookups.languages.$array.slice(1).map(function (x) {
			const productFamilyDescription = productFamilyDescriptions.find(function (it) {
				return it.Language === x.Key;
			});
			return {
				Value: window.ko.observable(productFamilyDescription ? productFamilyDescription.Value : "").extend({
					maxLength: {
						params: 150,
						message: window.Helper.String.getTranslatedString("RuleViolation.MaxLength").replace("{0}", window.Helper.String.getTranslatedString("Value")),
					}
				}),
				Language: x.Key,
				Name: x.Value,
				ProductFamilyDescription: productFamilyDescription
			};
		}));
		await this.setVisibilityAlertText();
		this.title = this.productFamily().Name;
		await this.setBreadcrumbs(id, this.title());
		await super.init(id, params);
	}

	async setBreadcrumbs(id: string, title: string): Promise<void> {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(HelperString.getTranslatedString("ProductFamily"), "ProductFamily::Index", "#/Crm.Article/ProductFamilyList/IndexTemplate"),
			new Breadcrumb(title, null, window.location.hash, null, id)
		]);
	};

	async onAfterSavePmbBlock(): Promise<void> {
		await this.init(this.contactId());
	};

	onCancelPmbBlock(): void {
		this.descriptions().forEach(description => {
			if (description.ProductFamilyDescription){
				description.Value(description.ProductFamilyDescription.Value)
			} else {
				description.Value("");
			}
		});
	};

	onSaveDescriptions(): void {
		this.loading(true);

		let errors = ko.validation.group(this.descriptions(), {deep: true});
		if (errors().length > 0) {
			errors.showAllMessages();
			errors.scrollToError();
			throw errors();
		}

		this.descriptions().forEach(description => {
			if (this.productFamilyDescriptions().map(productFamilyDescription => productFamilyDescription.Language).includes(description.Language)) {
				const productFamilyDescription = this.productFamilyDescriptions().find(productFamilyDescription => productFamilyDescription.Language === description.Language);
				window.database.attachOrGet(productFamilyDescription);
				productFamilyDescription.Key = this.productFamily().Id();
				productFamilyDescription.Value = window.ko.unwrap(description.Value);
				if (!window.ko.unwrap(description.Value)) {
					window.database.remove(productFamilyDescription);
				}
			} else if (window.ko.unwrap(description.Value)) {
				const productFamilyDescription = window.database.CrmArticle_ProductFamilyDescription.defaultType.create();
				productFamilyDescription.Key = this.productFamily().Id();
				productFamilyDescription.Language = description.Language;
				productFamilyDescription.Value = window.ko.unwrap(description.Value);
				window.database.add(productFamilyDescription);
			}
		});
	}

	async setStatus(status: Crm.Article.Rest.Model.Lookups.CrmArticle_ProductFamilyStatus): Promise<void> {
		const currentStatus = this.productFamily().StatusKey();
		if (status && status.Key !== currentStatus) {
			window.database.attachOrGet(this.productFamily().innerInstance);
			this.productFamily().StatusKey(status.Key);
			try {
				this.loading(true);
				await window.database.saveChanges();
				this.loading(false);
			} catch (e) {
				this.loading(false);
				swal(HelperString.getTranslatedString("Error"), (e as Error).message, "error");
			}
		}
	}

}

namespace("Crm.Article.ViewModels").ProductFamilyDetailsViewModel ||= ProductFamilyDetailsViewModel;


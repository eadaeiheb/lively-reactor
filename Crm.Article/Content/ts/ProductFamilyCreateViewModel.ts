import {namespace} from "@Main/namespace";
import {HelperLookup} from "@Main/helper/Helper.Lookup";
import {HelperString} from "@Main/helper/Helper.String";
import { Breadcrumb } from "@Main/breadcrumbs";

export class ProductFamilyCreateViewModel extends window.Main.ViewModels.ViewModelBase {
	lookups: LookupType = {
		productFamilyStatuses: {
			$tableName: "CrmArticle_ProductFamilyStatus"
		}
	}
	productFamily = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_ProductFamily>(null);
	errors: CustomKnockoutValidationErrors;

	constructor() {
		super();
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
		await this.setBreadcrumbs(params.parentId, params.parentName);
		const productFamily = window.database.CrmArticle_ProductFamily.defaultType.create();
		productFamily.LastActivity = new Date();
		productFamily.ResponsibleUser = window.Helper.User.getCurrentUserName();
		productFamily.StatusKey = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.productFamilyStatuses, productFamily.StatusKey);
		window.database.add(productFamily);
		this.productFamily(productFamily.asKoObservable());

		if (params) {
			if (params.parentId) {
				this.productFamily().ParentId(params.parentId);
			}
			if (params.parentName) {
				this.productFamily().ParentName(params.parentName);
			}
		}

		this.productFamily().Name.extend({
			validation: {
				async: true,
				validator: function (name, params, callback) {
					if (!name) {
						callback(true);
						return;
					}
					window.database.CrmArticle_ProductFamily
						.filter(function (productFamily) {
							return productFamily.Name === this.name.trim();
						}, {name: name})
						.count()
						.then(function (productFamily) {
							callback(productFamily === 0);
						});
				},
				message: HelperString.getTranslatedString("RuleViolation.Unique").replace("{0}", HelperString.getTranslatedString("ProductFamily"))
			}
		});
	}

	cancel(): void {
		window.database.detach(this.productFamily().innerInstance);
		window.history.back();
	}

	async submit(): Promise<void> {
		this.loading(true);
		this.errors = window.ko.validation.group(this.productFamily, {deep: true});
		await this.errors.awaitValidation();

		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			this.errors.scrollToError();
			return;
		}

		try {
			await window.database.saveChanges();
			window.location.hash = "/Crm.Article/ProductFamily/DetailsTemplate/" + this.productFamily().Id();

			if (ko.unwrap(this.productFamily().ParentId) !== null) {
				this.showSnackbar(HelperString.getTranslatedString("ChildProductFamilyCreated"));
			} else {
				this.showSnackbar(HelperString.getTranslatedString("ProductFamilyCreated"));
			}
		} catch (e) {
			this.loading(false);
			swal(HelperString.getTranslatedString("Error"), (e as Error).message, "error");
		}
	}

	async setBreadcrumbs(parentId: string, parentName: string): Promise<void> {
		const currentPageTitle = parentId
			? window.Helper.getTranslatedString("CreateChildProductFamily")
			: window.Helper.getTranslatedString("CreateProductFamily");
		const parentPageElement = parentId
			? new Breadcrumb(parentName, "ProductFamily::Index", "#/Crm.Article/ProductFamilyList/IndexTemplate", null, parentId)
			: new Breadcrumb(window.Helper.getTranslatedString("ProductFamily"), "ProductFamily::Index", "#/Crm.Article/ProductFamilyList/IndexTemplate");

		await window.breadcrumbsViewModel.setBreadcrumbs([
			parentPageElement,
			new Breadcrumb(currentPageTitle, null, window.location.hash, null, null)
		]);
	};
}

namespace("Crm.Article.ViewModels").ProductFamilyCreateViewModel = ProductFamilyCreateViewModel;

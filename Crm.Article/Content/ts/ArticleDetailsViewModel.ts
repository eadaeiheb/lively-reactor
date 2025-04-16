import {Breadcrumb} from "@Main/breadcrumbs";
import {namespace} from "@Main/namespace";
import {HelperString} from "@Main/helper/Helper.String";
import { HelperArticle } from "./helper/Helper.Article";

export class ArticleDetailsViewModel extends window.Crm.ViewModels.ContactDetailsViewModel {

	descriptions = ko.observableArray<{
		Value: KnockoutObservable<string>,
		Language: string,
		Name: string,
		ArticleDescription: Crm.Article.Rest.Model.Lookups.CrmArticle_ArticleDescription
	}>([]);
	currentUser = ko.observable<Main.Rest.Model.Main_User>(null);
	article = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Article>(null);
	thumbnailDocumentAttribute = ko.observable<Crm.Rest.Model.ObservableCrm_DocumentAttribute>(null);

	lookups: LookupType = {
		languages: {$tableName: "Main_Language", $filterExpression: "it.IsSystemLanguage === true", $array: undefined},
		articleGroups01: {$tableName: "CrmArticle_ArticleGroup01"},
		articleGroups02: {$tableName: "CrmArticle_ArticleGroup02"},
		articleGroups03: {$tableName: "CrmArticle_ArticleGroup03"},
		articleGroups04: {$tableName: "CrmArticle_ArticleGroup04"},
		articleGroups05: {$tableName: "CrmArticle_ArticleGroup05"},
		articleTypes: {$tableName: "CrmArticle_ArticleType"},
		currencies: {$tableName: "Main_Currency"},
		articleRelationshipTypes: {$tableName: "CrmArticle_ArticleRelationshipType"},
		quantityUnit: {$tableName: "CrmArticle_QuantityUnit"},
		vatLevel: {$tableName: "CrmArticle_VATLevel"},
		regions: {$tableName: "Main_Region"},
		companyTypes: {$tableName: "Crm_CompanyType"},
		countries: {$tableName: "Main_Country"},
		articleCompanyRelationshipTypes: { $tableName: "CrmArticle_ArticleCompanyRelationshipType" },
		skills: { $tableName: "Main_Skill" },
		assets: { $tableName: "Main_Asset" },
		drivinglicenceCategories: { $tableName: "CrmArticle_DrivingLicenceCategory" }

	};
	title = ko.observable<string>(null);
	additionalTitle = ko.observable<string>(null);

	constructor() {
		super();
		this.contactType("Article");
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		this.currentUser(await window.Helper.User.getCurrentUser());
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);

		const articleData = await window.database.CrmArticle_Article
			.include("ProductFamily")
			.include("Station")
			.include("QuantityUnitEntry")
			.include2("Tags.orderBy(function(x) { return x.Name; })")
			.include2('DocumentAttributes.filter(function(it2) { return it2.UseForThumbnail == true})')
			.include('DocumentAttributes.FileResource')
			.find(id);
		this.article(articleData.asKoObservable());
		this.article().ItemNo.subscribe(function () {
			this.setTitle();
		}, this);
		this.article().Description.subscribe(function () {
			this.setTitle();
		}, this);

		this.contactId(this.article().Id());
		this.setTitle();

		const articleType = this.lookups.articleTypes.$array.find(function (x) {
			return x.Key === articleData.ArticleTypeKey;
		});
		this.additionalTitle = ko.observable<string>(articleType ? articleType.Value : "");
		await this.setBreadcrumbs(id, this.title());
		this.contact(this.article());

		const descriptions = await this.getArticleDescriptions(this.article().ItemNo());
		const articleDescriptionObjects = this.createDescriptionObjects(descriptions);
		this.descriptions(articleDescriptionObjects);

		if (this.article().DocumentAttributes().length > 0) {
			this.thumbnailDocumentAttribute(this.article().DocumentAttributes()[0]);
		}
	}

	async getArticleDescriptions(key: string): Promise<Crm.Article.Rest.Model.Lookups.CrmArticle_ArticleDescription[]> {
		return await window.database.CrmArticle_ArticleDescription
			.filter("it.Key == this.Key", {Key: key})
			.toArray();
	}

	createDescriptionObjects(descriptions: Crm.Article.Rest.Model.Lookups.CrmArticle_ArticleDescription[]): any[] {
		return this.lookups.languages.$array.slice(1).map(function (x) {
			const articleDescription = descriptions.find(function (it) {
				return it.Language === x.Key;
			});
			return {
				Value: window.ko.observable(articleDescription ? articleDescription.Value : ""),
				Language: x.Key,
				Name: x.Value,
				ArticleDescription: articleDescription
			};
		});

	}
	async setBreadcrumbs(id: string, title: string): Promise<void> {
		if (this.article().ArticleTypeKey() === "Tool" || this.article().ArticleTypeKey() === "Vehicle") {
			await window.breadcrumbsViewModel.setBreadcrumbs([
				new Breadcrumb(HelperString.getTranslatedString("VehiclesAndTools"), "Article::Index", "#/Crm.Article/ArticleList/IndexTemplate?filterByType=VehicleAndTool"),
				new Breadcrumb(title, null, window.location.hash, null, id)
			]);
		}
		else {
			await window.breadcrumbsViewModel.setBreadcrumbs([
				new Breadcrumb(HelperString.getTranslatedString("Article"), "Article::Index", "#/Crm.Article/ArticleList/IndexTemplate"),
				new Breadcrumb(HelperArticle.getArticleAutocompleteDisplay(this.article().innerInstance), null, window.location.hash, null, id)

			]);
		}
	}
	
	setTitle(): void {
		this.title(HelperArticle.getArticleAutocompleteDisplay(this.article().innerInstance));
	}
	onSave(): void {
		this.descriptions().forEach(description => {
			if (window.ko.unwrap(description.Value) === "" && description.ArticleDescription === undefined)
				return;
			if (description.ArticleDescription) {
				window.database.attachOrGet(description.ArticleDescription);
				description.ArticleDescription.Value = window.ko.unwrap(description.Value);
				description.ArticleDescription.Key = this.article().ItemNo();
				description.ArticleDescription.Language = description.Language;
				if (!window.ko.unwrap(description.Value)) {
					window.database.remove(description.ArticleDescription);
				}
			} else {
				const articleDescription = window.database.CrmArticle_ArticleDescription.defaultType.create();
				articleDescription.Key = this.article().ItemNo();
				articleDescription.Language = description.Language;
				articleDescription.Value = window.ko.unwrap(description.Value);
				window.database.add(articleDescription);
			}
		
		});
	}

	async reloadProductFamily(): Promise<void> {
		const id = this.article().ProductFamilyKey();
		if (id) {
			const productFamily = await window.database.CrmArticle_ProductFamily.find(id);
			this.article().ProductFamily(productFamily.asKoObservable());
		} else {
			this.article().ProductFamily(null);
		}
	}

	getSkillsFromKeys(keys: string[]): Select2AutoCompleterResult[] {
		return this.lookups.skills.$array.filter(function (x) {
			return keys.includes(x.Key);
		}).map(window.Helper.Lookup.mapLookupForSelect2Display);
	};
	getAssetsFromKeys(keys: string[]): Select2AutoCompleterResult[] {
		return this.lookups.assets.$array.filter(function (x) {
			return keys.includes(x.Key);
		}).map(window.Helper.Lookup.mapLookupForSelect2Display);
	};

	getTuvCaption(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): string {
		return article.ArticleTypeKey() === 'Vehicle' ? HelperString.getTranslatedString("VehicleTuv") : HelperString.getTranslatedString("ToolTuv");
	}

	/* ArticleImageModal functions -> */
	getDocumentAttributeCount(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): number {
		return this.thumbnailDocumentAttribute() ? 1 : 0;
	}

	getDocumentAttributeByCurrentIndex(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): Crm.Rest.Model.ObservableCrm_DocumentAttribute {
		return this.thumbnailDocumentAttribute();
	}
	/* <- ArticleImageModal functions */

	refreshThumbnailDocumentAttribute(items: Crm.Rest.Model.ObservableCrm_DocumentAttribute[]) {
		const thumbnailDocumentAttribute = items.find(x => x.UseForThumbnail());
		if (thumbnailDocumentAttribute) {
			this.thumbnailDocumentAttribute(thumbnailDocumentAttribute);
		}
		else {
			this.thumbnailDocumentAttribute(null);
		}
	}

	onQuantityUnitEntrySelect(quantityUnitGroup: Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry) {
		// @ts-ignore
		this.QuantityUnitEntry(quantityUnitGroup?.asKoObservable())
		// @ts-ignore
		this.QuantityUnitKey(quantityUnitGroup?.QuantityUnitKey)
		// @ts-ignore
		this.QuantityStep(quantityUnitGroup != null ? quantityUnitGroup.QuantityStep : 0)
	}
}

namespace("Crm.Article.ViewModels").ArticleDetailsViewModel ||= ArticleDetailsViewModel;

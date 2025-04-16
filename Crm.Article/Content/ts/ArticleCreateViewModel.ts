import {namespace} from "@Main/namespace";
import {HelperLookup} from "@Main/helper/Helper.Lookup";
import {HelperString} from "@Main/helper/Helper.String";
import { Breadcrumb } from "@Main/breadcrumbs";

export class ArticleCreateViewModel extends window.Main.ViewModels.ViewModelBase {

	article = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Article>(null);
	errors = ko.validation.group(this.article, {deep: true});
	translation = ko.observable<boolean>(false);
	descriptions = ko.observableArray<{
		Value: KnockoutObservable<string>,
		Language: string,
		Name: string,
		ArticleDescription: Crm.Article.Rest.Model.Lookups.CrmArticle_ArticleDescription
	}>([]);
	articleDescriptions = ko.observableArray<Crm.Article.Rest.Model.Lookups.ObservableCrmArticle_ArticleDescription>([]);
	articles = ko.observableArray<Crm.Article.Rest.Model.ObservableCrmArticle_Article>([]);
	lookups: LookupType = {
		articleTypes: {$tableName: "CrmArticle_ArticleType"},
		currencies: {$tableName: "Main_Currency"},
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
		vatLevels: {$tableName: "CrmArticle_VATLevel"},
		articleGroups01: {$tableName: "CrmArticle_ArticleGroup01"},
		articleGroups02: {$tableName: "CrmArticle_ArticleGroup02"},
		articleGroups03: {$tableName: "CrmArticle_ArticleGroup03"},
		articleGroups04: {$tableName: "CrmArticle_ArticleGroup04"},
		articleGroups05: {$tableName: "CrmArticle_ArticleGroup05"},
		languages: { $tableName: "Main_Language", $filterExpression: "it.IsSystemLanguage === true" },
		drivinglicenceCategories: { $tableName: "CrmArticle_DrivingLicenceCategory" }

	};
	static articleFactories = {}
	filterByType = ko.observable<boolean>(false);
	constructor() {
		super();
	}

	initNewArticle(currentArticle, articleTypeKey: string): void {
		const factory = ArticleCreateViewModel.articleFactories[(currentArticle || {}).ArticleTypeKey] || function (x) {
			return window.database.CrmArticle_Article.defaultType.create(x)
		};
		let article = factory(currentArticle);
		article.ArticleTypeKey = articleTypeKey;
		article.IsEnabled = true;
		article.LastActivity = new Date();
		article.RequiredSkillKeys = [];
		article.RequiredAssetKeys = [];
		this.initLookupDefaultValues(article);
		window.database.add(article);
		this.article(article.asKoObservable());
		let subscription = this.article().ArticleTypeKey.subscribe(articleTypeKey => {
			subscription.dispose();
			const currentArticle = this.article().innerInstance;
			window.database.detach(currentArticle);
			this.initNewArticle(currentArticle, articleTypeKey);
		});
	};

	async onQuantityUnitEntrySelect(quantityUnitGroup: Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry): Promise<void> {
		this.article().QuantityUnitKey(quantityUnitGroup?.QuantityUnitKey)
		this.article().QuantityStep(quantityUnitGroup != null ? quantityUnitGroup.QuantityStep : 0)
	};

	async init(id?: string, params?: { [key: string]: string }): Promise<void> {
		const isVehicleOrTool = params?.filterByType === "VehicleAndTool";

		if (isVehicleOrTool) {
			this.filterByType(true);
		}
		await super.init(id, params);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);

		if (id) {
			const article = await window.database.CrmArticle_Article.find(id);
			await this.setBreadcrumbs(article, !isVehicleOrTool);

			window.database.attachOrGet(article);
			this.article(article.asKoObservable());
		} else {
			await this.setBreadcrumbs(null, !isVehicleOrTool);

			let defaultArticleTypeKey = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.articleTypes, this.filterByType() ? "Vehicle" : "Material");
			this.initNewArticle(null, defaultArticleTypeKey);
		}

		const articleDescriptions = await window.database.CrmArticle_ArticleDescription
			.filter(function (description) {
				return description.Key === this.Key;
			}, {Key: this.article().ItemNo()})
			.toArray();
		this.articleDescriptions(articleDescriptions.map(ad => ad.asKoObservable()));
		this.descriptions(this.lookups.languages.$array.slice(1).map((x) => {
			const articleDescription = articleDescriptions.find(function (it) {
				return it.Language === x.Key;
			});
			if (articleDescription) {
				this.translation(true);
			}
			return {
				Value: window.ko.observable(articleDescription ? articleDescription.Value : ""),
				Language: x.Key,
				Name: x.Value,
				ArticleDescription: articleDescription
			};
		}));
	};

	initLookupDefaultValues(article: Crm.Article.Rest.Model.CrmArticle_Article): void {
		article.ArticleGroup01Key = null;
		article.ArticleGroup02Key = null;
		article.ArticleGroup03Key = null;
		article.ArticleGroup04Key = null;
		article.ArticleGroup05Key = null;
		article.CurrencyKey = null;
		article.DrivingLicenceCategoryKey = null;
		if (article.ArticleTypeKey !== "Vehicle") {
			article.ArticleGroup01Key = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.articleGroups01, article.ArticleGroup01Key);
			article.ArticleGroup02Key = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.articleGroups02, article.ArticleGroup02Key);
			article.ArticleGroup03Key = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.articleGroups03, article.ArticleGroup03Key);
			article.ArticleGroup04Key = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.articleGroups04, article.ArticleGroup04Key);
			article.ArticleGroup05Key = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.articleGroups05, article.ArticleGroup05Key);
			article.CurrencyKey = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.currencies, article.CurrencyKey);
			if (!(article.ArticleTypeKey === "Material" || article.ArticleTypeKey === "Cost" || article.ArticleTypeKey === "ConfigurationBase" || article.ArticleTypeKey === "Variable")) {
				article.QuantityUnitEntryKey = null;
				article.QuantityUnitKey = null;
			}
		} else {
			article.DrivingLicenceCategoryKey = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.drivinglicenceCategories, article.DrivingLicenceCategoryKey);
			article.QuantityUnitEntryKey = null;
			article.QuantityUnitKey = null;
		}
		article.VATLevelKey = HelperLookup.getDefaultLookupValueSingleSelect(this.lookups.vatLevels, article.VATLevelKey);
	};

	toggleTranslations(): void {
		this.translation(!this.translation());
	}

	cancel(): void {
		window.history.back();
	};

	async submit(): Promise<void> {
		if (this.article().ItemNo()) {
			this.article().ItemNo(this.article().ItemNo().trim());
			this.article().Name(this.article().ItemNo());
		}

		this.loading(true);
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			this.errors.scrollToError();
			this.errors.expandCollapsiblesWithErrors();
			return;
		}

		if (this.article().ItemNo.isValidating()) {
			this.article().ItemNo.isValidating.subscribe(function () {
				this.submit.call(this);
			}, this);
			return;
		}

		this.descriptions().forEach(function (it) {
			if (this.articleDescriptions().map((description:Crm.Article.Rest.Model.Lookups.ObservableCrmArticle_ArticleDescription) => description.Language()).includes(it.Language)) {
				const articleDescription = this.articleDescriptions().find((description:Crm.Article.Rest.Model.Lookups.ObservableCrmArticle_ArticleDescription) => description.Language() === it.Language);
				window.database.attachOrGet(articleDescription.innerInstance);
				articleDescription.Key(this.article().ItemNo());
				articleDescription.Value(window.ko.unwrap(it.Value));
				if (!window.ko.unwrap(it.Value)) {
					window.database.remove(articleDescription.innerInstance);
				}
			} else if (window.ko.unwrap(it.Value)) {
				const articleDescription = window.database.CrmArticle_ArticleDescription.defaultType.create();
				articleDescription.Key = this.article().ItemNo();
				articleDescription.Language = it.Language;
				articleDescription.Value = window.ko.unwrap(it.Value);
				window.database.add(articleDescription);
			}
		}, this);
		await window.database.saveChanges();
		window.location.hash = "/Crm.Article/Article/DetailsTemplate/" + this.article().Id();

	};

	async setBreadcrumbs(article: Crm.Article.Rest.Model.CrmArticle_Article, isArticle: boolean): Promise<void> {
		let title = null;
		if (article) {
			const articleType = window.Helper.Lookup.getLookupValue(this.lookups.articleTypes, article.ArticleTypeKey)
			title = `${window.Helper.getTranslatedString("EditArticle")} (${articleType})`;
		} else {
			title = window.Helper.getTranslatedString("CreateArticle");
		}

		if (isArticle) {
			await window.breadcrumbsViewModel.setBreadcrumbs([
				new Breadcrumb(window.Helper.getTranslatedString("Article"), "Article::Index", "#/Crm.Article/ArticleList/IndexTemplate"),
				new Breadcrumb(title, null, window.location.hash, null, article?.Id)
			]);
		}
		else {
			await window.breadcrumbsViewModel.setBreadcrumbs([
				new Breadcrumb(window.Helper.getTranslatedString("VehiclesAndTools"), "Article::Index", "#/Crm.Article/ArticleList/IndexTemplate?filterByType=VehicleAndTool"),
				new Breadcrumb(title, null, window.location.hash, null, article?.Id)
			]);
		}
	}
}

namespace("Crm.Article.ViewModels").ArticleCreateViewModel = ArticleCreateViewModel;

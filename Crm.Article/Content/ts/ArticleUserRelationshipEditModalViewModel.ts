import { namespace } from "@Main/namespace";
import type { ArticleDetailsViewModel } from "./ArticleDetailsViewModel";
import type { UserDetailsViewModel } from "@Main/UserDetailsViewModel";

export class ArticleUserRelationshipEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	articleUserRelationship = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_ArticleUserRelationship>(null);
	loading = ko.observable<boolean>(true);
	mode: string;
	parentViewModel: any;
	errors = window.ko.validation.group(this.articleUserRelationship, { deep: true });
	articleDowntime = ko.observable<Crm.Article.Rest.Model.CrmArticle_ArticleDowntime>(null);

	constructor(parentViewModel: UserDetailsViewModel | ArticleDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
		this.setMode(parentViewModel);

	}
	setMode(parentViewModel: UserDetailsViewModel | ArticleDetailsViewModel): void {
		if (parentViewModel instanceof window.Main.ViewModels.UserDetailsViewModel) {
			this.mode = "user";
		} else if (parentViewModel instanceof window.Crm.Article.ViewModels.ArticleDetailsViewModel) {
			this.mode = "article";
		}
	};

	async init(id?: string): Promise<void> {
		if (id) {
			const articleUserRelationship = await window.database.CrmArticle_ArticleUserRelationship.find(id);
			window.database.attachOrGet(articleUserRelationship)
			this.articleUserRelationship(articleUserRelationship.asKoObservable());
		} else {
			const articleUserRelationship = window.database.CrmArticle_ArticleUserRelationship.defaultType.create();
			if (this.mode === "user") {
				articleUserRelationship.UserKey = this.parentViewModel.user().Id();
			}
			else if (this.mode === "article") {
				articleUserRelationship.ArticleKey = this.parentViewModel.contactId();
			}
			window.database.add(articleUserRelationship);
			this.articleUserRelationship(articleUserRelationship.asKoObservable());
		}
	};

	getArticleSelect2Filter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article>, filter: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article> {
		const language = (document.getElementById("meta.CurrentLanguage") as HTMLMetaElement).content;
		query = query.filter(function (it) {
			return it.ArticleTypeKey in ["Vehicle", "Tool"];
		});
		return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
	};

	async articleAvailabilityCheck(articleKey: string, from, to): Promise<void> {
		if (!articleKey || !from || !to || from > to || !window.database.CrmArticle_ArticleDowntime) {
			return;
		}
		try {
			const downtimes = await window.database.CrmArticle_ArticleDowntime
				.include("Article")
				.filter(function (articleDowntime) {
					return articleDowntime.ArticleKey === this.articleKey &&
						articleDowntime.From <= this.to &&
						articleDowntime.To >= this.from
				},
					{ articleKey: articleKey, from: from, to: to })
				.take(1)
				.toArray();
			this.articleDowntime(downtimes.length === 1 ? downtimes[0] : null);
		}
		catch (e) {
			window.swal(window.Helper.String.getTranslatedString("Error"), (e as Error).message, "error");
		}
	}
	async save(): Promise<void> {
		this.loading(true);
		await this.articleAvailabilityCheck(this.articleUserRelationship().ArticleKey(), this.articleUserRelationship().From(), this.articleUserRelationship().To());
		await this.errors.awaitValidation();
		if (this.errors().length > 0 || this.articleDowntime()) {
			this.loading(false);
			this.errors.showAllMessages();
			return;
		}
		try {
			await window.database.saveChanges()
			this.loading(false);
			$(".modal:visible").modal("hide");
		} catch {
			this.loading(false);
			swal(
				window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error"
			);
		}
	};
}
namespace("Crm.Article.ViewModels").ArticleUserRelationshipEditModalViewModel = ArticleUserRelationshipEditModalViewModel;

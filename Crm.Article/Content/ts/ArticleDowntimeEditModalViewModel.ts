import { namespace } from "@Main/namespace";
import { HelperString } from "@Main/helper/Helper.String";
import type { ArticleDetailsViewModel } from "./ArticleDetailsViewModel";


export class ArticleDowntimeEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	articleDowntime = ko.observable<any>(null);
	loading = ko.observable<boolean>(true);
	parentViewModel: ArticleDetailsViewModel;
	errors = ko.validation.group(this.articleDowntime, { deep: true });

	constructor(parentViewModel: ArticleDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
	}

	async init(id?: string): Promise<void> {
		if (id) {
			const articleDowntime = await window.database.CrmArticle_ArticleDowntime.find(id);
			window.database.attachOrGet(articleDowntime)
			this.articleDowntime(articleDowntime.asKoObservable());
		} else {
			const articleDowntime = window.database.CrmArticle_ArticleDowntime.defaultType.create();
			articleDowntime.ArticleKey = this.parentViewModel.contactId();
			window.database.add(articleDowntime);
			this.articleDowntime(articleDowntime.asKoObservable());
		}
		this.articleDowntime().DowntimeReasonKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("ArticleDowntimeReason"))
			}
		});
		this.articleDowntime().From.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("From"))
			}
		});
		this.articleDowntime().To.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("To"))
			}
		});

	};

	async save(): Promise<void> {
		this.loading(true);
		if (this.errors().length > 0) {
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
				HelperString.getTranslatedString("UnknownError"),
				HelperString.getTranslatedString("Error_InternalServerError"),
				"error"
			);
		}
	};
}
namespace("Crm.Article.ViewModels").ArticleDowntimeEditModalViewModel = ArticleDowntimeEditModalViewModel;

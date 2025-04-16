import { namespace } from "@Main/namespace";
import type { ArticleDetailsViewModel } from "./ArticleDetailsViewModel";
import { HelperConfirm } from "@Main/helper/Helper.Confirm";
import { HelperDatabase } from "@Main/helper/Helper.Database";
import { HelperLookup } from "@Main/helper/Helper.Lookup";

export class ArticleDetailsDowntimesTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_ArticleDowntime, Crm.Article.Rest.Model.ObservableCrmArticle_ArticleDowntime> {
	articleId = ko.observable<string>(null);
	lookups: LookupType = {
		articleDowntimeReasons: { $tableName: "CrmArticle_ArticleDowntimeReason" }
	};

	constructor(parentViewModel: ArticleDetailsViewModel) {

		super("CrmArticle_ArticleDowntime", "Article.ItemNo", "ASC", ["Article"]);
		this.articleId(parentViewModel.contactId());
		this.getFilter("ArticleKey").extend({ filterOperator: "===" })(this.articleId());

	}

	async init(): Promise<void> {
		await super.init();
		this.isTabViewModel(true);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);

	}

	async delete(articleDowntime: any): Promise<void> {
		if (!await HelperConfirm.confirmDeleteAsync()) {
			return;
		}
		this.loading(true);
		let entity = await HelperDatabase.getDatabaseEntity(articleDowntime);
		window.database.remove(entity);
		await window.database.saveChanges();
	}


}

namespace("Crm.Article.ViewModels").ArticleDetailsDowntimesTabViewModel = ArticleDetailsDowntimesTabViewModel;

import { namespace } from "@Main/namespace";
import type { ArticleDetailsViewModel } from "./ArticleDetailsViewModel";
import { HelperConfirm } from "@Main/helper/Helper.Confirm";
import { HelperDatabase } from "@Main/helper/Helper.Database";
import { HelperLookup } from "@Main/helper/Helper.Lookup";

export class ArticleDetailsUsersTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship, Crm.Article.Rest.Model.ObservableCrmArticle_ArticleUserRelationship> {
	articleId = ko.observable<string>(null);
	lookups: LookupType = {
		articleTypes: { $tableName: "CrmArticle_ArticleType" }
	};

	constructor(parentViewModel: ArticleDetailsViewModel) {

		super("CrmArticle_ArticleUserRelationship", ["User.LastName", "User.FirstName"], ["ASC", "ASC"], ["Article", "User"]);
		this.articleId(parentViewModel.contactId());
		this.getFilter("ArticleKey").extend({ filterOperator: "===" })(this.articleId());

	}

	async init(): Promise<void> {
		await super.init();
		this.isTabViewModel(true);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);

	}
	getColor(): string {
		return "#9E9E9E";
	}

	async delete(articleUserRelationship: any): Promise<void> {
		if (!await HelperConfirm.confirmDeleteAsync()) {
			return;
		}
		this.loading(true);
		let entity = await HelperDatabase.getDatabaseEntity(articleUserRelationship);
		window.database.remove(entity);
		await window.database.saveChanges();
	}


}

namespace("Crm.Article.ViewModels").ArticleDetailsUsersTabViewModel = ArticleDetailsUsersTabViewModel;

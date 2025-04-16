import { namespace } from "@Main/namespace";
import type { UserDetailsViewModel } from "@Main/UserDetailsViewModel";
import { HelperConfirm } from "@Main/helper/Helper.Confirm";
import { HelperDatabase } from "@Main/helper/Helper.Database";
import { HelperLookup } from "@Main/helper/Helper.Lookup";

export class UserDetailsArticlesTabViewModel extends window.Main.ViewModels.GenericListViewModel<Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship, Crm.Article.Rest.Model.ObservableCrmArticle_ArticleUserRelationship> {
	userKey = ko.observable<string>(null);
	lookups: LookupType = {
		articleTypes: { $tableName: "CrmArticle_ArticleType" }
	};

	constructor(parentViewModel: UserDetailsViewModel) {

		super("CrmArticle_ArticleUserRelationship", ["User.LastName", "User.FirstName"], ["ASC", "ASC"], ["Article", "User"]);
		this.userKey(parentViewModel.user().Id());
		this.getFilter("UserKey").extend({ filterOperator: "===" })(this.userKey());

	}

	async init(): Promise<void> {
		await super.init();
		this.isTabViewModel(true);
		await HelperLookup.getLocalizedArrayMaps(this.lookups);

	}

	getItemGroup(item: any): ItemGroup {
		switch (item.Article().ArticleTypeKey()) {
			case "Tool":
				return { title: window.Helper.String.getTranslatedString("Tools") };
			case "Vehicle":
				return { title: window.Helper.String.getTranslatedString("Vehicles") };
			default: return null;
		};
	};

	applyOrderBy(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship>): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship> {
		query = query.orderBy("it.Article.ArticleTypeKey");
		return super.applyOrderBy(query);
	};

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

namespace("Main.ViewModels").UserDetailsArticlesTabViewModel = UserDetailsArticlesTabViewModel;

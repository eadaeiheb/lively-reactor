import {namespace} from "@Main/namespace";
import {HelperProductFamily} from "./helper/Helper.ProductFamiliy";
import {HelperString} from "@Main/helper/Helper.String";
import {HelperLookup} from "@Main/helper/Helper.Lookup";

export class ProductFamilyListIndexViewModel extends window.Crm.ViewModels.ContactListViewModel<Crm.Article.Rest.Model.CrmArticle_ProductFamily, Crm.Article.Rest.Model.ObservableCrmArticle_ProductFamily> {

	lookups: LookupType = {
		productFamilyStatuses: {$tableName: "CrmArticle_ProductFamilyStatus"}
	};

	constructor() {
		super("CrmArticle_ProductFamily", "Name", "ASC", ["ParentProductFamily", "ResponsibleUserUser"]);

		const activeBookmark = {
			Category: HelperString.getTranslatedString("Filter"),
			Name: HelperString.getTranslatedString("AllActive"),
			Key: "All",
			Expression: function (query) {
				return query.filter(function (it) {
					return it.StatusKey === "active";
				});
			}
		};
		this.bookmarks.push(activeBookmark);
		this.bookmark(activeBookmark);
		this.bookmarks.push({
			Category: HelperString.getTranslatedString("Filter"),
			Name: HelperString.getTranslatedString("All"),
			Key: "All",
			Expression: function (query) {
				return query;
			}
		});
		this.bookmarks.push({
			Category: HelperString.getTranslatedString("Filter"),
			Name: HelperString.getTranslatedString("Draft"),
			Key: "Draft",
			Expression: function (query) {
				return query.filter(function (it) {
					return it.StatusKey === "draft";
				});
			}
		});
		this.bookmarks.push({
			Category: HelperString.getTranslatedString("Filter"),
			Name: HelperString.getTranslatedString("RetiredProducts"),
			Key: "Retired",
			Expression: function (query) {
				return query.filter(function (it) {
					return it.StatusKey === "retired";
				});
			}
		});
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<any> {
		await HelperLookup.getLocalizedArrayMaps(this.lookups)
		await super.init(id, params);
	}

	async initItems(items: Crm.Article.Rest.Model.ObservableCrmArticle_ProductFamily[]): Promise<Crm.Article.Rest.Model.ObservableCrmArticle_ProductFamily[]> {
		await super.initItems(items);
		await HelperProductFamily.loadProductFamilyDescriptions(items, this.currentUser().DefaultLanguageKey);
		return items;
	}

	applyFilter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily>, filterValue: any, filterName: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily> {
		if (filterName === "Descriptions") {
			return HelperProductFamily.getProductFamilyAutocompleteFilter(query, filterValue.Value, this.currentUser().DefaultLanguageKey);
		}
		return super.applyFilter(query, filterValue, filterName);
	}
}

namespace("Crm.Article.ViewModels").ProductFamilyListIndexViewModel = ProductFamilyListIndexViewModel;


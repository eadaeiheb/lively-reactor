import {HelperDatabase} from "@Main/helper/Helper.Database";

export class HelperProductFamily {

	static filterParent(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily>, term: string, id: Edm.Guid): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily> {
		if (term) {
			query = query.filter("it.Name.toLowerCase().contains(this.term)", {term: term});
		}
		query = query.filter("it.Id !== this.id && it.ParentId !== this.id", {id: id});
		return query.orderByDescending("it.Name");
	}

	static filterChild(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily>, term: string, id: Edm.Guid): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily> {
		if (term) {
			query = query.filter("it.Name.toLowerCase().contains(this.term)", {term: term});
		}
		query = query.filter("it.Id !== this.id && it.ParentId == null", {id: id});
		return query.orderByDescending("it.Name");
	}

	static getProductFamilyAutocompleteFilter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily>, filter: string, language: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_ProductFamily> {
		if (filter) {
			return query.filter("filterByProductFamilyDescription", {language: language, filter: filter});
		}
		return query;
	}

	static async loadProductFamilyDescriptions(results, language: string): Promise<Crm.Article.Rest.Model.Lookups.CrmArticle_ProductFamilyDescription[]> {
		if (!window.database.CrmArticle_ProductFamilyDescription) {
			return results;
		}
		const productFamilies = results.reduce(function (map, productFamily) {
			productFamily = HelperDatabase.getDatabaseEntity(productFamily);
			map[productFamily.Id] = productFamily;
			return map;
		}, {});
		return window.database.CrmArticle_ProductFamilyDescription
			.filter("it.Key in this.Ids && it.Language === this.language", {
				Ids: Object.keys(productFamilies),
				language: language
			})
			.map(function (x) {
				return {Key: x.Key, Value: x.Value};
			})
			.forEach(function (description) {
				const productFamily = productFamilies[description.Key];
				if (productFamily && description.Value) {
					productFamilies[description.Key].$ProductFamilyDescription = description.Value;
				}
			})
			.then(function () {
				return results;
			});
	}

	static getProductFamilyAutocompleteDisplay(productFamily: Crm.Article.Rest.Model.CrmArticle_ProductFamily): string {
		const productFamilyDescription = this.getProductFamilyDescription(productFamily);
		if (productFamilyDescription) {
			return productFamilyDescription;
		}
		return ko.unwrap(productFamily.Name);
	}

	static getProductFamilyDescription(productFamily: Crm.Article.Rest.Model.CrmArticle_ProductFamily): string {
		productFamily = HelperDatabase.getDatabaseEntity(productFamily);
		return ko.unwrap(productFamily["$ProductFamilyDescription"]) || ko.unwrap(productFamily["Description"]);
	}

	static getProductFamilyStatusAbbreviation(productFamily: string): string {
		return productFamily.substring(0, 1);
	}

	static getParent(productFamilyId: Edm.Guid, viewModel: any): Promise<Crm.Article.Rest.Model.CrmArticle_ProductFamily> {
		return window.database.CrmArticle_ProductFamily
			.find(productFamilyId)
			.then(function (result) {
				if (result.ParentId !== null) {
					return window.Helper.ProductFamily.getParent(result.ParentId, viewModel);
				}
				viewModel.parentProductFamily(result.asKoObservable());
				return result;
			});
	}
}
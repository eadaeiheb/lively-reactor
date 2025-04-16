import { HelperString } from "@Main/helper/Helper.String";

export class HelperStore {
	
	static filterLocationQueryByLocationNo(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Location>, term: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Location> {
		if (term) {
			query = query.filter(function(it) {
					return it.LocationNo === this.term;
				},
				{ term: term });
		}
		return query;
	}

	static getStoreAutocompleteDisplay(store: Crm.Article.Rest.Model.CrmArticle_Store): string {
		store = ko.unwrap(store)
		const displayName = [];
		const storeNo = HelperString.trim(ko.unwrap(store.StoreNo));
		displayName.push(storeNo);
		const storeFallbackName = ko.unwrap(store.Name)
		const storeName = ko.unwrap(store["$StoreName"])
		displayName.push("-");
		if (storeName != null) {
			displayName.push(HelperString.trim(storeName));
		}
		else {
			displayName.push(HelperString.trim(storeFallbackName));
		}
		return displayName.join(" ");
	}

	static getAutocompleteOptions(viewModel, joins, useNo = false) {
		const options: Select2AutoCompleterOptions = {
			table: 'CrmArticle_Store',
			orderBy: ['StoreNo', 'Name'],
			mapDisplayObject: function (store) {
				return {
					id: useNo ? store.StoreNo : store.Id,
					text: HelperStore.getStoreAutocompleteDisplay(store),
					item: store.asKoObservable()
				};
			}
		}
		const language = (document.getElementById("meta.CurrentLanguage") as any).content;
		options.onResult = function (results) {
			return HelperStore.loadStoreNames(results, language);
		};
		options.customFilter = function (query, filter) {
			return HelperStore.getStoreAutocompleteFilter(query, filter, language);
		};
		if (joins) {
			options.joins = joins
		}
		if (viewModel) {
			if (viewModel.onStoreSelect) {
				options.onSelect = viewModel.onStoreSelect.bind(viewModel);
			}
			if (viewModel.getStoreSelect2Filter) {
				options.customFilter = viewModel.getStoreSelect2Filter.bind(viewModel);
			}
			if (viewModel.getStoreByIdQuery) {
				options.getElementByIdQuery = viewModel.getStoreByIdQuery.bind(viewModel);
			}
		}
		return options
	}

	static getCustomAutocompleteOptions(viewModel, joins, customOptions) {
		let options = HelperStore.getAutocompleteOptions(viewModel, joins)
		for (let key in customOptions) {
			options[key] = customOptions[key]
		}
		return options
	}

	static getStoreAutocompleteFilter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Store>, filter: string, language: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Store> {
		if (filter) {
			return query.filter("filterByStoreName", {language: language, filter: filter});
		}
		return query;
	}

	static filterStoreQueryByStoreNo(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Store>, term: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Store> {
		if (term) {
			query = query.filter(function(it) {
					return it.StoreNo === this.term;
				},
				{ term: term });
		}
		return query;
	}
	
	static getStoreNameAbbrevation(StoreName: string): string {
		return StoreName.substring(0, 1);
	}
	
	static mapForSelect2Display(store: Crm.Article.Rest.Model.CrmArticle_Store): Select2AutoCompleterResult {
		return {
			id: store.Id,
			text: HelperStore.getStoreAutocompleteDisplay(store),
			item: store.asKoObservable()
		};
	}
	
	static mapLocationForSelect2Display(location: Crm.Article.Rest.Model.CrmArticle_Location): Select2AutoCompleterResult {
		return {
			id: location.Id,
			item: location,
			text: location.LocationNo
		};
	}

	static async loadStoreNames(results, language: string): Promise<Crm.Article.Rest.Model.Lookups.CrmArticle_StoreName[]> {
		if (!window.database.CrmArticle_StoreName) {
			return results;
		}
		const stores = results.reduce(function (map, store: Crm.Article.Rest.Model.CrmArticle_Store) {
			map[ko.unwrap(store.StoreNo)] = store;
			return map;
		}, {});
		await window.database.CrmArticle_StoreName
			.filter("it.Key in this.storeNos && it.Language === this.language", {
				storeNos: Object.keys(stores),
				language: language
			})
			.map(function (x) {
				return {Key: x.Key, Value: x.Value};
			})
			.forEach(function (name) {
				const store = stores[name.Key];
				if (store && name.Value) {
					stores[name.Key].$StoreName = name.Value;
				}
			});

		return results;

	}

	static getAutocompleteFilter(query, term) {
		if (term) {
			query = query.filter(function (it) {
				return it.StoreNo.contains(this.term) || it.Name.contains(this.term) || it.LegacyId.contains(this.term);
			},
				{ term: term });
		}
		return query;
	}
}

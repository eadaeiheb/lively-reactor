($data.Queryable as any).prototype.specialFunctions.filterByArticleDescription = {
	"oData": function (urlSearchParams, data) {
		if (data.language && data.filter) {
			urlSearchParams.append("filterByArticleDescriptionLanguage", data.language);
			urlSearchParams.append("filterByArticleDescriptionFilter", data.filter);
		}
	},
	"webSql": function (query, data) {
		let queryFilter = [];
		let args = {
			articleItemNos: undefined,
			filter: undefined,
			articleDescriptionItemNos: undefined
		};
		if (window.database.CrmArticle_ArticleDescription) {
			const articleDescriptionItemNos = window.database.CrmArticle_ArticleDescription
				.filter("it.Language === this.language && it.Value.contains(this.filter)", {filter: data.filter, language: data.language})
				.map(function (it) {
					return it.Key;
				});
			queryFilter.push("it.ItemNo in this.articleDescriptionItemNos");
			args.articleDescriptionItemNos = articleDescriptionItemNos;
		}
		if (query.defaultType === window.database.CrmArticle_Article.elementType) {
			queryFilter.push("it.ItemNo.contains(this.filter)");
			queryFilter.push("it.Description.contains(this.filter)");
			args.filter = data.filter;
		} else if (window.database.CrmArticle_Article) {
			const articleItemNos = window.database.CrmArticle_Article
				.filter("it.Description.contains(this.filter)", {filter: data.filter})
				.map("it.ItemNo");
			queryFilter.push("it.ItemNo in this.articleItemNos");
			args.articleItemNos = articleItemNos;
		}
		return query.filter(queryFilter.join(" || "), args);
	}
};
($data.Queryable as any).prototype.specialFunctions.filterStoreBySerials = {
	"oData": function (query, data) {
		console.log(query)

	},
	"webSql": function (query, data) {
		const articleKey = ko.unwrap(data.articleKey)
		const storeIds = window.database.CrmArticle_Serial
			.filter(function (serial) {
				return serial.ArticleKey == this.articleKey
			}, {articleKey: articleKey})
			.map(function (serial) {
				return serial.StoreKey
			})
		return query.filter("it.Id in this.storeIds", {storeIds: storeIds})
	}
};
($data.Queryable as any).prototype.specialFunctions.filterStorageAreaBySerials = {
	"oData": function (query, data) {
		console.log(query)

	},
	"webSql": function (query, data) {
		const articleKey = ko.unwrap(data.articleKey)
		const storageAreaIds = window.database.CrmArticle_Serial
			.filter(function (serial) {
				return serial.ArticleKey == this.articleKey
			}, {articleKey: articleKey})
			.map(function (serial) {
				return serial.StorageAreaKey
			})
		return query.filter("it.Id in this.storageAreaIds", {storageAreaIds: storageAreaIds})
	}
};
($data.Queryable as any).prototype.specialFunctions.filterLocationBySerials = {
	"oData": function (query, data) {
		console.log(query)

	},
	"webSql": function (query, data) {
		const articleKey = ko.unwrap(data.articleKey)
		const storeIds = window.database.CrmArticle_Serial
			.filter(function (serial) {
				return serial.ArticleKey == this.articleKey
			}, {articleKey: articleKey})
			.map(function (serial) {
				return serial.LocationKey
			})
		return query.filter("it.Id in this.storeIds", {storeIds: storeIds})
	}
};
($data.Queryable as any).prototype.specialFunctions.filterByQuantityTranslation = {
	"oData": function (urlSearchParams, data) {
		if (data.language && data.filter) {
			urlSearchParams.append("filterByQuantityTranslationLanguage", data.language);
			urlSearchParams.append("filterByQuantityTranslationFilter", data.filter);
		}
	},
	"webSql": function (query, data) {
		if (window.database.CrmArticle_QuantityUnit) {
			const quantityUnitKeys = window.database.CrmArticle_QuantityUnit
				.filter("it.Language === this.language && it.Value.contains(this.filter)", {filter: data.filter, language: data.language})
				.map(function (it) {
					return it.Key;
				});
			query = query.filter("it.QuantityUnitKey in this.quantityUnitKeys || it.Name.contains(this.filter)", {quantityUnitKeys: quantityUnitKeys, filter: data.filter})
		}
		return query;
	}
};

($data.Queryable as any).prototype.specialFunctions.filterByProductFamilyDescription = {
	"oData": function (urlSearchParams, data) {
		if (data.language && data.filter) {
			urlSearchParams.append("filterByProductFamilyDescriptionLanguage", data.language);
			urlSearchParams.append("filterByProductFamilyDescriptionFilter", data.filter);
		}
	},
	"webSql": function (query, data) {
		let queryFilter = [];
		let args = {
			filter: undefined,
			productFamilyNames: undefined,
			productFamilyDescriptionNames: undefined
		};
		if (window.database.CrmArticle_ProductFamilyDescription) {
			const productFamilyDescriptionNames = window.database.CrmArticle_ProductFamilyDescription
				.filter("it.Language === this.language && it.Value.contains(this.filter)", {filter: data.filter, language: data.language})
				.map(function (it) {
					return it.Key;
				});
			queryFilter.push("it.Name in this.this.productFamilyDescriptionNames");
			args.productFamilyDescriptionNames = productFamilyDescriptionNames;
		}
		if (query.defaultType === window.database.CrmArticle_ProductFamily.elementType) {
			queryFilter.push("it.Name.contains(this.filter)");
			args.filter = data.filter;
		} else if (window.database.CrmArticle_Article) {
			let productFamilyNames = window.database.CrmArticle_Article
				.filter("it.Name.contains(this.filter)", {filter: data.filter})
				.map("it.Name");
			queryFilter.push("it.Name in this.productFamilyNames");
			args.productFamilyNames = productFamilyNames;
		}
		return query.filter(queryFilter.join(" || "), args);
	}
};

($data.Queryable as any).prototype.specialFunctions.filterArticleByAvailability = {
	"oData": function(urlSearchParams, data) {
		if(data.store || data.storageArea || data.location)
		{
			urlSearchParams.append("filterArticleByAvailabilityStore", data.store);
			urlSearchParams.append("filterArticleByAvailabilityStorageArea", data.storageArea);
			urlSearchParams.append("filterArticleByAvailabilityLocation", data.location);
		}
	},
	"webSql": function(query, data) {
		const storeId = ko.unwrap(data.store)
		const storageAreaId = ko.unwrap(data.storageArea)
		const locationId = ko.unwrap(data.location)
		let stockQuery :  $data.EntitySet<typeof Crm.Article.Rest.Model.CrmArticle_Stock, Crm.Article.Rest.Model.CrmArticle_Stock> | $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Stock>
			= window.database.CrmArticle_Stock;
		if(storeId) {
			stockQuery = stockQuery.filter("it.StoreKey === this.storeId", {storeId: storeId})
			if(storageAreaId) {
				stockQuery = stockQuery.filter("it.StorageAreaKey === this.storageAreaId", {storageAreaId: storageAreaId})
			}
			if(locationId) {
				stockQuery = stockQuery.filter("it.LocationKey === this.locationId", {locationId: locationId})
			}
		}
		const articleIds = stockQuery.map(x => x.ArticleKey).distinct();
		return query.filter("it.Id in this.articleIds",{articleIds: articleIds});
	}
};

($data.Queryable as any).prototype.specialFunctions.filterByStoreName = {
	"oData": function (urlSearchParams, data) {
		if (data.language && data.filter) {
			urlSearchParams.append("filterByStoreNameLanguage", data.language);
			urlSearchParams.append("filterByStoreNameFilter", data.filter);
		}
	},
	"webSql": function (query, data) {
		let queryFilter = [];
		let args = {
			filter: undefined,
			storeNameStoreNos: undefined
		};
		if (window.database.CrmArticle_StoreName) {
			const storeNameStoreNos = window.database.CrmArticle_StoreName
				.filter("it.Language === this.language && it.Value.contains(this.filter)", {filter: data.filter, language: data.language})
				.map(function (it) {
					return it.Key;
				});
			queryFilter.push("it.StoreNo in this.storeNameStoreNos");
			args.storeNameStoreNos = storeNameStoreNos;
		}
		if (query.defaultType === window.database.CrmArticle_Store.elementType) {
			queryFilter.push("it.StoreNo.contains(this.filter)");
			queryFilter.push("it.Name.contains(this.filter)");
			args.filter = data.filter;
		}
		return query.filter(queryFilter.join(" || "), args);
	}
};
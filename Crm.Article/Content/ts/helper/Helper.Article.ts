import {HelperString} from "@Main/helper/Helper.String";
import {HelperDatabase} from "@Main/helper/Helper.Database";
import {HelperBatch} from "@Main/helper/Helper.Batch";
import { OverlappingArticleUserRelationshipValidator } from "../OverlappingArticleUserRelationshipValidator";

export class HelperArticle {
	static OverlappingArticleUserRelationshipValidator = OverlappingArticleUserRelationshipValidator;
	static getArticleTypeAbbreviation(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article, articleTypes: Crm.Article.Rest.Model.Lookups.CrmArticle_ArticleType[]): string {
		const articleTypeKey = window.ko.unwrap(article.ArticleTypeKey);
		if (articleTypeKey) {
			const articleType = (articleTypes || {})[articleTypeKey];
			if (articleType && articleType.Value) {
				return articleType.Value[0];
			}
		}
		return "";
	}

	static async getAssignedVehicleIds(username: string, from: Date, to: Date): Promise<string[]> {
		let query = window.database.CrmArticle_ArticleUserRelationship
			.filter(it => it.Article.ArticleTypeKey === "Vehicle");
		if (username) {
			query = query.filter(function (it) {
				return it.UserKey === this.username
			}, {username: username});
		}
		if (from) {
			query = query.filter(function (it) {
				return it.To === null || it.To >= this.from
			}, {from: from});
		}
		if (to) {
			query = query.filter(function (it) {
				return it.From === null || it.From <= this.to
			}, {to: to});
		}
		return await query
			.map(it => it.ArticleKey)
			.toArray();
	}

	static getDiscountText(discountKey: string): string {
		const attributes = Object.keys(Crm.Article.Model.Enums.DiscountType);
		const discountType = Crm.Article.Model.Enums.DiscountType;
		return attributes.filter(attribute => discountType[attribute] === discountKey)[0];
	}

	static getArticleDescription(article: Crm.Article.Rest.Model.CrmArticle_Article | Crm.Article.Rest.Model.ObservableCrmArticle_Article): string {
		const articleFromDb = window.Helper.Database.getDatabaseEntity(article);
		if (articleFromDb) {
			return ko.unwrap(article["$ArticleDescription"]) || ko.unwrap(article.Description);
		}
		return "";
	}

	static getArticleAutocompleteDisplay(article: Crm.Article.Rest.Model.CrmArticle_Article): string {
		const articleDescription = HelperArticle.getArticleDescription(article);
		const displayName = [];
		if (window.ko.unwrap(article.IsEnabled) === false) {
			displayName.push("[" + HelperString.getTranslatedString("Inactive") + "]");
		}
		const ItemNo = HelperString.trim(ko.unwrap(article.ItemNo));
		displayName.push(ItemNo);
		if (articleDescription) {
			displayName.push("-");
			displayName.push(HelperString.trim(articleDescription));
		}
		return displayName.join(" ");
	}

	static getArticleAutocompleteFilter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article>, filter: string, language: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article> {
		if (filter) {
			return query.filter("filterByArticleDescription", {language: language, filter: filter});
		}
		return query;
	}

	static async loadArticleDescriptionsMapFromItemNo(items: {ItemNo:string}[] | {ItemNo:KnockoutObservable<string>}[], language: string): Promise<any> {
		const itemNos = items.map(item => ko.unwrap(item.ItemNo));
		const descriptions = await HelperArticle.loadArticleDescriptionsMap(itemNos, language);
		items.forEach(item => {
			const itemNo = ko.unwrap(item.ItemNo);
			let description = descriptions[itemNo] || "";
			if (!description && item.Description) {
				description = ko.unwrap(item.Description);
			}
			if (ko.isObservable(item.ItemDescription)) {
				item.ItemDescription(description);
			} else {
				item.ItemDescription = ko.observable(description);
			}
		});
		return items;
	}

	static async loadArticleDescriptionsMap(itemNos: string[], language: string): Promise<any> {
		const descriptions = itemNos.reduce(function (map, i) {
			map[i] = null;
			return map;
		}, {});
		if (itemNos.length === 0) {
			return descriptions;
		}
		const queries = [];
		if (window.database.CrmArticle_ArticleDescription) {
			queries.push({
				queryable: window.database.CrmArticle_ArticleDescription
					.filter("it.Key in this.itemNos && it.Language === this.language", {
						itemNos: itemNos,
						language: language
					})
					.map(function (x) {
						return {Key: x.Key, Value: x.Value};
					}),
				method: "toArray",
				handler: function (items) {
					items.forEach(function (i) {
						descriptions[i.Key] = i.Value;
					});
				}
			});
		}
		if (window.database.CrmArticle_Article) {
			queries.push({
				queryable: window.database.CrmArticle_Article
					.filter("it.ItemNo in this.itemNos", {itemNos: itemNos})
					.map(function (x) {
						return {ItemNo: x.ItemNo, Description: x.Description};
					}),
				method: "toArray",
				handler: function (items) {
					items.forEach(function (i) {
						if (!descriptions[i.ItemNo]) {
							descriptions[i.ItemNo] = i.Description;
						}
					});
				}
			});
		}
		await HelperBatch.Execute(queries);
		return descriptions;
	}

	static async loadArticleDescriptions(results, language: string): Promise<Crm.Article.Rest.Model.Lookups.CrmArticle_ArticleDescription[]> {
		if (!window.database.CrmArticle_ArticleDescription) {
			return results;
		}
		const articles = results.reduce(function (map, article: Crm.Article.Rest.Model.CrmArticle_Article) {
			article = HelperDatabase.getDatabaseEntity(article);
			map[article.ItemNo] = article;
			return map;
		}, {});
		await window.database.CrmArticle_ArticleDescription
			.filter("it.Key in this.itemNos && it.Language === this.language", {
				itemNos: Object.keys(articles),
				language: language
			})
			.map(function (x) {
				return {Key: x.Key, Value: x.Value};
			})
			.forEach(function (description) {
				const article = articles[description.Key];
				if (article && description.Value) {
					articles[description.Key].$ArticleDescription = description.Value;
				}
			});

		return results;

	}

	static mapArticleForSelect2Display(article: Crm.Article.Rest.Model.CrmArticle_Article): { id: string, item: Crm.Article.Rest.Model.ObservableCrmArticle_Article, text: string } {
		return {
			id: article.Id,
			item: article.asKoObservable(),
			text: HelperArticle.getArticleAutocompleteDisplay(article)
		};
	}

	static getAutocompleteOptionsShorthand(viewModel, withoutKey: boolean, showActiveArticles: boolean, showExpiredArticles: boolean, showUpcomingArticles: boolean, hideTemplate?: boolean): Select2AutoCompleterOptions {
		let options = HelperArticle.getArticleSelect2Options(viewModel, withoutKey);
		options.joins = [
			{
				Selector: "DocumentAttributes",
				Operation: "filter(function(x){ return x.UseForThumbnail === true; })"
			}, "DocumentAttributes.FileResource", "QuantityUnitEntry", "Stocks"];
		options.templateResultId = !!hideTemplate ? null : 'article-autocomplete-template';
		const baseFilter = options.customFilter;
		options.customFilter = function (query, filter) {
			let showActive = window.ko.unwrap(showActiveArticles);
			let showExpired = window.ko.unwrap(showExpiredArticles);
			let showUpcoming = window.ko.unwrap(showUpcomingArticles);
			query = baseFilter(query, filter)

			if (!showActive && !showExpired && !showUpcoming) {
				return query.filter("false");
			}

			let today = new Date().setHours(0, 0, 0, 0)
			const conditions = {
				activeCondition: "(it.IsEnabled === true)",
				expiredCondition: "(it.ValidTo < this.today || (it.IsEnabled === false && it.ValidTo == null && it.ValidFrom == null))",
				upcomingCondition: "(it.ValidFrom >= this.today)",
			}
			let activeConditions = [];
			if (showActive) {
				activeConditions.push(conditions.activeCondition)
			}
			if (showExpired) {
				activeConditions.push(conditions.expiredCondition)
			}
			if (showUpcoming) {
				activeConditions.push(conditions.upcomingCondition)
			}
			return query.filter(activeConditions.join(" || "), {today: today});
		}
		return options;
	}

	static getArticleSelect2Options(viewModel, withoutKey: boolean): Select2AutoCompleterOptions {
		const options: Select2AutoCompleterOptions = {
			table: "CrmArticle_Article",
			orderBy: ["ItemNo"],
			mapDisplayObject: function (article) {
				if (viewModel.getArticleAutocompleteDisplay) {
					return {
						id: article.Id,
						text: viewModel.getArticleAutocompleteDisplay(article)
					};
				} else {
					return {
						id: article.Id,
						text: HelperArticle.getArticleAutocompleteDisplay(article),
						item: article.asKoObservable()
					};
				}
			}
		};
		if (withoutKey !== true) {
			options.key = "Id";
		}
		if (viewModel) {
			const language = (document.getElementById("meta.CurrentLanguage") as any).content;
			if (viewModel.getArticleSelect2Filter) {
				options.customFilter = viewModel.getArticleSelect2Filter.bind(viewModel);
			} else {
				options.customFilter = function (query, filter) {
					return HelperArticle.getArticleAutocompleteFilter(query, filter, language);
				};
			}
			if (viewModel.onArticleSelect) {
				options.onSelect = viewModel.onArticleSelect.bind(viewModel);
			}
			if (viewModel.onArticleAutocompleteResult) {
				options.onResult = viewModel.onArticleAutocompleteResult.bind(viewModel);
			} else {
				options.onResult = function (results) {
					return HelperArticle.loadArticleDescriptions(results, language);
				};
			}
		}
		return options;
	}

	static autocompleterOptionsVehicleAndTools(tableName: string): Select2AutoCompleterOptions {
		return {
			table: tableName,
			mapDisplayObject: window.Helper.Lookup.mapLookupForSelect2Display,
			getElementByIdQuery: window.Helper.Lookup.getLookupByKeyQuery,
			customFilter: function (query, term) {
				query = query.filter("it.Key === 'Vehicle' || it.Key === 'Tool'");
				return window.Helper.Lookup.queryLookup(query, term);
			}
		}
	}
	
	static getArticleGroupHierarchy(lookups: any) {
		return window.database.CrmArticle_Article.GetDistinctArticleGroupCombinations().toArray().then(function (combinations) {
			var results = [];
			combinations.forEach(function (combination) {				
				let levels: { Subgroups: any; Key?: string; Value?: null; Base64Image?: null; }[] = [];
				let levelCount: number = 5;
				for (let i = 0; i < levelCount; i++) {
					levels.push({
						Key:  null,
						Value: null,
						Base64Image: null,
						Subgroups: []
					});
					addLevel(i);
				}
				
				function addLevel(level: number) {
					if (combination['ArticleGroup0'+(level+1)+'Key']) {
						let key = combination['ArticleGroup0'+(level+1)+'Key'];
						if (levels[level-1] ? !levels[level-1].Subgroups.some(function (x) { return x.Key == key; }) : !results.some(function (x) { return x.Key == key; }))
						{
							levels[level].Key = key;
							let lookup = null;
							for (let x in lookups){
								if (lookups[x].$tableName === 'CrmArticle_ArticleGroup0'+(level+1)) {
									lookup = lookups[x].$array.find(function(l) { return l.Key === key;});
									break;
								}
							}
							levels[level].Value = lookup ? lookup.Value : null;
							levels[level].Base64Image = lookup ? lookup.Base64Image : null;
							levels[level].Subgroups = [];
							let prevLevel = levels[level-1];
							if (prevLevel) {
								prevLevel.Subgroups.push(levels[level]);
							} else {
								results.push(levels[level]);
							}
						}
						levels[level] = levels[level-1] ? levels[level-1].Subgroups.find(function (x) { return x.Key == key; }) : results.find(function (x) { return x.Key == key; })
					}
				}
			});
			results.sort((a, b) => a.Value.localeCompare(b.Value));
			if (combinations.some(function(combination){ return combination.ArticleGroup01Key === null && combination.ArticleGroup02Key === null && combination.ArticleGroup03Key === null && combination.ArticleGroup04Key === null  && combination.ArticleGroup05Key === null})) {
				results.push({
					Key:  null,
					Value: 'Unassigned',
					Base64Image: null,
					Subgroups: []
				});
			}
			return results;
		})
	}
}

function setupArticle() {
	function configureWebSqlGetDistinctArticleGroupCombinations() {
		if (!window.database.CrmArticle_Article) {
			return;
		}
		window.database.CrmArticle_Article.GetDistinctArticleGroupCombinations = function() {
			return window.database.CrmArticle_Article
				.map(function(it) { 
					return {
						ArticleGroup01Key: it.ArticleGroup01Key,
                        ArticleGroup02Key: it.ArticleGroup02Key,
						ArticleGroup03Key: it.ArticleGroup03Key,
						ArticleGroup04Key: it.ArticleGroup04Key,
						ArticleGroup05Key: it.ArticleGroup05Key
					}; })
				.distinct();
		};
	}

	document.addEventListener("DatabaseInitialized", function() {
		if (window.database.storageProvider.name === "webSql") {
			configureWebSqlGetDistinctArticleGroupCombinations();
		}
	});
}
setupArticle();
import {namespace} from "@Main/namespace";
import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";
import _ from "lodash";
import {HelperLookup} from "@Main/helper/Helper.Lookup";

export class TreeviewArticleGroupViewModel {
	articleGroup: {Key:string,Value:string,Base64Image:string};
	childArticleGroups: TreeviewArticleGroupViewModel[];
	id: number;
	items: KnockoutObservableArray<Crm.Article.Rest.Model.ObservableCrmArticle_Article>;
	parent: TreeviewArticleGroupViewModel;
	totalItemCount: KnockoutObservable<number>;
	visible: KnockoutObservable<boolean>;
}

export class TreeviewDeliveryDateViewModel {
article:Crm.Article.Rest.Model.ObservableCrmArticle_Article;
deliveryDate: Date;
orderItem?: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem;
quantity?: KnockoutObservable<number>;
save?: () => void;
}

export class BaseOrderDetailsTreeviewTabViewModel extends window.Main.ViewModels.ViewModelBase {
	articleAutocomplete = ko.observable<string>(null);
	articleGroups = ko.observableArray<TreeviewArticleGroupViewModel>([]);
	deliveryDates: KnockoutObservableArray<Date>;
	deliveryDateViewModels: TreeviewDeliveryDateViewModel[] = [];
	parentViewModel: BaseOrderDetailsViewModel;
	lookups: LookupType = {
		articleGroups01: { $tableName: "CrmArticle_ArticleGroup01" },
		articleGroups02: { $tableName: "CrmArticle_ArticleGroup02" },
		articleGroups03: { $tableName: "CrmArticle_ArticleGroup03" },
		articleGroups04: { $tableName: "CrmArticle_ArticleGroup04" },
		articleGroups05: { $tableName: "CrmArticle_ArticleGroup05" },
	};

	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
		this.deliveryDates = parentViewModel.deliveryDates;
		this.articleAutocomplete.subscribe(async articleId => {
			if (articleId != null) {
				const article = await window.database.CrmArticle_Article.find(articleId);
				let articleGroupViewModels = this.articleGroups();
				let selectedArticleGroupViewModel = null;
				for (let i = 1; i <= 5; i++) {
					const articleGroupKey = window.ko.unwrap(article["ArticleGroup0" + i + "Key"]);
					if (articleGroupKey == null) {
						continue;
					}
					selectedArticleGroupViewModel = window.ko.utils.arrayFirst(articleGroupViewModels, function (x) { return x.articleGroup.Key === articleGroupKey; });
					if (!selectedArticleGroupViewModel) {
						continue;
					}
					articleGroupViewModels = selectedArticleGroupViewModel.childArticleGroups;
					if (selectedArticleGroupViewModel.visible()) {
						$(".highlighted-item.animated.flash").removeClass("highlighted-item animated flash");
						window.scrollToSelector("#article-" + this.articleAutocomplete());
						$("#article-" + this.articleAutocomplete()).addClass("highlighted-item animated flash");
					}
					else {
						selectedArticleGroupViewModel.visible(true);
						selectedArticleGroupViewModel.items.subscribe(() => {
							window.scrollToSelector("#article-" + this.articleAutocomplete());
							$("#article-" + this.articleAutocomplete()).addClass("highlighted-item animated flash");
						});
						$("#collapse-" + selectedArticleGroupViewModel.id).on('shown.bs.collapse', () => {
							window.scrollToSelector("#article-" + this.articleAutocomplete());
							$("#article-" + this.articleAutocomplete()).addClass("highlighted-item animated flash");
						});
					}
					$("#collapse-" + selectedArticleGroupViewModel.id).collapse("show");
				}
				while (selectedArticleGroupViewModel != null) {
					const parent = selectedArticleGroupViewModel.parent;
					if (parent != null) {
						(parent.childArticleGroups || parent).forEach(articleGroupViewModel => {
							if (articleGroupViewModel !== selectedArticleGroupViewModel) {
								$("#collapse-" + articleGroupViewModel.id).collapse("hide");
								articleGroupViewModel.visible(false);
							}
						});
					}
					selectedArticleGroupViewModel = parent;
				}
			}
			else {
				this.articleGroups().forEach(articleGroupViewModel => {
					$("#collapse-" + articleGroupViewModel.id).collapse("hide");
					$(".highlighted-item.animated.flash").removeClass("highlighted-item animated flash");
					articleGroupViewModel.visible(false);
				});
			}
		});
	}

	async init(): Promise<void> {
		let viewModel = this;
		await HelperLookup.getLocalizedArrayMaps(this.lookups);
		let articleGroupsWithChildren = await window.Helper.Article.getArticleGroupHierarchy(viewModel.lookups);
		let id = 1;
		function addArticleGroup(parent, articleGroup) {
			let articleGroupViewModel: TreeviewArticleGroupViewModel = {
				items: undefined, totalItemCount: undefined,
				articleGroup: {
					Key: articleGroup.Key,
					Value: articleGroup.Value,
					Base64Image: articleGroup.Base64Image,
				},
				childArticleGroups: [],
				id: id++,
				parent: parent,
				visible: ko.observable<boolean>(false)
			};
			(parent.childArticleGroups || parent).push(articleGroupViewModel);
			articleGroup.Subgroups.forEach(function(subgroup) {
				addArticleGroup(articleGroupViewModel, subgroup);
			});

			const articleListViewModel = new window.Crm.Article.ViewModels.ArticleListIndexViewModel();
			let params = [articleGroupViewModel.articleGroup.Key];
			let currentParent = articleGroupViewModel.parent;
			while (currentParent.articleGroup != undefined) {
				params.push(currentParent.articleGroup.Key)
				currentParent = currentParent.parent
			}
			params = _.reverse(params)
			articleListViewModel.infiniteScroll(true);
			const baseApplyFilters = articleListViewModel.applyFilters;
			articleListViewModel.applyFilters = function (query) {
				let filterStrings = [];
				const level = params.length;
				[1,2,3,4,5].forEach(x => {
					if(x <= level)
						filterStrings.push("(it.ArticleGroup0" + x + "Key === " + (params[x -1] === null ? "null" : ("'" + params[x -1] + "'")) + ")");
					else
						filterStrings.push("(it.ArticleGroup0" + x + "Key === null || it.ArticleGroup0" + x + "Key === '')");
				})
				if(articleGroup.IsEmpty && parent !== viewModel.articleGroups())
					filterStrings.push("false");
				const filterString = filterStrings.join(" && ")
				query = baseApplyFilters.call(this, query);
				query = query.filter(filterString);
				return query;
			}
				const baseInitItems = articleListViewModel.initItems;
				articleListViewModel.initItems = (items: Crm.Article.Rest.Model.ObservableCrmArticle_Article[]): any =>  {
					items.forEach(function (item) {
						item["calculatedPrice"] = ko.observable(null)
						const companyKey = ko.unwrap(viewModel.parentViewModel.companyKey)
						const articleKey = ko.unwrap(item.Id)

						window.database.Crm_Company.find(companyKey).then(company => {
							return window.database.CrmArticle_Price.filter(function (x) {
								return x.ArticleKey == this.articleKey &&
									(x.CompanyKey == this.companyKey ||
										(this.companyPriceGroupKey != null && x.CompanyPriceGroupKey == this.companyPriceGroupKey) ||
										(this.companyPriceLevelKey != null && x.CompanyPriceLevelKey == this.companyPriceLevelKey))
							}, {
								articleKey: articleKey,
								companyKey: company.Id,
								companyPriceGroupKey: company.ExtensionValues.CompanyPriceGroupKey,
								companyPriceLevelKey: company.ExtensionValues.CompanyPriceLevelKey,
							}).include("QuantityUnitEntry").toArray()
						}).then(prices => {
							prices.map(price => {
								const conversionRate = Helper.QuantityUnit.getConversionRate(price.QuantityUnitEntry, item.QuantityUnitEntry)
								price["convertedPrice"] = price.NetPricePerUnit / conversionRate
								return price
							});
							prices = _.orderBy(prices,[(price) => price.CompanyKey, (price) => price.MinQuantity], ["asc", "asc"])
							if (prices.length != 0) {
								item["calculatedPrice"](prices[0]["convertedPrice"])
							}
						})
					})
					return items
					}
			const waitUntilVisible = articleGroupViewModel.visible.subscribe(function (visible) {
				if (visible) {
					waitUntilVisible.dispose();
					articleListViewModel.init().then(function () {
						articleListViewModel.loading(false);
					});
				}
			});

			articleGroupViewModel.items = articleListViewModel.items;
			articleGroupViewModel.totalItemCount = articleListViewModel.totalItemCount;
		}
		articleGroupsWithChildren.forEach(function(articleGroupWithChildren) {
			addArticleGroup(viewModel.articleGroups(), articleGroupWithChildren);
		});
	}

	getDeliveryDateViewModel(deliveryDate: Date, article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): TreeviewDeliveryDateViewModel {
		const viewModel = this;
		viewModel.deliveryDateViewModels = viewModel.deliveryDateViewModels || [];
		let result = viewModel.deliveryDateViewModels.find(function (x) {
			return (x.deliveryDate === deliveryDate || window.moment(x.deliveryDate).isSame(deliveryDate)) && x.article === article;
		});
		if (result) {
			return result;
		}
		result = {
			article: article,
			deliveryDate: deliveryDate
		}
		const findOrderItem = function () {
			return window.ko.utils.arrayFirst(viewModel.parentViewModel.orderItems(),
				function (orderItem) {
					return ko.unwrap(orderItem.ArticleId) === ko.unwrap(article.Id) && (orderItem.DeliveryDate() === deliveryDate || window.moment(orderItem.DeliveryDate()).isSame(window.moment(deliveryDate)));
				}) || null;
		};
		result.orderItem = findOrderItem();
		result.quantity = window.ko.observable(result.orderItem != null ? result.orderItem.QuantityValue() : 0);
		if (!viewModel.parentViewModel.negativeQuantitiesAllowed()) {
			window.ko.validation.addRule(result.quantity, {
				rule: "min",
				message: window.Helper.String.getTranslatedString("RuleViolation.Greater").replace("{0}", window.Helper.String.getTranslatedString("Quantity")).replace("{1}", "0"),
				params: 0
			});
		}
		if (!viewModel.parentViewModel.positiveQuantitiesAllowed()) {
			window.ko.validation.addRule(result.quantity, {
				rule: "max",
				message: window.Helper.String.getTranslatedString("RuleViolation.Less").replace("{0}", window.Helper.String.getTranslatedString("Quantity")).replace("{1}", "0"),
				params: 0
			});
		}
		result.save = async function() {
			if (!result.quantity.isValid()) {
				return;
			}
			result.orderItem = findOrderItem();
			let value = result.quantity();
			value = isNaN(value) ? 0 : value;
			if (result.orderItem == null && value !== 0) {
				await viewModel.parentViewModel.newItem(article);
				viewModel.parentViewModel.selectedItem().DeliveryDate(deliveryDate);
				viewModel.parentViewModel.selectedItem().QuantityValue(value);
				viewModel.parentViewModel.selectedItem().QuantityUnitKey(article.QuantityUnitEntry().QuantityUnitKey());
				viewModel.parentViewModel.selectedItem().Price(ko.unwrap(article["calculatedPrice"]) ?? 0);
				await viewModel.parentViewModel.saveSelectedItem();
				result.orderItem = viewModel.parentViewModel.selectedItem();
			} else {
				if (value === 0) {
					viewModel.parentViewModel.removeOrderItem(result.orderItem, true).then(function() {
						result.orderItem = null;
					});
				} else {
					if (result.orderItem.QuantityValue() !== value) {
						viewModel.parentViewModel.selectedItem(result.orderItem);
						window.database.attachOrGet(result.orderItem);
						viewModel.parentViewModel.selectedItem().QuantityValue(value);
						await viewModel.parentViewModel.saveSelectedItem();
						await viewModel.parentViewModel.updateTotalPrice()
					}
				}
			}
		};
		viewModel.deliveryDateViewModels.push(result);
		return result;
	}

	toggleSelectedArticleGroup(toggledArticleGroupViewModel: TreeviewArticleGroupViewModel): void {
		if ($(".collapsing:visible").length > 0) {
			return;
		}
		function hide(articleGroupViewModel) {
			if (articleGroupViewModel.visible() === true) {
				$("#collapse-" + articleGroupViewModel.id).collapse("hide");
				articleGroupViewModel.visible(false);
				(articleGroupViewModel.childArticleGroups || []).forEach(function(childArticleGroup) {
					hide(childArticleGroup);
				});
			}
		};
		if (!window.ko.isWriteableObservable(toggledArticleGroupViewModel.visible)) {
			return;
		}
		if (toggledArticleGroupViewModel.visible() === true) {
			hide(toggledArticleGroupViewModel);
		} else {
			$("#collapse-" + toggledArticleGroupViewModel.id).collapse("show");
			toggledArticleGroupViewModel.visible(true);
		}
	};

	getArticleSelect2Filter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article>, filter: string): $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article> {
			const language = (document.getElementById("meta.CurrentLanguage") as HTMLMetaElement).content;
			query = query.filter(function (it) { return !(it.ArticleGroup01Key == null && it.ArticleGroup02Key == null && it.ArticleGroup03Key == null && it.ArticleGroup04Key == null && it.ArticleGroup05Key == null); });
			return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
		};
}

namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel = BaseOrderDetailsTreeviewTabViewModel;
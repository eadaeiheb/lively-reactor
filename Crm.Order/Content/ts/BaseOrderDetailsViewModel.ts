import {namespace} from "@Main/namespace";
import {HelperQuantityUnit} from "../../../Crm.Article/Content/ts/helper/Helper.QuantityUnit";

export class BaseOrderDetailsViewModel extends window.Main.ViewModels.ViewModelBase {
	tabs = ko.observable<{}>({});
	alternativeSelectionFor = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>(null);
	alternativeSelectionArticleId = ko.pureComputed<string>(() => {
		return this.alternativeSelectionFor() != null ? this.alternativeSelectionFor().ArticleId() : null;
	});
	alertInfoText = ko.observable<string>(null);
	baseOrder = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_Offer | Crm.Order.Rest.Model.ObservableCrmOrder_Order>(null);
	currencies = ko.observableArray<Main.Rest.Model.Lookups.ObservableMain_Currency>([]);
	contactPerson = ko.observable<Crm.Rest.Model.Crm_Person>(null);

	imageIndex: KnockoutObservable<number> = ko.observable<number>(0);
	quantityUnitGroupKey = ko.pureComputed<string>(() => {
		return this.selectedItem() && this.selectedItem().Article() ? this.selectedItem().Article().QuantityUnitEntryKey() : null;
	});
	quantity = ko.pureComputed<Edm.Decimal>(() => {
		return this.selectedItem() && this.selectedItem().QuantityValue()
	})
	selectedQuantityUnitEntry = ko.observable()
	articleKey = ko.pureComputed<string>(() => {
		return this.selectedItem()?.ArticleId()
	})
	companyKey = ko.pureComputed<string>(() => {
		return this.baseOrder()?.ContactId()
	})
	showActiveArticles = ko.observable<boolean>(true);
	showExpiredArticles = ko.observable<boolean>(false);
	showUpcomingArticles = ko.observable<boolean>(false);
	showAllArticles = ko.pureComputed<boolean>({
		read: () => {
			return this.showActiveArticles() && this.showExpiredArticles() && this.showUpcomingArticles();
		},
		write: (value) => {
			this.showActiveArticles(value);
			this.showExpiredArticles(value);
			this.showUpcomingArticles(value);
		},
		owner: this
	});
	priceSelectorViewModel = null
	deliveryDates = ko.observableArray<Date>([]);
	orderCategory = ko.observable<Crm.Order.Rest.Model.Lookups.CrmOrder_OrderCategory>(null);
	orderEntryTypes = ko.observableArray<Crm.Order.Rest.Model.Lookups.ObservableCrmOrder_OrderEntryType>([]);
	orderItems = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>([]);
	orderRecipients = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_OrderRecipient>([]);
	selectedItem = ko.observable<Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem>(null);
	isNewItem = ko.observable<boolean>(false);
	selectedItemDeliveryDate = ko.pureComputed<Date>({
		read: () => {
			if (!this.selectedItem() || !this.selectedItem().DeliveryDate()) {
				return null;
			}
			return window.ko.utils.arrayFirst(this.deliveryDates(), x => x != null && x.getTime() === this.selectedItem().DeliveryDate().getTime()) || null;
		},
		write: value => {
			if (!this.selectedItem()) {
				return;
			}
			this.selectedItem().DeliveryDate(value);
		},
		owner: this
	});
	totalPurchasePrice = ko.computed<number>(() => {
		const sum = this.orderItems()
			.reduce((x, orderItem) => x + orderItem.PurchasePrice() * orderItem.QuantityValue(), 0);
		return sum;
	});
	totalPrice = ko.computed<number>(() => {
		const sum = this.orderItems()
			.reduce((x, orderItem) => {
					if (!orderItem.IsOption() && !orderItem.IsAlternative()) {
						return x + this.getCalculatedPriceWithDiscount(orderItem)();
					}
					return x;
				},
				0);
		return sum;
	});
	users = ko.observableArray<Main.Rest.Model.ObservableMain_User>([]);
	usergroups = ko.observableArray<Main.Rest.Model.ObservableMain_Usergroup>([]);
	entityWithVisibility = this.baseOrder;
	visibilityAlertText = ko.pureComputed<string>(() => {
		const entityType = this.baseOrder().IsOffer() ? "Offer" : "Order";
		return window.Helper.Visibility.getVisibilityInformationText(this.baseOrder(), entityType, this.users(), this.usergroups());
	});
	setVisibilityAlertText = async() => {};
	lookups: LookupType = {
		vatLevel: {},
		articleGroups01: {$tableName: "CrmArticle_ArticleGroup01"},
		articleGroups02: {$tableName: "CrmArticle_ArticleGroup02"},
		articleGroups03: {$tableName: "CrmArticle_ArticleGroup03"},
		articleGroups04: {$tableName: "CrmArticle_ArticleGroup04"},
		articleGroups05: {$tableName: "CrmArticle_ArticleGroup05"},
		articleTypes: {$tableName: "CrmArticle_ArticleType"},
		currencies: {$tableName: "Main_Currency"},
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"}
	};
	isEditable: KnockoutComputed<boolean>;
	articleHasAccessory: {[key:string]: boolean} = {};

	errors = ko.validation.group(this.selectedItem, {deep: true});

	constructor() {
		super();
		window.Helper.Distinct.createIndex(this.orderItems, "DeliveryDate");
		window.Helper.Distinct.createIndex(this.orderItems, "ParentOrderItemId");

		const setPrice = (value: number) => this.selectedItem()?.Price(value)
		this.priceSelectorViewModel = new window.Crm.Article.ViewModels.PriceSelectorViewModel(this.articleKey, this.companyKey, this.selectedQuantityUnitEntry, this.quantity, setPrice)
	}

	acceptAlternative(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): void {
		this.alternativeSelectionFor(null);
		const parentOrderItem = window.ko.utils.arrayFirst(this.orderItems(), function (x) {
			return x.Id() === orderItem.ParentOrderItemId();
		}) || null;
		const allAlternatives = window.Helper.Distinct.getIndex(this.orderItems, "ParentOrderItemId")[orderItem.ParentOrderItemId()];
		parentOrderItem.ParentOrderItemId(orderItem.Id());
		parentOrderItem.IsAlternative(true);
		allAlternatives.forEach(function (x) {
			if (x.Id() !== orderItem.Id()) {
				x.ParentOrderItemId(orderItem.Id());
			}
		});
		orderItem.IsAlternative(false);
		orderItem.ParentOrderItemId(null);
	}

	async init(id?: string, params?: { companyId: string, orderEntryType: string }): Promise<void> {
		let currencies = await window.database.Main_Currency
			.orderByDescending(function (x) {
				return x.Favorite;
			})
			.orderBy(function (x) {
				return x.SortOrder;
			})
			.toArray();
		this.currencies(currencies.map(x => x.asKoObservable()));
		if (this.baseOrder().VisibleToUserIds().length > 0) {
			let users = await window.database.Main_User
				.filter("it.Id in this.userIds", { userIds: this.baseOrder().VisibleToUserIds() })
				.orderBy(function (it) {
					return it.LastName;
				})
				.orderBy(function (it) {
					return it.FirstName;
				})
				.toArray();
			this.users(users.map(x => x.asKoObservable()));
		}
		if (this.baseOrder().VisibleToUsergroupIds().length > 0) {
			let usergroups = await window.database.Main_Usergroup
				.filter("it.Id in this.usergroupIds", { userGroupids: this.baseOrder().VisibleToUsergroupIds() })
				.orderBy(function (it) {
					return it.Name;
				})
				.toArray();
			this.usergroups(usergroups.map(x => x.asKoObservable()));
		}
		if (this.baseOrder().ContactPersonId()) {
			let person = await window.database.Crm_Person
				.include("Address")
				.include("Address.Emails")
				.find(this.baseOrder().ContactPersonId());
			this.contactPerson(person);
		}
		if (!!this.baseOrder() && !!this.baseOrder().OrderCategoryKey()) {
			let result = await window.database.CrmOrder_OrderCategory
				.first(function (orderCategory) {
					return orderCategory.Key == this.orderCategoryKey;
				}, {orderCategoryKey: this.baseOrder().OrderCategoryKey()})
			this.orderCategory(result);
		}
		if (!!id) {
			let orderItems = await window.database.CrmOrder_OrderItem
				.include2("Article.DocumentAttributes.filter(function(x){ return x.UseForDisplay === true; })")
				.include("Article.DocumentAttributes.FileResource")
				.include("QuantityUnitEntry")
				.filter(function (orderItem) {
					return orderItem.OrderId === this.orderId;
				}, {orderId: this.baseOrder().Id()})
				.orderBy("it.Position")
				.toArray();
			this.orderItems(orderItems.map(x => x.asKoObservable()));
			let recipients = await window.database.CrmOrder_OrderRecipient
				.filter(function (x) {
					return x.BaseOrderId === this.orderId;
				}, {orderId: this.baseOrder().Id})
				.toArray();
			this.orderRecipients(recipients.map(x => x.asKoObservable()).sort((a, b) => a.Email().localeCompare(b.Email())));
		}
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups)

		function deliveryDateCompareFunction(a, b) {
			if (!a && !!b) {
				return -1;
			}
			if (!b && !!a) {
				return 1;
			}
			return a.getTime() - b.getTime();
		}

		this.deliveryDates.subscribe(() => {
			this.deliveryDates.sort(deliveryDateCompareFunction);
		}, null, "arrayChange");
		if (this.baseOrder().OrderEntryType() === "MultiDelivery") {
			const orderItemDeliveryDates = this.orderItems().map(orderItem => orderItem.DeliveryDate());
			let deliveryDates = window._.uniqBy(orderItemDeliveryDates,
				function (x) {
					return x != null ? x.toDateString() : x;
				});
			deliveryDates = deliveryDates.filter(function (it) {
				return it != null
			});
			if (deliveryDates.length > 0) {
				this.deliveryDates(deliveryDates);
			} else {
				this.deliveryDates([null]);
			}
		}
		this.baseOrder()
			.Company.subscribe(company => {
			const companyId = !!company ? window.ko.unwrap(company.Id) : null;
			this.baseOrder().ContactId(companyId);
		});
		if (!!params.companyId) {
			this.baseOrder().ContactId(params.companyId);
			let result = await window.database.Crm_Company.find(this.baseOrder().ContactId());
			this.baseOrder().Company(result.asKoObservable());
		}
		let user = await window.Helper.User.getCurrentUser();

		if (!this.baseOrder().ResponsibleUser()) {
			this.baseOrder().ResponsibleUser(user.Id);
		}
		if (!this.baseOrder().CurrencyKey() && this.currencies().length > 0) {
			this.baseOrder().CurrencyKey(this.currencies()[0].Key());
		}
		let results = await window.database.CrmOrder_OrderEntryType
			.filter(function (x) {
				return x.Language == this.languageKey;
			}, {languageKey: user.DefaultLanguageKey})
			.orderBy(function (x) {
				return x.SortOrder;
			})
			.orderBy(function (x) {
				return x.Value;
			})
			.toArray();
		this.orderEntryTypes(results.map(x => x.asKoObservable()));

		if (!!params.orderEntryType) {
			this.baseOrder().OrderEntryType(params.orderEntryType);
		}
		if (!this.baseOrder().OrderEntryType() && this.orderEntryTypes().length === 1) {
			this.baseOrder().OrderEntryType(this.orderEntryTypes()[0].Key());
		}
		let site = await window.database.Main_Site.GetCurrentSite().first();
		let lookup = await window.Helper.Lookup.getLocalizedArrayMap("CrmArticle_VATLevel", null,
			"it.CountryKey === this.countryKey", {countryKey: site.ExtensionValues.DefaultCountryKey});
		this.lookups.vatLevel = lookup;
		this.priceSelectorViewModel.init()
	}

	addAlternative(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): void {
		$("#infoAlert:visible").trigger("close.bs.alert");
		this.alternativeSelectionFor(orderItem);
		this.alertInfoText(window.Helper.String.getTranslatedString("AlternativeSelectionInformation").replace("{0}", orderItem.ArticleNo()));
		window.scrollToSelector("#infoAlert");
		$("#infoAlert")
			.one("close.bs.alert",
				() => {
					this.alternativeSelectionFor(null);
					this.alertInfoText(null);
				});
	}

	async updateTotalPrice() {
		this.baseOrder().Price(this.totalPrice());
		if (this.baseOrder().innerInstance.entityState === window.$data.EntityState.Added) {
			return;
		}
		window.database.attachOrGet(this.baseOrder().innerInstance);
		this.loading(true);
		await window.database.saveChanges();
		this.loading(false);
	}

	setPosition(selectedItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): void {
		const orderItems = this.orderItems();
		let position = null;
		if (orderItems.length) {
			const mainPos = (orderItems.sort(function (a, b) {
				return parseFloat(a.Position()) - parseFloat(b.Position())
			})[orderItems.length - 1].Position() || "").split(".")[0];
			position = parseInt(mainPos) + 1;
		}
		if (!position) {
			position = 1;
		}
		selectedItem.Position("" + position);
	};

	async saveSelectedItem(): Promise<void> {
		const selectedItem = this.selectedItem();
		if (this.errors().length > 0) {
			this.errors.showAllMessages();
		} else {
			let isNewItem = this.isNewItem();
			if (isNewItem) {
				this.setPosition(selectedItem);
				selectedItem.OrderId(this.baseOrder().Id());
				isNewItem = true;
			}
			this.loading(true);
			let article = await window.database.CrmArticle_Article
				.include2("DocumentAttributes.filter(function(x){ return x.UseForDisplay === true; })")
				.include("DocumentAttributes.FileResource")
				.find(selectedItem.ArticleId());
			selectedItem.Article(article.asKoObservable());
			await window.database.saveChanges();
			if (isNewItem) {
				this.orderItems.push(selectedItem);
				await this.updateTotalPrice()
			} else {
				const itemId = selectedItem.Id();
				this.orderItems.peek().some((element, index, array) => {
					if (element.Id() === itemId) {
						array[index] = selectedItem;
						return true;
					}
					return false;
				});
				this.orderItems.valueHasMutated();
			}
			this.loading(false);
			this.selectedItem(null);
			await this.updateTotalPrice();
			window.Helper.Order.closeSidebar();
		}
	}

	async asOption(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): Promise<void> {
		await this.removeOrderItem(orderItem);
		const newOrderItem = window.database.CrmOrder_OrderItem.defaultType.create(orderItem.innerInstance).asKoObservable();
		newOrderItem.Id(null);
		newOrderItem.Id(window.$data.createGuid().toString().toLowerCase());
		newOrderItem.IsAlternative(false);
		newOrderItem.IsOption(true);
		newOrderItem.ParentOrderItemId(null);
		this.loading(true);
		window.database.add(newOrderItem.innerInstance);
		await window.database.saveChanges();
		this.orderItems.push(newOrderItem);
		await this.updateTotalPrice()
		this.loading(false);
	}

	getAlternatives(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[] {
		const alternatives = window.Helper.Distinct.getIndex(this.orderItems, "ParentOrderItemId")[orderItem.Id()] || [];
		return alternatives.filter(x => x.IsAlternative() === true)
			.sort((a, b) => a.Price() - b.Price());
	}

	getCalculatedPriceWithDiscount(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): KnockoutComputed<number> {
		// @ts-ignore
		orderItem.calculatedPriceWithDiscount = orderItem.calculatedPriceWithDiscount ||
			window.ko.pureComputed<number>(() => {
				return window.Helper.Order.getOrderItemPrice(orderItem);
			});
		// @ts-ignore
		return orderItem.calculatedPriceWithDiscount;
	}

	getSubPositions(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem[] {
		const subPositions = window.Helper.Distinct.getIndex(this.orderItems, "ParentOrderItemId")[orderItem.Id()] || [];
		return subPositions.filter(x => x.IsAlternative() === false)
			.sort((a, b) => a.ArticleNo().localeCompare(b.ArticleNo()));
	}

	negativeQuantitiesAllowed(): boolean {
		return this.orderCategory() == null || window.ko.unwrap(this.orderCategory().AllowNegativeQuantities);
	}

	async newItem(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): Promise<void> {
		const orderItem = window.database.CrmOrder_OrderItem.defaultType.create().asKoObservable();
		const viewModel = this
		orderItem.QuantityValue(this.positiveQuantitiesAllowed() ? 1 : -1);
		// @ts-ignore
		orderItem.articleAutocomplete = window.ko.observable(null);
		// @ts-ignore
		orderItem.getArticleSelect2Filter = function (query, term) {
			const language = (document.getElementById("meta.CurrentLanguage") as HTMLMetaElement).content;
			query = query.filter(function (it) {
				return it.ArticleTypeKey === 'Material' || it.ArticleTypeKey === 'Cost';
			});
			return window.Helper.Article.getArticleAutocompleteFilter(query, term, language);
		}
		const closingEventHandler = (e, deferred) => {
			const entity = window.Helper.Database.getDatabaseEntity(this.selectedItem);
			if (entity && entity.entityState === window.$data.EntityState.Added && entity.changedProperties !== undefined) {
				e.preventDefault();
				window.Helper.Confirm.confirmContinue().then(deferred.resolve, deferred.reject);
			}
		};
		$("#right-nav").on("sidebar.closing", closingEventHandler);
		$("#right-nav").one("sidebar.closed", e => {
			const item = this.selectedItem();
			if (item) {
				window.database.CrmOrder_OrderItem.detach(this.selectedItem().innerInstance);
			}
			this.isNewItem(false);
			this.selectedItem(null);
		});

		if (this.baseOrder().OrderEntryType() === "MultiDelivery") {
			orderItem.DeliveryDate.extend({
				required: {
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryDate")),
					params: true
				}
			});
		}
		orderItem.QuantityValue.extend({
			validation: {
				validator: function (val: number) {
					let quantityUnitStep = 0
					if (viewModel.selectedQuantityUnitEntry())
						quantityUnitStep = ko.unwrap<number>(viewModel.selectedQuantityUnitEntry().QuantityStep)
					else if (viewModel.selectedItem() && viewModel.selectedItem().Article())
						quantityUnitStep = viewModel.selectedItem().Article().QuantityStep()
					if (quantityUnitStep == 0)
						return true
					return (val % quantityUnitStep) == 0;
				},
				message: (val: number) =>
					window.Helper.String.getTranslatedString("RuleViolation.QuantityStep").replace("{0}", viewModel.selectedQuantityUnitEntry() ? ko.unwrap(viewModel.selectedQuantityUnitEntry().QuantityStep) : viewModel.selectedItem()?.Article()?.QuantityStep)
			}
		});
		const self = this
		const initOrderItem = function (value: Crm.Article.Rest.Model.CrmArticle_Article) {
			self.priceSelectorViewModel.hide()
			orderItem.Article(value == null ? null : value.asKoObservable());
			orderItem.ArticleId(value == null ? null : value.Id);
			orderItem.ArticleNo(value == null ? null : value.ItemNo);
			orderItem.ArticleDescription(value == null ? null : window.Helper.Article.getArticleDescription(value));
			orderItem.DiscountType(window.Crm.Article.Model.Enums.DiscountType.Absolute);
			orderItem.Price((value == null ? null : value.Price) || 0);
			orderItem.PurchasePrice(value == null ? null : value.PurchasePrice);
			if (value == null)
				orderItem.QuantityUnitKey(null)
			else
				orderItem.QuantityUnitKey(value.QuantityUnitEntry ? value.QuantityUnitEntry.QuantityUnitKey : value.QuantityUnitKey)
			orderItem.QuantityUnitEntryKey(value == null ? null : value.QuantityUnitEntryKey)
		};
		this.selectedItem(orderItem);
		// @ts-ignore
		orderItem.onArticleSelect = initOrderItem;
		initOrderItem(window.Helper.Database.getDatabaseEntity(article));
		if (article === null) {
			this.isNewItem(true);
		} else {
			this.setPosition(this.selectedItem());
			this.selectedItem().OrderId(this.baseOrder().Id());
			if (this.selectedItem().QuantityUnitKey() === null || this.selectedItem().QuantityUnitKey() === undefined)
				this.selectedItem().QuantityUnitKey(article.QuantityUnitEntry().QuantityUnitKey())
			this.orderItems.push(this.selectedItem());
			await this.updateTotalPrice()
		}
		window.database.add(orderItem);
	}

	positiveQuantitiesAllowed(): boolean {
		return this.orderCategory() == null || window.ko.unwrap(this.orderCategory().AllowPositiveQuantities);
	}

	async removeOrderItem(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem, silent: boolean = false): Promise<void> {
		if (this.selectedItem() === orderItem) {
			this.selectedItem(null);
		}
		const indexOf = this.orderItems().indexOf(orderItem);
		if (indexOf !== -1) {
			this.orderItems.splice(indexOf, 1);
			window.database.remove(orderItem.innerInstance);
			this.loading(true);
			await window.database.saveChanges();
			this.loading(false);
			if (silent === true) {
				return;
			}
			this.showSnackbar(window.Helper.String.getTranslatedString("OrderItemRemoved"),
				window.Helper.String.getTranslatedString("Undo"),
				async () => {
					this.loading(true);
					const newOrderItem = window.database.CrmOrder_OrderItem.defaultType.create(orderItem.innerInstance).asKoObservable();
					newOrderItem.Id(window.$data.createGuid().toString().toLowerCase());
					window.database.add(newOrderItem.innerInstance);
					await window.database.saveChanges();
					this.orderItems.splice(indexOf, 0, newOrderItem);
					this.loading(false);
				});
		}
	}

	async selectItem(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): Promise<void> {
		this.loading(true);
		let oi = await window.database.CrmOrder_OrderItem
			.include2("Article.DocumentAttributes.filter(function(x){ return x.UseForThumbnail === true; })")
			.include("Article.DocumentAttributes.FileResource")
			.include("QuantityUnitEntry")
			.find(orderItem.Id());
		this.selectedItem(oi.asKoObservable());
		window.database.attachOrGet(oi);
		const viewModel = this
		this.selectedItem().QuantityValue.extend({
			validation: {
				validator: function (val: number) {
					let quantityUnitStep = 0
					if (viewModel.selectedQuantityUnitEntry())
						quantityUnitStep = ko.unwrap<number>(viewModel.selectedQuantityUnitEntry().QuantityStep)
					else if (viewModel.selectedItem() && viewModel.selectedItem().Article())
						quantityUnitStep = viewModel.selectedItem().Article().QuantityStep()
					if (quantityUnitStep == 0)
						return true
					return window.Helper.Number.countDecimals(quantityUnitStep) >= window.Helper.Number.countDecimals(val);
				},
				message: (val: number) => window.Helper.String.getTranslatedString("RuleViolation.QuantityStep").replace("{0}", ko.unwrap(viewModel.selectedQuantityUnitEntry()?.QuantityStep)),
			}
		});
		this.loading(false);
		const closingEventHandler = (e, deferred) => {
			const entity = window.Helper.Database.getDatabaseEntity(this.selectedItem);
			if (entity && entity.entityState === window.$data.EntityState.Modified) {
				e.preventDefault();
				window.Helper.Confirm.confirmContinue().then(deferred.resolve, deferred.reject);
			}
		};
		$("#right-nav").on("sidebar.closing", closingEventHandler);
		$("#right-nav").one("sidebar.closed", e => {
			const item = this.selectedItem();
			if (item) {
				window.database.CrmOrder_OrderItem.detach(this.selectedItem().innerInstance);
			}
			this.selectedItem(null);
			$("#right-nav").off("sidebar.closing", closingEventHandler);
		});
	}

	async sendConfirmation(): Promise<void> {
		if (!this.hasCustomerEmail()) {
			window.swal(window.Helper.String.getTranslatedString("NoContactEmailPresent"), window.Helper.String.getTranslatedString("Warning_NoContactEmailPresent"), "warning");
			return;
		}
		window.database.attachOrGet(this.baseOrder().innerInstance);
		this.baseOrder().SendConfirmation(true);
		this.baseOrder().ConfirmationSent(false);
		await window.database.saveChanges();
		this.showSnackbar(window.Helper.String.getTranslatedString("OrderWillBeSent").replace("{0}", this.baseOrder().OrderNo()).replace("{1}", this.orderRecipients().map(x => x.Email()).join(", ")));
		this.loading(false);
	}

	hasCustomerEmail(): boolean {
		return this.orderRecipients().length > 0;
	}

	toggleDiscountType(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): void {
		if (orderItem.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage) {
			orderItem.DiscountType(window.Crm.Article.Model.Enums.DiscountType.Absolute);
		} else {
			orderItem.DiscountType(window.Crm.Article.Model.Enums.DiscountType.Percentage);
		}
	}

	async refresh(): Promise<void> {
	};

	getCurrencyValue(currencyKey: string): string {
		const currency = window.ko.utils.arrayFirst(this.currencies(), currency => currency.Key() === currencyKey);
		return !!currency ? currency.Value() : "";
	}

	getDiscountPercentageValue(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): number {
		const value = (orderItem.Discount() / orderItem.Price()) * 100;
		return parseFloat(value.toFixed(2));
	}

	getDiscountExactValue(orderItem: Crm.Order.Rest.Model.ObservableCrmOrder_OrderItem): number {
		const value = (orderItem.Discount() * (orderItem.Price() * orderItem.QuantityValue())) / 100;
		return parseFloat(value.toFixed(2));
	}

	onQuantityUnitEntrySelect(quantityUnitEntry : Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry) {
		this.selectedQuantityUnitEntry(quantityUnitEntry)
		if(this.selectedItem() === null || this.selectedItem() === undefined)
			return
		if(quantityUnitEntry && this.selectedItem().QuantityUnitEntry()) {
			const conversionRate = HelperQuantityUnit.getConversionRate(this.selectedItem().QuantityUnitEntry, quantityUnitEntry)
			this.selectedItem().Price(this.selectedItem().Price() / conversionRate)
			this.selectedItem().PurchasePrice(this.selectedItem().PurchasePrice() / conversionRate)
			this.selectedItem().QuantityValue(this.selectedItem().QuantityValue() * conversionRate)
		}
		if(quantityUnitEntry == null)
			this.selectedItem().QuantityUnitEntry(null)
		else if (this.selectedItem().QuantityUnitEntry() == null || this.selectedItem().QuantityUnitEntry().Id() !== quantityUnitEntry.Id) {
			this.selectedItem().QuantityUnitEntry(quantityUnitEntry.asKoObservable())
			this.selectedItem().QuantityStep(quantityUnitEntry.QuantityStep)
			this.selectedItem().QuantityUnitKey(quantityUnitEntry.QuantityUnitKey)
		}
	}

	hasAccessory(articleId: string): KnockoutObservable<boolean> {
		if (this.articleHasAccessory[articleId] !== undefined) {
			return ko.observable(this.articleHasAccessory[articleId]);
		}
		let result = ko.observable(false);
		window.database.CrmArticle_ArticleRelationship
			.filter("it.ParentId === this.parentId && it.RelationshipTypeKey === 'Accessory'", {parentId: articleId})
			.count().then((count) => {
				this.articleHasAccessory[articleId] = count > 0;
				result(count > 0);
			});
		return result;
	}

	getDocumentAttributeCount(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): number {
		return window._.size(article.DocumentAttributes());
	}

	getDocumentAttributeByCurrentIndex(article: Crm.Article.Rest.Model.ObservableCrmArticle_Article): Crm.Rest.Model.ObservableCrm_DocumentAttribute {
		const adjustedIndex = Math.abs(this.imageIndex()) % this.getDocumentAttributeCount(article);
		return window._.orderBy(article.DocumentAttributes(), x => x.UseForThumbnail()).reverse()[adjustedIndex];
	}

	stepImageLeft(): void {
		this.imageIndex(this.imageIndex() - 1);
	};

	stepImageRight(): void {
		this.imageIndex(this.imageIndex() + 1);
	};
}

namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel ||= BaseOrderDetailsViewModel;
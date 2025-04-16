import type {BaseOrderDetailsViewModel} from "./BaseOrderDetailsViewModel";
import {namespace} from "@Main/namespace";

export class BaseOrderDetailsCalculationTabViewModel extends window.Main.ViewModels.ViewModelBase {
	parentViewModel: BaseOrderDetailsViewModel;
	basePrice = ko.observable<number>(0);
	baseSalesPrice = ko.observable<number>(0);
	calculatedPurchasePrice = ko.observable<number>(0);
	calculatedSalesPrice = ko.observable<number>(0);
	calculationParameters = ko.observableArray<{ Amount: KnockoutObservable<number>, AmountSales: KnockoutObservable<number>, Name: string, Calculation: (purchasePrice: number, salesPrice: number) => { Amount: number, AmountSales: number }, Details: KnockoutObservable<{ Name: string, Amount: number, AmountSales: number }[]>, ShowDiff: boolean }>([{
		Amount: ko.observable<number>(null),
		AmountSales: ko.observable<number>(null),
		Name: window.Helper.String.getTranslatedString("Sum"),
		Calculation: function (purchasePrice: number, salesPrice: number): { Amount: number, AmountSales: number } {
			return {
				Amount: purchasePrice,
				AmountSales: salesPrice
			};
		},
		Details: ko.observableArray<{ Name: string, Amount: number, AmountSales: number }>([]),
		ShowDiff: false
	}]);

	calculationPositions = ko.observableArray<Crm.Order.Rest.Model.ObservableCrmOrder_CalculationPosition>([]);
	calculationPositionTypes = ko.observableArray<Crm.Order.Rest.Model.Lookups.ObservableCrmOrder_CalculationPositionType>([]);
	nonDefaultCalculationPositionTypes = ko.pureComputed<Crm.Order.Rest.Model.Lookups.ObservableCrmOrder_CalculationPositionType[]>(() => {
		return window.ko.utils.arrayFilter(this.calculationPositionTypes(), calculationPositionType => calculationPositionType.IsDefault() === false);
	});
	selectedCalculationPositionType = ko.observable<string>(null).extend({
		required: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("CalculationPositionType")),
			params: true
		}
	});
	salesPrice: KnockoutObservable<number>;
	marginAbsolute = ko.pureComputed<number>(() => {
		if (this.salesPrice.isValid()) {
			return this.salesPrice() - this.calculatedPurchasePrice();
		}
		return null;
	});
	marginRelative = ko.pureComputed<number>(() => {
		if (this.calculatedPurchasePrice() === 0) {
			return 0;
		}
		return ((this.marginAbsolute() / this.calculatedPurchasePrice()) * 100) || 0;
	});
	marginSalesAbsolute = ko.pureComputed<number>(() => {
		if (this.salesPrice.isValid()) {
			return this.salesPrice() - this.calculatedSalesPrice();
		}
		return null;
	});
	marginSalesRelative = ko.pureComputed<number>(() => {
		if (this.calculatedSalesPrice() === 0) {
			return 0;
		}
		return ((this.marginSalesAbsolute() / this.calculatedSalesPrice()) * 100) || 0;
	});

	constructor(parentViewModel: BaseOrderDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
		this.salesPrice = ko.validatedObservable<number>(parentViewModel.baseOrder().Price());
		this.salesPrice.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("SalesPrice")),
				params: true
			},
			validation: [
				{
					rule: "min",
					message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
						.replace("{0}", window.Helper.String.getTranslatedString("SalesPrice")),
					params: 0
				}
			]
		});
		this.calculationPositions.subscribe(() => {
			this.calculate();
		});
		parentViewModel.orderItems.subscribe(() => {
			this.calculate();
		});
		parentViewModel.isEditable.subscribe(() => {
			if (parentViewModel.isEditable() === false && !this.salesPrice.isValid()) {
				this.salesPrice(parentViewModel.baseOrder().Price());
			}
		});
		this.salesPrice.subscribe(() => {
			if (this.salesPrice.isValid()) {
				this.calculate();
			}
		});
	}

	async init(): Promise<void> {
		if (this.parentViewModel.baseOrder().OrderEntryType() === "SingleDelivery" || this.parentViewModel.baseOrder().OrderEntryType() === "MultiDelivery") {
			this.basePrice(this.parentViewModel.totalPurchasePrice() || 0);
			this.baseSalesPrice(this.parentViewModel.totalPrice() || 0);
			this.parentViewModel.totalPrice.subscribe(value => {
				this.baseSalesPrice(value || 0);
			});
		}
		let user = await window.Helper.User.getCurrentUser();
		let calculationPositionTypes = await window.database.CrmOrder_CalculationPositionType
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
		this.calculationPositionTypes(calculationPositionTypes.map(x => x.asKoObservable()));
		let calculationPositions = await window.database.CrmOrder_CalculationPosition
			.filter(function (x) {
				return x.BaseOrderId == this.baseOrderId;
			}, {baseOrderId: this.parentViewModel.baseOrder().Id()}).toArray();

		this.calculationPositions(calculationPositions.map(x => {
			window.database.attachOrGet(x)
			const result = x.asKoObservable();
			const calculationPositionType = window.ko.utils.arrayFirst(this.calculationPositionTypes(), function (x) {
				return x.Key() === result.CalculationPositionTypeKey();
			}) || null;
			// @ts-ignore
			result.CalculationPositionType = calculationPositionType;
			return result;
		}));
		this.initDefaultCalculationPositions();
		await this.calculate();
	}

	addCalculationPosition(): void {
		if (!this.selectedCalculationPositionType.isValid()) {
			window.ko.validation.group(this.selectedCalculationPositionType).showAllMessages();
			return;
		}
		const selectedCalculationPositionTypeKey = this.selectedCalculationPositionType();
		const calculationPositionType = window.ko.utils.arrayFirst(this.calculationPositionTypes(), function (x) {
			return x.Key() === selectedCalculationPositionTypeKey;
		});
		const newCalculationPosition = window.database.CrmOrder_CalculationPosition.defaultType.create().asKoObservable();
		window.database.add(newCalculationPosition.innerInstance);
		newCalculationPosition.BaseOrderId(this.parentViewModel.baseOrder().Id());
		// @ts-ignore
		newCalculationPosition.CalculationPositionType = calculationPositionType;
		newCalculationPosition.CalculationPositionTypeKey(calculationPositionType.Key());
		this.calculationPositions.unshift(newCalculationPosition);
	}

	async calculate(): Promise<void> {
		this.loading(true);
		let purchasePrice = this.basePrice();
		let salesPrice = this.baseSalesPrice();
		this.calculationParameters().forEach(calculationParameter => {
			const newPrices = calculationParameter.Calculation(purchasePrice, salesPrice);
			const newPurchasePrice = newPrices.Amount;
			const newSalesPrice = newPrices.AmountSales;
			calculationParameter.Amount(calculationParameter.ShowDiff ? (newPurchasePrice - purchasePrice) : newPurchasePrice);
			calculationParameter.AmountSales(calculationParameter.ShowDiff ? (newSalesPrice - salesPrice) : newSalesPrice);
			purchasePrice = newPurchasePrice;
			salesPrice = newSalesPrice;
		});
		this.calculationPositions().forEach(calculationPosition => {
			const calculationPositionType = window.ko.utils.arrayFirst(this.calculationPositionTypes(), function (x) {
				return x.Key() === calculationPosition.CalculationPositionTypeKey();
			});
			const purchaseAmount = calculationPositionType.IsAbsolute() ? calculationPosition.PurchasePrice() : (calculationPosition.PurchasePrice() / 100 * purchasePrice);
			const salesAmount = calculationPositionType.IsAbsolute() ? calculationPosition.SalesPrice() : (calculationPosition.SalesPrice() / 100 * salesPrice);
			if (calculationPositionType.IsDiscount() === true) {
				if (calculationPosition.IsPercentage()) {
					purchasePrice = purchasePrice * (100 - purchaseAmount) / 100 || 0;
					salesPrice = salesPrice * (100 - salesAmount) / 100 || 0;
				} else {
					purchasePrice = purchasePrice - purchaseAmount || 0;
					salesPrice = salesPrice - salesAmount || 0;
				}
			} else {
				purchasePrice = purchasePrice + purchaseAmount || 0;
				salesPrice = salesPrice + salesAmount || 0;
			}
		});
		this.calculatedPurchasePrice(purchasePrice);
		if (!this.salesPrice() || this.salesPrice() === this.calculatedSalesPrice()) {
			this.salesPrice(salesPrice);
		}
		if (this.calculatedSalesPrice() !== salesPrice) {
			this.calculatedSalesPrice(salesPrice);
		}
		this.parentViewModel.baseOrder().Price(this.salesPrice() || this.parentViewModel.totalPrice() || 0);
		if (this.parentViewModel.baseOrder().innerInstance.entityState === $data.EntityState.Added) {
			this.loading(false);
			return;
		}
		await window.database.saveChanges();
		this.calculationPositions().forEach(function (calculationPosition) {
			window.database.attachOrGet(calculationPosition.innerInstance);
		});
		window.database.attachOrGet(this.parentViewModel.baseOrder().innerInstance);
		this.loading(false);
	}

	initDefaultCalculationPositions(): void {
		this.calculationPositionTypes().forEach(calculationPositionType => {
			const isMissingFromCalculation = calculationPositionType.IsDefault() === true && window.ko.utils.arrayFirst(this.calculationPositions(), function (calculationPosition) {
				return calculationPosition.CalculationPositionTypeKey() === calculationPositionType.Key()
			}) === null;
			if (isMissingFromCalculation) {
				const newCalculationPosition = window.database.CrmOrder_CalculationPosition.defaultType.create().asKoObservable();
				window.database.add(newCalculationPosition.innerInstance);
				newCalculationPosition.BaseOrderId(this.parentViewModel.baseOrder().Id());
				// @ts-ignore
				newCalculationPosition.CalculationPositionType = calculationPositionType;
				newCalculationPosition.CalculationPositionTypeKey(calculationPositionType.Key());
				this.calculationPositions.push(newCalculationPosition);
			}
		});
	}

	removeCalculationPosition(calculationPosition: Crm.Order.Rest.Model.ObservableCrmOrder_CalculationPosition): void {
		window.database.remove(calculationPosition.innerInstance);
		const index = this.calculationPositions.indexOf(calculationPosition);
		this.calculationPositions.remove(calculationPosition);
		this.showSnackbar(window.Helper.String.getTranslatedString("CalculationPositionRemoved"), window.Helper.String.getTranslatedString("Undo"), () => {
			const newCalculationPosition = window.database.CrmOrder_CalculationPosition.defaultType.create().asKoObservable();
			window.database.add(newCalculationPosition.innerInstance);
			newCalculationPosition.BaseOrderId(calculationPosition.BaseOrderId());
			// @ts-ignore
			newCalculationPosition.CalculationPositionType = calculationPosition.CalculationPositionType;
			newCalculationPosition.CalculationPositionTypeKey(calculationPosition.CalculationPositionTypeKey());
			newCalculationPosition.PurchasePrice(calculationPosition.PurchasePrice());
			newCalculationPosition.SalesPrice(calculationPosition.SalesPrice());
			newCalculationPosition.Remark(calculationPosition.Remark());
			this.calculationPositions.splice(index, 0, newCalculationPosition);
		});
	}

	togglePercentage(calculationPosition: Crm.Order.Rest.Model.ObservableCrmOrder_CalculationPosition): void {
		if (calculationPosition.IsPercentage()) {
			calculationPosition.IsPercentage(false);
		} else {
			calculationPosition.IsPercentage(true);
		}
		this.calculate();
	}
}

namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel = BaseOrderDetailsCalculationTabViewModel;
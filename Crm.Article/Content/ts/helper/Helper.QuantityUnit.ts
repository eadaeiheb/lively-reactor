import _ from "lodash";

export class HelperQuantityUnit {

	static mapQuantityUnitGroupForSelect2Display(qtyUnit: Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry): {
		id: string,
		item: Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry,
		text: string
	} {
		return {
			id: qtyUnit.Id,
			item: qtyUnit.asKoObservable(),
			text: qtyUnit.Name
		};
	}

	static getConversionRate(quantityUnitA: Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry | Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry | KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry>, quantityUnitB: Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry | Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry | KnockoutObservable<Crm.Article.Rest.Model.ObservableCrmArticle_QuantityUnitEntry>) {
		let a = window.Helper.Database.getDatabaseEntity<Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry>(quantityUnitA);
		let b = window.Helper.Database.getDatabaseEntity<Crm.Article.Rest.Model.CrmArticle_QuantityUnitEntry>(quantityUnitB);
		if (a.Id === b.Id) {
			return 1;
		}
		if (!a.IsGroup && b.IsGroup) {
			return 1 / window.Helper.QuantityUnit.getConversionRate(b, a);
		}
		if (a.IsGroup && !b.IsGroup) {
			return b.Divisor / b.Factor;
		}
		if (!a.IsGroup && !b.IsGroup) {
			let factorA = a.Factor;
			let factorB = b.Factor;
			let divisorA = a.Divisor;
			let divisorB = b.Divisor;
			return (factorA * divisorB) / (factorB * divisorA)
		}
		return 1;
	}

	static getQuantityUnitEntryAutocompleteOptions(viewModel, quantityUnitGroupId: string | KnockoutObservable<string> = null, searchGroups = false, onSelectContext = null): Select2AutoCompleterOptions {
		const language = (document.getElementById("meta.CurrentLanguage") as any).content;
		viewModel = viewModel ?? {};
		onSelectContext = onSelectContext ?? viewModel
		return {
			table: "CrmArticle_QuantityUnitEntry",
			orderBy: ["QuantityUnitKey"],
			mapDisplayObject: function (qtyUnit) {
				return {
					id: qtyUnit.Id,
					text: qtyUnit.Name == null || qtyUnit.Name == "" ? qtyUnit["$translation"] : qtyUnit.Name + " - " + qtyUnit["$translation"],
					item: qtyUnit.asKoObservable()
				};
			},
			onResult: async function (results) {
				const qtyUnitKeys = _.uniq(results.map((qtyUnit) => qtyUnit.QuantityUnitKey))
				let translations: any = await window.database.CrmArticle_QuantityUnit
					.filter("it.Key in this.qtyUnitKeys && it.Language === this.language", {
						qtyUnitKeys: qtyUnitKeys,
						language: language
					})
					.map(function (x) {
						return {Key: x.Key, Value: x.Value};
					})
					.toArray()
				translations = Object.fromEntries(translations.map((t) => [t.Key, t.Value]))
				return results.map(qtyUnit => {
					qtyUnit["$translation"] = translations[qtyUnit.QuantityUnitKey]
					return qtyUnit
				})
			},
			customFilter: function (query, filter) {
				if (searchGroups) {
					query = query.filter('IsGroup', '===', true)
					if (filter)
						query.filter("filterByQuantityTranslation", {language: language, filter: filter});
					return query
				} else {
					let groupId = window.ko.unwrap(quantityUnitGroupId);
					if (!groupId)
						return query.filter("false")
					query = query.filter(function (qtyUnit) {
						return qtyUnit.Id === this.groupId || qtyUnit.QuantityUnitGroupKey === this.groupId
					}, {groupId: groupId})
					if (filter)
						query = query.filter("filterByQuantityTranslation", {language: language, filter: filter});
					return query
				}
			},
			onSelect: viewModel.onQuantityUnitEntrySelect ? viewModel.onQuantityUnitEntrySelect.bind(onSelectContext) : undefined,
		};
	}
}

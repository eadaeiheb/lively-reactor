import type {CompanyDetailsViewModel} from "@Crm/CompanyDetailsViewModel";
import {namespace} from "@Main/namespace";

export class CompanyDetailsOrdersTabViewModel extends window.Crm.Order.ViewModels.OrderListIndexViewModel {
	companyId = ko.observable<string>(null);

	constructor(parentViewModel: CompanyDetailsViewModel) {
		super();
		this.isTabViewModel(true);
		const companyId = parentViewModel.company().Id();
		this.companyId(companyId);
		this.getFilter("ContactId").extend({filterOperator: "==="})(companyId);
	}

	applyOrderBy(query: $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Order>): $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Order> {
		const keys = this.lookups.statuses.$array.filter(x => x.Key !== null).map(x => x.Key);
		if (keys.length > 0) {
			// @ts-ignore
			query = query.orderByDescending("orderByArray", {property: "StatusKey", values: keys});
		}
		return super.applyOrderBy(query);
	};

	getItemGroup(order: Crm.Order.Rest.Model.ObservableCrmOrder_Order): ItemGroup {
		return {
			title: window.Helper.Lookup.getLookupValue(this.lookups.statuses, order.StatusKey())
		};
	};
}

namespace("Crm.ViewModels").CompanyDetailsOrdersTabViewModel = CompanyDetailsOrdersTabViewModel;
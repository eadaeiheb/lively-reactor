import {namespace} from "@Main/namespace";
import type {CompanyDetailsViewModel} from "@Crm/CompanyDetailsViewModel";

export class CompanyDetailsOffersTabViewModel extends window.Crm.Order.ViewModels.OfferListIndexViewModel {
	companyId = ko.observable<string>(null);

	constructor(parentViewModel: CompanyDetailsViewModel) {
		super();
		this.isTabViewModel(true);
		const companyId = parentViewModel.company().Id();
		this.companyId(companyId);
		this.getFilter("ContactId").extend({filterOperator: "==="})(companyId);
	}

	applyOrderBy(query: $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Offer>): $data.Queryable<Crm.Order.Rest.Model.CrmOrder_Offer> {
		const viewModel = this;
		const keys = viewModel.lookups.statuses.$array.filter(x => x.Key !== null).map(x => x.Key);
		if (keys.length > 0) {
			// @ts-ignore
			query = query.orderByDescending("orderByArray", {property: "StatusKey", values: keys});
		}
		return super.applyOrderBy(query);
	};

	getItemGroup(offer: Crm.Order.Rest.Model.ObservableCrmOrder_Offer): ItemGroup {
		return {
			title: window.Helper.Lookup.getLookupValue(this.lookups.statuses, offer.StatusKey())
		};
	};
}

namespace("Crm.ViewModels").CompanyDetailsOffersTabViewModel = CompanyDetailsOffersTabViewModel;
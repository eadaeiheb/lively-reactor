export class CompanyDetailsViewModelExtension extends window.Crm.ViewModels.CompanyDetailsViewModel {
	constructor() {
		super();
		this.lookups.companyPriceGroups = {$tableName: "CrmArticle_CompanyPriceGroup"};
		this.lookups.companyPriceLevels = {$tableName: "CrmArticle_CompanyPriceLevel"};
	}
}

window.Crm.ViewModels.CompanyDetailsViewModel = CompanyDetailsViewModelExtension;
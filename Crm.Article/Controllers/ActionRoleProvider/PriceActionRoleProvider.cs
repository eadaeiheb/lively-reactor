namespace Crm.Article.Controllers.ActionRoleProvider
{
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class PriceActionRoleProvider: RoleCollectorBase
	{
		public PriceActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(PermissionGroup.WebApi, nameof(CompanyPriceGroup), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(CompanyPriceLevel), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Price), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);

			Add(ArticlePlugin.PermissionGroup.Article, ArticlePlugin.PermissionName.PricesTab, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);
			Add(ArticlePlugin.PermissionGroup.Article, ArticlePlugin.PermissionName.QuantityUnitsTab, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);

		}
	}
}

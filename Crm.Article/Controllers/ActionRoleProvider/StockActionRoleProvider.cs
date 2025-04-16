namespace Crm.Article.Controllers.ActionRoleProvider
{
	using Crm.Article.Model;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class StockActionRoleProvider : RoleCollectorBase
	{
		public StockActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(PermissionGroup.WebApi, nameof(Stock), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Serial), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, Roles.APIUser);
		}
	}
}

namespace Crm.Article.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	using Main;

	public class GenericListActionRoleProvider : RoleCollectorBase
	{
		public GenericListActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ArticlePlugin.PermissionGroup.Article, MainPlugin.PermissionName.ExportAsCsv, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.SalesBackOffice);
			Add(ArticlePlugin.PermissionGroup.Article, MainPlugin.PermissionName.Ics, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(ArticlePlugin.PermissionGroup.Article, MainPlugin.PermissionName.Rss, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
		}
	}
}

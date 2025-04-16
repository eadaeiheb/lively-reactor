namespace Crm.Article.Controllers.ActionRoleProvider
{
	using System.Linq;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class ArticleDowntimeActionRoleProvider : RoleCollectorBase
	{

		public ArticleDowntimeActionRoleProvider(IPluginProvider pluginProvider) : base(pluginProvider)
		{
			var roles = new [] { CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser };
			Add(PermissionGroup.WebApi, nameof(ArticleDowntime), roles);
			Add(PermissionGroup.WebApi, nameof(ArticleDowntimeReason), roles);
		}
	}
}

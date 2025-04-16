namespace Crm.Order.Controllers.ActionRoleProvider
{
	using System.Linq;

	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	using Main;

	public class ErpIntegrationActionRoleProvider : RoleCollectorBase
	{
		public ErpIntegrationActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			if (pluginProvider.ActivePluginNames.Contains("Main.Replication"))
			{
				Add(OrderPlugin.PermissionGroup.Replication,
					PermissionName.Import,
					CrmPlugin.Roles.HeadOfSales,
					CrmPlugin.Roles.SalesBackOffice);
				Add(OrderPlugin.PermissionGroup.Replication,
					PermissionName.Export,
					CrmPlugin.Roles.HeadOfSales,
					CrmPlugin.Roles.SalesBackOffice);
			}
		}
	}
}

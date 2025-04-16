namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	using Main;

	public class GenericListActionRoleProvider : RoleCollectorBase
	{
		public GenericListActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			var genericListTypes = new[]
			{
				OrderPlugin.PermissionGroup.Offer,
				OrderPlugin.PermissionGroup.Order
			};

			foreach (var permissionGroup in genericListTypes)
			{
				Add(permissionGroup, MainPlugin.PermissionName.ExportAsCsv, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.SalesBackOffice);
				Add(permissionGroup, MainPlugin.PermissionName.Ics, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
				Add(permissionGroup, MainPlugin.PermissionName.Rss, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			}
		}
	}
}

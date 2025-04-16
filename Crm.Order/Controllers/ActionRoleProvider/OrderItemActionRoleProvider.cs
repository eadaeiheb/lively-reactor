namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	using Main;

	public class OrderItemActionRoleProvider : RoleCollectorBase
	{
		public OrderItemActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			
			Add(OrderPlugin.PermissionGroup.OfferItem, PermissionName.Remove, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.OrderItem, PermissionName.Remove, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
		}
	}
}

namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Order.Model;
	using Crm.Order.Model.Lookups;

	using Main;

	public class OrderActionRoleProvider : RoleCollectorBase
	{
		public OrderActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(CrmPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OrderTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(CrmPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OrderTab, CrmPlugin.PermissionGroup.Company, PermissionName.Read);

			Add(OrderPlugin.PermissionGroup.Order, PermissionName.View, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Index, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Read, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Read, OrderPlugin.PermissionGroup.Order, PermissionName.Index);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Create, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Create, OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.PreviewOrder);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Create, OrderPlugin.PermissionGroup.Order, PermissionName.Edit);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Edit, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Edit, OrderPlugin.PermissionGroup.Order, PermissionName.Load);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.Load, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.Load, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, PermissionName.CalendarEntry, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, PermissionName.CalendarEntry, OrderPlugin.PermissionGroup.Order, PermissionName.Read);

			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddAccessory, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddAccessory, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddDelivery, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddDelivery, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.Complete, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.PreviewOrder, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.PreviewOrder, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SimpleTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SimpleTab, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.TreeTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.TreeTab, OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.AddDelivery);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SummaryTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SummaryTab, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.CloseOrder, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.CloseOrder, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SendOrder, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SendOrder, OrderPlugin.PermissionGroup.Order, PermissionName.Read);
			Add(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SeeAllUsersOrders, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Order, OrderPlugin.PermissionName.SeeAllUsersOrders, OrderPlugin.PermissionGroup.Order, PermissionName.Read);

			Add(MainPlugin.PermissionGroup.TopSearch, nameof(Order), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);

			Add(PermissionGroup.WebApi, nameof(CalculationPosition), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(CalculationPositionType), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Offer), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Order), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderCategory), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderEntryType), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderItem), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderStatus), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderCancelReasonCategory), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(OrderRecipient), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
		}
	}
}

namespace Crm.Order.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Order.Model;

	using Main;

	public class OfferActionRoleProvider : RoleCollectorBase
	{
		public OfferActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(CrmPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OfferTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(CrmPlugin.PermissionGroup.Company, OrderPlugin.PermissionName.OfferTab, CrmPlugin.PermissionGroup.Company, PermissionName.Read);

			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.View, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Index, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Read, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Read, OrderPlugin.PermissionGroup.Offer, PermissionName.Index);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Create, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Create, OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.PreviewOffer);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Create, OrderPlugin.PermissionGroup.Offer, PermissionName.Edit);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Edit, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Edit, OrderPlugin.PermissionGroup.Offer, PermissionName.Load);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.Load, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.Load, OrderPlugin.PermissionGroup.Offer, PermissionName.Index);
			Add(OrderPlugin.PermissionGroup.Offer, PermissionName.CalendarEntry, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, PermissionName.CalendarEntry, OrderPlugin.PermissionGroup.Offer, PermissionName.Index);
			
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddAccessory, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddAlternative, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddDelivery, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddOption, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.PreviewOffer, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SendOffer, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SimpleTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.TreeTab, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.TreeTab, OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.AddDelivery);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.CreateOrderFromOffer, CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			Add(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SeeAllUsersOffers, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice);
			AddImport(OrderPlugin.PermissionGroup.Offer, OrderPlugin.PermissionName.SeeAllUsersOffers, OrderPlugin.PermissionGroup.Offer, PermissionName.Read);
			
			Add(MainPlugin.PermissionGroup.TopSearch, nameof(Offer), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
		}
	}
}

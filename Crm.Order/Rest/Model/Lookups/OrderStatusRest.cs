namespace Crm.Order.Rest.Model.Lookups
{
	using Crm.Library.Rest;
	using Crm.Order.Model.Lookups;

	[RestTypeFor(DomainType = typeof(OrderStatus))]
	public class OrderStatusRest : RestEntityLookupWithExtensionValues
	{
		public string Color { get; set; } = "#9E9E9E";
	}
}

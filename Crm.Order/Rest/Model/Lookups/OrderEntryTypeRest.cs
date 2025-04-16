namespace Crm.Order.Rest.Model.Lookups
{
	using Crm.Library.Rest;
	using Crm.Order.Model.Lookups;

	[RestTypeFor(DomainType = typeof(OrderEntryType))]
	public class OrderEntryTypeRest : RestEntityLookupWithExtensionValues
	{
	}
}

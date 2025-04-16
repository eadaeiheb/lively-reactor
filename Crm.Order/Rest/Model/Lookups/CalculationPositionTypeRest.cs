namespace Crm.Order.Rest.Model.Lookups
{
	using Crm.Library.Rest;
	using Crm.Order.Model.Lookups;

	[RestTypeFor(DomainType = typeof(CalculationPositionType))]
	public class CalculationPositionTypeRest : RestEntityLookupWithExtensionValues
	{
		public bool HasPurchasePrice { get; set; }
		public bool IsAbsolute { get; set; }
		public bool IsDefault { get; set; }
		public bool IsDiscount { get; set; }
	}
}

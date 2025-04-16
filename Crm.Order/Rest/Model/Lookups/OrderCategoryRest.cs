namespace Crm.Order.Rest.Model.Lookups
{
	using Crm.Library.Rest;
	using Crm.Order.Model.Lookups;

	[RestTypeFor(DomainType = typeof(OrderCategory))]
	public class OrderCategoryRest : RestEntityLookupWithExtensionValues
	{
		public string[] AllowedArticleTypeValues { get; set; }
		public string[] AllowedArticleGroupValues { get; set; }
		public bool AllowNegativeQuantities { get; set; }
		public bool AllowPositiveQuantities { get; set; } = true;
		public string[] CustomerFlags { get; set; }
		public string Color { get; set; } = "#AAAAAA";
	}
}

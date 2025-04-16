namespace Crm.Article.Rest.Model
{
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Article.Model;

	[RestTypeFor(DomainType = typeof(Store))]
	public class StoreRest : RestEntityWithExtensionValues
	{
		public string StoreNo { get; set; }
		public string Name { get; set; }
		public string LegacyId { get; set; }

		[NavigationProperty(nameof(LocationRest.StoreId), nameof(LocationRest.Store))]
		public LocationRest[] Locations { get; set; }

		[NavigationProperty(nameof(StorageAreaRest.StoreId), nameof(StorageAreaRest.Store))]
		public StorageAreaRest[] StorageAreas { get; set; }

		[NavigationProperty(nameof(StockRest.StoreKey), nameof(StockRest.Store))]
		public StockRest[] Stocks { get; set; }
		[NavigationProperty(nameof(SerialRest.StoreKey), nameof(SerialRest.Store))]
		public SerialRest[] Serials { get; set; }
	}
}

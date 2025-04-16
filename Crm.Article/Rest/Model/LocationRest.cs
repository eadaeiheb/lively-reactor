namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Article.Model;

	[RestTypeFor(DomainType = typeof(Location))]
	public class LocationRest : RestEntityWithExtensionValues
	{
		public string LocationNo { get; set; }
		public Guid? StorageAreaId { get; set; }
		public Guid StoreId { get; set; }

		[NavigationProperty(nameof(StoreId), nameof(StoreRest.Locations))]
		public StoreRest Store { get; set; }

		[NavigationProperty(nameof(StorageAreaId), nameof(StorageArea.Locations))]
		public StorageAreaRest StorageArea { get; set; }

		[NavigationProperty(nameof(StockRest.LocationKey), nameof(StockRest.Location))]
		public StockRest[] Stocks { get; set; }

		[NavigationProperty(nameof(SerialRest.LocationKey), nameof(SerialRest.Location))]
		public SerialRest[] Serials { get; set; }
	}
}

namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Article.Model;

	[RestTypeFor(DomainType = typeof(StorageArea))]
	public class StorageAreaRest : RestEntityWithExtensionValues
	{
		public string StorageAreaNo { get; set; }
		public Guid StoreId { get; set; }

		[NavigationProperty(nameof(StoreId), nameof(StoreRest.StorageAreas))]
		public StoreRest Store { get; set; }

		[NavigationProperty(nameof(LocationRest.StorageAreaId), nameof(LocationRest.StorageArea))]
		public LocationRest[] Locations { get; set; }

		[NavigationProperty(nameof(StockRest.StorageAreaKey), nameof(StockRest.StorageArea))]
		public StockRest[] Stocks { get; set; }

		[NavigationProperty(nameof(SerialRest.StorageAreaKey), nameof(SerialRest.StorageArea))]
		public SerialRest[] Serials { get; set; }
	}
}

namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Article.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(Stock))]
	public class StockRest : RestEntityWithExtensionValues
	{
		public decimal Quantity { get; set; }
		public Guid StoreKey { get; set; }
		public Guid? StorageAreaKey { get; set; }
		public Guid? LocationKey { get; set; }
		public Guid ArticleKey { get; set; }

		[NavigationProperty(nameof(ArticleKey), nameof(ArticleRest.Stocks))]
		public ArticleRest Article { get; set; }

		[NavigationProperty(nameof(StoreKey), nameof(StoreRest.Stocks))]
		public StoreRest Store { get; set; }

		[NavigationProperty(nameof(StorageAreaKey), nameof(StorageAreaRest.Stocks))]
		public StorageAreaRest StorageArea { get; set; }

		[NavigationProperty(nameof(LocationKey), nameof(LocationRest.Stocks))]
		public LocationRest Location { get; set; }
	}
}

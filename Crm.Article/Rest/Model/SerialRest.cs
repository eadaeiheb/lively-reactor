namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Article.Model;

	[RestTypeFor(DomainType = typeof(Serial))]
	public class SerialRest : RestEntityWithExtensionValues
	{
		public string SerialNo { get; set; }
		public Guid? StoreKey { get; set; }
		public Guid? StorageAreaKey { get; set; }
		public Guid? LocationKey { get; set; }
		public Guid ArticleKey { get; set; }
		public bool IsAvailable { get; set; }

		[NavigationProperty(nameof(ArticleKey), nameof(ArticleRest.Serials))]
		public ArticleRest Article { get; set; }

		[NavigationProperty(nameof(StoreKey), nameof(StoreRest.Serials))]
		public StoreRest Store { get; set; }

		[NavigationProperty(nameof(StorageAreaKey), nameof(StorageAreaRest.Serials))]
		public StorageAreaRest StorageArea { get; set; }

		[NavigationProperty(nameof(LocationKey), nameof(LocationRest.Serials))]
		public LocationRest Location { get; set; }

	}
}

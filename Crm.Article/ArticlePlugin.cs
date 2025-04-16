namespace Crm.Article
{
	using Crm.Library.Modularization;

	[Plugin(Requires = "Crm,Main")]
	public class ArticlePlugin : Plugin
	{
		public static readonly string PluginName = typeof(ArticlePlugin).Namespace;

		public static class PermissionGroup
		{
			public const string Article = nameof(Model.Article);
			public const string ArticleRelationship = nameof(Model.Relationships.ArticleRelationship);
			public const string ProductFamily = nameof(Model.ProductFamily);
			public const string Store = nameof(Model.Store);
			public const string Location = nameof(Model.Location);
		}

		public static class PermissionName
		{
			public const string ViewPurchasePrices = "ViewPurchasePrices";
			public const string PricesTab = "PricesTab";
			public const string QuantityUnitsTab = "QuantityUnitsTab";
		}
	}
}

namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(ArticleType))]
	public class ArticleTypeRest : RestEntityLookupWithExtensionValues
	{
		public string Color { get; set; }
		public const string VehicleKey = "Vehicle";
	}
}

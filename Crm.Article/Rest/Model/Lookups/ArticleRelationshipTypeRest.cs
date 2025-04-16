namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(ArticleRelationshipType))]
	public class ArticleRelationshipTypeRest : RestEntityLookupWithExtensionValues
	{
		public string[] ArticleTypes { get; set; }
		public bool HasQuantity { get; set; }
		public string InverseValue { get; set; }
	}
}

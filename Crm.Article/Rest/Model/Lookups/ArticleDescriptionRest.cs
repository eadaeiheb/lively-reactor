namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(ArticleDescription))]
	public class ArticleDescriptionRest : RestEntityLookupWithExtensionValues
	{
	}
}

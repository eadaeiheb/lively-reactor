namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;

	public abstract class ArticleGroupRest : RestEntityLookupWithExtensionValues
	{
		[RestrictedField]
		public string Base64Image { get; set; }
		[RestrictedField]
		public string Image { get; set; }
	}

	[RestTypeFor(DomainType = typeof(ArticleGroup01))]
	public class ArticleGroup01Rest : ArticleGroupRest
	{
	}

	[RestTypeFor(DomainType = typeof(ArticleGroup02))]
	public class ArticleGroup02Rest : ArticleGroupRest
	{
		public string ParentArticleGroup { get; set; }
	}

	[RestTypeFor(DomainType = typeof(ArticleGroup03))]
	public class ArticleGroup03Rest : ArticleGroupRest
	{
		public string ParentArticleGroup { get; set; }
	}

	[RestTypeFor(DomainType = typeof(ArticleGroup04))]
	public class ArticleGroup04Rest : ArticleGroupRest
	{
		public string ParentArticleGroup { get; set; }
	}

	[RestTypeFor(DomainType = typeof(ArticleGroup05))]
	public class ArticleGroup05Rest : ArticleGroupRest
	{
		public string ParentArticleGroup { get; set; }
	}
}

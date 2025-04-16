namespace Crm.Article.Rest.Model
{
	using Crm.Article.Model;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(ArticleGroupInformation))]
	public class ArticleGroupInformationRest : RestEntityWithExtensionValues
	{
		public string ArticleGroup01Key { get; set; }
		public string ArticleGroup02Key { get; set; }
		public string ArticleGroup03Key { get; set; }
		public string ArticleGroup04Key { get; set; }
		public string ArticleGroup05Key { get; set; }
	}
}

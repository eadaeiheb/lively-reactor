namespace Crm.Article.Controllers.OData
{
	using Crm.Article.Model;
	using Crm.Article.Rest.Model;
	using Crm.Library.Api.Model;

	using ODataConventionModelBuilder = Crm.Library.Api.Model.ODataConventionModelBuilder;

	public class ArticleFunctionConfigurator : IModelConfigurator
	{
		public virtual void Configure(ODataConventionModelBuilder builder)
		{
			var function = builder.EntityType<ArticleRest>()
				.Collection
				.Function(nameof(ArticleODataController.GetDistinctArticleGroupCombinations))
				.ReturnsCollection<ArticleGroupInformation>();
			function.Title = "returns the article group combinations of the query result";
		}
	}
}

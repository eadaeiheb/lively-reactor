namespace Crm.Article.Controllers.OData
{
	using System;
	using System.Linq;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Article.Rest.Model;
	using Crm.Library.Api;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Api.Controller;
	using Crm.Library.Data.Domain.DataInterfaces;

	using Microsoft.AspNetCore.OData.Query;
	using Microsoft.AspNetCore.Mvc;

	using NHibernate.Criterion;
	using NHibernate.Transform;

	[ControllerName("CrmArticle_Article")]
	public class ArticleODataController : ODataControllerEx, IEntityApiController
	{
		private readonly IRepositoryWithTypedId<Article, Guid> articleRepository;
		public Type EntityType => typeof(Article);
		public ArticleODataController(
			IRepositoryWithTypedId<Article, Guid> articleRepository)
		{
			this.articleRepository = articleRepository;
		}
		
		[HttpGet]
		public virtual IActionResult GetDistinctArticleGroupCombinations(ODataQueryOptions<ArticleRest> options)
		{
			var criteria = articleRepository.Session.CreateCriteria(typeof(Article));
			criteria.Add(Restrictions.Eq(nameof(Article.ArticleTypeKey), ArticleType.MaterialKey));
			criteria.Add(Restrictions.Eq(nameof(Article.IsActive), true));
			criteria.AddOrder(Order.Desc(Projections.Property(nameof(Article.ArticleGroup01Key))));
			criteria.AddOrder(Order.Desc(Projections.Property(nameof(Article.ArticleGroup02Key))));
			criteria.AddOrder(Order.Desc(Projections.Property(nameof(Article.ArticleGroup03Key))));
			criteria.AddOrder(Order.Desc(Projections.Property(nameof(Article.ArticleGroup04Key))));
			criteria.AddOrder(Order.Desc(Projections.Property(nameof(Article.ArticleGroup05Key))));
			criteria.SetProjection(
				Projections.Distinct(Projections.ProjectionList()
					.Add(Projections.Alias(Projections.Property(nameof(Article.ArticleGroup01Key)), nameof(Article.ArticleGroup01Key)))
					.Add(Projections.Alias(Projections.Property(nameof(Article.ArticleGroup02Key)), nameof(Article.ArticleGroup02Key)))
					.Add(Projections.Alias(Projections.Property(nameof(Article.ArticleGroup03Key)), nameof(Article.ArticleGroup03Key)))
					.Add(Projections.Alias(Projections.Property(nameof(Article.ArticleGroup04Key)), nameof(Article.ArticleGroup04Key)))
					.Add(Projections.Alias(Projections.Property(nameof(Article.ArticleGroup05Key)), nameof(Article.ArticleGroup05Key)))));

			criteria.SetResultTransformer(
				new AliasToBeanResultTransformer(typeof(ArticleGroupInformation)));

			var result = criteria.List().Cast<ArticleGroupInformation>().ToList();
			return Ok(result);
		}
	}
}

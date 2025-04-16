namespace Crm.Article.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Article.Model.Relationships;
	using Crm.Article.Services.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Globalization.Resource;

	using NHibernate.Criterion;
	using NHibernate.Transform;

	using StackExchange.Redis;

	using Order = NHibernate.Criterion.Order;

	public class ArticleService : IArticleService
	{
		private readonly IRepositoryWithTypedId<Article, Guid> articleRepository;
		private readonly IRepositoryWithTypedId<ArticleRelationship, Guid> articleRelationshipRepository;
		private readonly IRepositoryWithTypedId<QuantityUnitEntry, Guid> quantityUnitEntryRepository;
		private readonly ILookupManager lookupManager;
		private readonly IResourceManager resourceManager;

		// Methods
		public virtual IQueryable<Article> GetArticles()
		{
			return articleRepository.GetAll();
		}

		public virtual Article GetArticle(Guid id)
		{
			return articleRepository.Get(id);
		}

		public virtual Article GetArticleByItemNo(string itemNo)
		{
			return articleRepository.GetAll().FirstOrDefault(a => a.ItemNo == itemNo);
		}

		public virtual IEnumerable<string> GetUsedArticleTypes()
		{
			return articleRepository.GetAll().Select(a => a.ArticleTypeKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedArticleGroup01s()
		{
			return articleRepository.GetAll().Select(a => a.ArticleGroup01Key).Distinct();
		}

		public virtual IEnumerable<string> GetUsedArticleGroup02s()
		{
			return articleRepository.GetAll().Select(a => a.ArticleGroup02Key).Distinct();
		}

		public virtual IEnumerable<string> GetUsedArticleGroup03s()
		{
			return articleRepository.GetAll().Select(a => a.ArticleGroup03Key).Distinct();
		}

		public virtual IEnumerable<string> GetUsedArticleGroup04s()
		{
			return articleRepository.GetAll().Select(a => a.ArticleGroup04Key).Distinct();
		}

		public virtual IEnumerable<string> GetUsedArticleGroup05s()
		{
			return articleRepository.GetAll().Select(a => a.ArticleGroup05Key).Distinct();
		}

		public virtual IEnumerable<string> GetUsedArticleRelationshipTypes()
		{
			return articleRelationshipRepository.GetAll().Select(a => a.RelationshipTypeKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedQuantityUnits()
		{
			return quantityUnitEntryRepository.GetAll().Select(a => a.QuantityUnitKey).Distinct().ToList()
				.Union(articleRelationshipRepository.GetAll().Select(a => a.QuantityUnitKey).Distinct().ToList());
		}

		public virtual IEnumerable<string> GetUsedVATLevels()
		{
			return articleRepository.GetAll().Select(a => a.VATLevelKey).Distinct();
		}
		public virtual IEnumerable<string> GetUsedDrivingLicenceCategories()
		{
			return articleRepository.GetAll().Select(a => a.DrivingLicenceCategoryKey).Distinct();
		}

		public virtual Dictionary<string, string> GetDescriptionMap(List<string> itemNos)
		{
			var map = new Dictionary<string, string>();

			foreach (var articleDescription in lookupManager
				         .List<ArticleDescription>()
				         .Where(x => itemNos.Contains(x.Key)))
			{
				if (!map.ContainsKey(articleDescription.Key))
				{
					map.Add(articleDescription.Key, articleDescription.Value);
				}
			}

			foreach (var article in articleRepository
				         .GetAll()
				         .Where(x => itemNos.Contains(x.ItemNo)))
			{
				if (!map.ContainsKey(article.ItemNo))
				{
					map.Add(article.ItemNo, article.Description);
				}
			}

			return map;
		}
		public ArticleService(IRepositoryWithTypedId<Article, Guid> articleRepository, IRepositoryWithTypedId<ArticleRelationship, Guid> articleRelationshipRepository, IRepositoryWithTypedId<QuantityUnitEntry, Guid> quantityUnitEntryRepository, ILookupManager lookupManager, IResourceManager resourceManager)
		{
			this.articleRepository = articleRepository;
			this.articleRelationshipRepository = articleRelationshipRepository;
			this.quantityUnitEntryRepository = quantityUnitEntryRepository;
			this.lookupManager = lookupManager;
			this.resourceManager = resourceManager;
		}
	}
}

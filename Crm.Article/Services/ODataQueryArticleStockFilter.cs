namespace Crm.Article.Services
{
	using System;
	using System.Linq;
	using System.Reflection;

	using Crm.Article.Model;
	using Crm.Library.Api.Controller;
	using Crm.Library.AutoFac;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;

	using Microsoft.AspNetCore.OData.Query;

	public class ODataQueryArticleStockFilter : IODataQueryFunction, IDependency
	{
		private readonly IRepositoryWithTypedId<Stock, Guid> stockRepository;
		protected static MethodInfo FilterInfo = typeof(ODataQueryArticleStockFilter)
			.GetMethod(nameof(Filter), BindingFlags.Instance | BindingFlags.NonPublic);

		public ODataQueryArticleStockFilter(IRepositoryWithTypedId<Article, Guid> articleRepository, IRepositoryWithTypedId<Stock, Guid> stockRepository)
		{
			this.stockRepository = stockRepository;
		}
		protected virtual IQueryable<Article> Filter(IQueryable<Article> query, Guid? storeId, Guid? storageAreaId, Guid? locationId)
		{
			var stockQuery = stockRepository.GetAll();
			if (storeId.HasValue)
			{
				stockQuery = stockQuery.Where(x => x.StoreKey == storeId);
				if (storageAreaId.HasValue)
				{
					stockQuery = stockQuery.Where(x => x.StorageAreaKey == storageAreaId);
				}
				if (locationId.HasValue)
				{
					stockQuery = stockQuery.Where(x => x.LocationKey == locationId);
				}
			}
			var articleIds = stockQuery.Select(x => x.ArticleKey).Distinct();
			return query.Where(x => articleIds.Contains(x.Id));
		}
		public virtual IQueryable<T> Apply<T, TRest>(ODataQueryOptions<TRest> options, IQueryable<T> query)
			where T : class, IEntityWithId
			where TRest : class
		{
			if (query is not IQueryable<Article>)
				return query;
			const string StoreIdParameterName = "filterArticleByAvailabilityStore";
			const string StorageAreaIdParameterName = "filterArticleByAvailabilityStorageArea";
			const string LocationIdParameterName = "filterArticleByAvailabilityLocation";
			var parameters = options.Request.Query;
			if (parameters.Keys.Contains(StoreIdParameterName))
			{
				Guid? storeId = null;
				Guid? storageAreaId = null;
				Guid? locationId = null;
				if (Guid.TryParse(options.Request.GetQueryParameter(StoreIdParameterName), out var parsedStoreId))
					storeId = parsedStoreId;
				if (Guid.TryParse(options.Request.GetQueryParameter(StorageAreaIdParameterName), out var parsedStorageAreaId))
					storageAreaId = parsedStorageAreaId;
				if (Guid.TryParse(options.Request.GetQueryParameter(LocationIdParameterName), out var parsedLocationId))
					locationId = parsedLocationId;
				return (IQueryable<T>)Filter((IQueryable<Article>)query, storeId, storageAreaId, locationId);
			}
			return query;
		}
	}
}

namespace Crm.Article.BackgroundServices
{
	using System.Linq;
	using System.Reflection;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Api.Controller;
	using Crm.Library.AutoFac;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Services.Interfaces;

	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.OData.Query;

	public class ODataQueryStoreNameFilter : IODataQueryFunction, IDependency
	{
		private readonly IRepository<StoreName> storeNameRepository;
		private readonly IAuthorizationManager authorizationManager;
		private readonly IUserService userService;
		protected static MethodInfo FilterByStoreNameInfo = typeof(ODataQueryStoreNameFilter).GetMethod(nameof(FilterByStoreName), BindingFlags.Instance | BindingFlags.NonPublic);
		public ODataQueryStoreNameFilter(IRepository<StoreName> storeNameRepository, IAuthorizationManager authorizationManager, IUserService userService)
		{
			this.storeNameRepository = storeNameRepository;
			this.authorizationManager = authorizationManager;
			this.userService = userService;
		}
		protected virtual IQueryable<T> FilterByStoreName<T>(IQueryable<T> query, string language, string filter) where T : Store
		{
			if (authorizationManager.IsAuthorizedForAction(userService.CurrentUser, PermissionGroup.WebApiRead, typeof(StoreName).Name))
			{
				var subQuery = storeNameRepository.GetAll()
					.Where(x => x.Language == language)
					.Where(x => x.Value.Contains(filter))
					.Select(x => x.Key);
				return query.Where(a => a.StoreNo.Contains(filter) || a.Name.Contains(filter) || subQuery.Contains(a.StoreNo));
			}
			return query.Where(a => a.StoreNo.Contains(filter) || a.Name.Contains(filter));
		}
		public virtual IQueryable<T> Apply<T, TRest>([FromQuery]ODataQueryOptions<TRest> options, IQueryable<T> query)
			where T : class, IEntityWithId
			where TRest : class
		{
			if (typeof(Store).IsAssignableFrom(typeof(T)) == false)
			{
				return query;
			}
			var language = options.Request.GetQueryParameter("filterByStoreNameLanguage")?.Trim();
			var filter = options.Request.GetQueryParameter("filterByStoreNameFilter")?.Trim();
			if (string.IsNullOrEmpty(language) == false && string.IsNullOrEmpty(filter) == false)
			{
				return (IQueryable<T>)FilterByStoreNameInfo.MakeGenericMethod(typeof(T)).Invoke(this, new object[] { query, language, filter });
			}
			return query;
		}
	}
}

namespace Crm.Article.Services
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

	using Microsoft.AspNetCore.OData.Query;

	using Microsoft.AspNetCore.Mvc;


	public class ODataQueryQuantityUnitEntryTranslationFilter : IODataQueryFunction, IDependency
	{
		private readonly IRepository<QuantityUnit> quantityUnitRepository;
		private readonly IAuthorizationManager authorizationManager;
		private readonly IUserService userService;
		public ODataQueryQuantityUnitEntryTranslationFilter(IRepository<QuantityUnit> quantityUnitRepository, IAuthorizationManager authorizationManager, IUserService userService)
		{
			this.quantityUnitRepository = quantityUnitRepository;
			this.authorizationManager = authorizationManager;
			this.userService = userService;
		}
		protected virtual IQueryable<QuantityUnitEntry> FilterByQuantityUnitTranslation(IQueryable<QuantityUnitEntry> query, string language, string filter)
		{
			if (authorizationManager.IsAuthorizedForAction(userService.CurrentUser, PermissionGroup.WebApi, typeof(QuantityUnit).Name))
			{
				var subQuery = quantityUnitRepository.GetAll()
					.Where(x => x.Language == language)
					.Where(x => x.Value.Contains(filter))
					.Select(x => x.Key);
				return query.Where(q => subQuery.Contains(q.QuantityUnitKey) || q.Name.Contains(filter));
			}

			return query;
		}
		public virtual IQueryable<T> Apply<T, TRest>([FromQuery]ODataQueryOptions<TRest> options, IQueryable<T> query)
			where T : class, IEntityWithId
			where TRest : class
		{
			if (typeof(QuantityUnitEntry).IsAssignableFrom(typeof(T)) == false)
			{
				return query;
			}
			var language = options.Request.GetQueryParameter("filterByQuantityTranslationLanguage")?.Trim();
			var filter = options.Request.GetQueryParameter("filterByQuantityTranslationFilter")?.Trim();
			if (string.IsNullOrEmpty(language) == false && string.IsNullOrEmpty(filter) == false)
			{
				return (IQueryable<T>)FilterByQuantityUnitTranslation((IQueryable<QuantityUnitEntry>)query, language, filter);
			}
			return query;
		}
	}
}

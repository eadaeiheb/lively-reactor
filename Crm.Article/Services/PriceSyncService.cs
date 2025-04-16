namespace Crm.Article.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Linq.Expressions;

	using Autofac;
	using Autofac.Core;

	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Services.Interfaces;

	using LinqKit;

	public class PriceSyncService : DefaultSyncService<Price, Guid>
	{
		private readonly ISyncService<Company> companySyncService;
		private readonly IEnumerable<IContactSyncService> articleSyncServices;
		private readonly IAuthorizationManager authorizationManager;
		public PriceSyncService(
			IRepositoryWithTypedId<Price, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper,
			ISyncService<Company> companySyncService,
			IComponentContext context,
			IAuthorizationManager authorizationManager)
			: base(repository,
				restTypeProvider,
				restSerializer,
				mapper)
		{
			this.companySyncService = companySyncService;
			this.authorizationManager = authorizationManager;
			var articleSyncServiceRegistrations = context.ComponentRegistry.Registrations.Where(x => x.Services.OfType<TypedService>().Any(s => s.ServiceType.IsGenericType && s.ServiceType.GetGenericTypeDefinition() == typeof(ISyncService<>) && typeof(Article).IsAssignableFrom(s.ServiceType.GetGenericArguments().First())));
			articleSyncServices = articleSyncServiceRegistrations.Where(x => x.Activator.LimitType != GetType()).Select(x => context.Resolve(x.Activator.LimitType) as IContactSyncService).ToList();
		}
		public override Type[] ClientSyncDependencies
		{
			get
			{
				var clientSyncDependencies = articleSyncServices.Select(x => ((ISyncService)x).SyncedType)
					.Concat(new[] { typeof(Company) })
					.ToArray();
				return clientSyncDependencies;
			}
		}
		public override IQueryable<Price> GetAll(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			var entities = repository.GetAll();

			Expression<Func<Price, bool>> predicate = null;
			foreach (var articleSyncService in articleSyncServices.Where(x => authorizationManager.IsAuthorizedForAction(user,
						PermissionGroup.WebApi,
						((ISyncService)x).SyncedType.Name)))
			{
				var articleIds = articleSyncService.GetAllContactIds(user,
					groups,
					clientIds);
				predicate = predicate == null ? x => articleIds.Contains(x.ArticleKey) : predicate.Or(x => articleIds.Contains(x.ArticleKey));
			}

			entities = predicate == null ? entities.Where(x => false) : entities.Where(predicate);

			var companies = companySyncService.GetAll(user);
			return entities
				.Where(x => x.CompanyKey == null || companies.Any(y => y.Id == x.CompanyKey))
				.Where(x => x.ValidTo == null || x.ValidTo >= DateTime.UtcNow);
		}
	}
}

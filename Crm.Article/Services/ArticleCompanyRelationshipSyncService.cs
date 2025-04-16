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
	using Crm.Article.Model.Relationships;
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

	public class ArticleCompanyRelationshipSyncService : DefaultSyncService<ArticleCompanyRelationship, Guid>
	{
		private readonly IEnumerable<IContactSyncService> articleSyncServices;
		private readonly ISyncService<Company> companySyncService;
		private readonly IAuthorizationManager authorizationManager;
		public ArticleCompanyRelationshipSyncService(IRepositoryWithTypedId<ArticleCompanyRelationship, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<Company> companySyncService, IComponentContext context, IAuthorizationManager authorizationManager)
			: base(repository,
				restTypeProvider,
				restSerializer,
				mapper)
		{
			var articleSyncServiceRegistrations = context.ComponentRegistry.Registrations.Where(x => x.Services.OfType<TypedService>().Any(s => s.ServiceType.IsGenericType && s.ServiceType.GetGenericTypeDefinition() == typeof(ISyncService<>) && typeof(Article).IsAssignableFrom(s.ServiceType.GetGenericArguments().First())));
			articleSyncServices = articleSyncServiceRegistrations.Where(x => x.Activator.LimitType != GetType()).Select(x => context.Resolve(x.Activator.LimitType) as IContactSyncService).ToList();
			this.companySyncService = companySyncService;
			this.authorizationManager = authorizationManager;
		}
		public override Type[] ClientSyncDependencies
		{
			get
			{
				var clientSyncDependencies = articleSyncServices.Select(x => ((ISyncService)x).SyncedType)
					.Concat(new[] { typeof(Company) }).ToArray();
				return clientSyncDependencies;
			}
		}
		public override Type[] SyncDependencies => new[] { typeof(Company), typeof(Article) };
		public override ArticleCompanyRelationship Save(ArticleCompanyRelationship entity)
		{
			return repository.SaveOrUpdate(entity);
		}
		public override IQueryable<ArticleCompanyRelationship> GetAll(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			var entities = repository.GetAll();

			Expression<Func<ArticleCompanyRelationship, bool>> predicate = null;
			foreach (var articleSyncService in articleSyncServices.Where(x => authorizationManager.IsAuthorizedForAction(user,
						PermissionGroup.WebApi,
						((ISyncService)x).SyncedType.Name)))
			{
				var articleIds = articleSyncService.GetAllContactIds(user,
					groups,
					clientIds);
				predicate = predicate == null ? x => articleIds.Contains(x.ParentId) : predicate.Or(x => articleIds.Contains(x.ParentId));
			}

			predicate ??= (x => false);

			var companies = companySyncService.GetAll(user,
				groups,
				clientIds);

			return entities
				.Where(predicate)
				.Where(x => companies.Any(y => y.Id == x.ChildId));
		}
	}
}

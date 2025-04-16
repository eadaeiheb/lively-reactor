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
	using Crm.Services.Interfaces;

	using LinqKit;

	public class ArticleRelationshipSyncService : DefaultSyncService<ArticleRelationship, Guid>
	{
		private readonly IEnumerable<IContactSyncService> articleSyncServices;
		private readonly IAuthorizationManager authorizationManager;
		public ArticleRelationshipSyncService(IRepositoryWithTypedId<ArticleRelationship, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, IComponentContext context, IAuthorizationManager authorizationManager)
			: base(repository,
				restTypeProvider,
				restSerializer,
				mapper)
		{
			this.authorizationManager = authorizationManager;
			var articleSyncServiceRegistrations = context.ComponentRegistry.Registrations.Where(x => x.Services.OfType<TypedService>().Any(s => s.ServiceType.IsGenericType && s.ServiceType.GetGenericTypeDefinition() == typeof(ISyncService<>) && typeof(Article).IsAssignableFrom(s.ServiceType.GetGenericArguments().First())));
			articleSyncServices = articleSyncServiceRegistrations.Where(x => x.Activator.LimitType != GetType()).Select(x => context.Resolve(x.Activator.LimitType) as IContactSyncService).ToList();
		}
		public override Type[] ClientSyncDependencies
		{
			get
			{
				var clientSyncDependencies = articleSyncServices.Select(x => ((ISyncService)x).SyncedType).ToArray();
				return clientSyncDependencies;
			}
		}
		public override IQueryable<ArticleRelationship> GetAll(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			Expression<Func<ArticleRelationship, bool>> parentIdPredicate = null;
			Expression<Func<ArticleRelationship, bool>> childIdPredicate = null;
			foreach (var articleSyncService in articleSyncServices.Where(x => authorizationManager.IsAuthorizedForAction(user,
						PermissionGroup.WebApi,
						((ISyncService)x).SyncedType.Name)))
			{
				var articleIds = articleSyncService.GetAllContactIds(user,
					groups,
					clientIds);
				parentIdPredicate = parentIdPredicate == null ? x => articleIds.Contains(x.ParentId) : parentIdPredicate.Or(x => articleIds.Contains(x.ParentId));
				childIdPredicate = childIdPredicate == null ? x => articleIds.Contains(x.ChildId) : childIdPredicate.Or(x => articleIds.Contains(x.ParentId));
			}

			parentIdPredicate = parentIdPredicate ?? (x => false);
			childIdPredicate = childIdPredicate ?? (x => false);

			return repository.GetAll()
				.Where(parentIdPredicate)
				.Where(childIdPredicate);
		}
		public override ArticleRelationship Save(ArticleRelationship entity)
		{
			return repository.SaveOrUpdate(entity);
		}
	}
}

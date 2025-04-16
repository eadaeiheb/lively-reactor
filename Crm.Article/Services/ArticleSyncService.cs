namespace Crm.Article.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Services.Interfaces;

	using Main.Replication.Services;

	public class ArticleSyncService : DefaultSyncService<Article, Guid>, IContactSyncService
	{
		private readonly IVisibilityProvider visibilityProvider;
		private static readonly string[] SyncedArticleTypes = { ArticleType.CostKey, ArticleType.MaterialKey, ArticleType.ServiceKey, ArticleType.ToolKey, ArticleType.VehicleKey };
		private readonly IRepositoryWithTypedId<QuantityUnitEntry, Guid> quantityUnitEntryRepository;

		public ArticleSyncService(
			IRepositoryWithTypedId<Article, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper,
			IVisibilityProvider visibilityProvider,
			IRepositoryWithTypedId<QuantityUnitEntry, Guid> quantityUnitEntryRepository,
			IReplicationService<Article, Guid> replicationService = null)
			: base(repository,
				restTypeProvider,
				restSerializer,
				mapper,
				replicationService)
		{
			this.visibilityProvider = visibilityProvider;
			this.quantityUnitEntryRepository = quantityUnitEntryRepository;
		}
		public override IQueryable<Article> GetAll(User user)
		{
			var query = repository.GetAll().Where(x => SyncedArticleTypes.Contains(x.ArticleTypeKey));
			return visibilityProvider.FilterByVisibility(query);
		}
		public virtual IQueryable<Guid> GetAllContactIds(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			return clientIds != null ? replicationService.GetReplicatedEntityIds(clientIds.FirstOrDefault(x => x.Key == nameof(Article)).Value) : GetAll(user).Select(x => x.Id);
		}
		public override Article Save(Article entity)
		{
			if (entity.QuantityUnitEntryKey.HasValue)
			{
				var quantityUnitEntry = quantityUnitEntryRepository.Get(entity.QuantityUnitEntryKey.Value);
				entity.QuantityUnitKey = quantityUnitEntry.QuantityUnitKey;
				entity.QuantityStep = quantityUnitEntry.QuantityStep;
			}

			return base.Save(entity);
		}
	}
}

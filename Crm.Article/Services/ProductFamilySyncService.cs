using System;
using System.Linq;

namespace Crm.Article.Services
{
	using System.Collections.Generic;

	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Services.Interfaces;

	using Main.Replication.Services;

	public class ProductFamilySyncService : DefaultSyncService<ProductFamily, Guid>, IContactSyncService
	{
		private readonly IVisibilityProvider visibilityProvider;
		public ProductFamilySyncService(IRepositoryWithTypedId<ProductFamily, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, IVisibilityProvider visibilityProvider, IReplicationService<ProductFamily, Guid> replicationService = null)
			: base(repository, restTypeProvider, restSerializer, mapper, replicationService)
		{
			this.visibilityProvider = visibilityProvider;
		}
		public override IQueryable<ProductFamily> GetAll(User user)
		{
			var query = repository.GetAll();
			return visibilityProvider.FilterByVisibility(query);
		}
		public virtual IQueryable<Guid> GetAllContactIds(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			return clientIds != null ? replicationService.GetReplicatedEntityIds(clientIds.FirstOrDefault(x => x.Key == nameof(ProductFamily)).Value) : GetAll(user).Select(x => x.Id);
		}
	}
}

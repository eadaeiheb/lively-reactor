namespace Crm.Article.Services
{
	using System;
	using System.Linq;

	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;

	public class StoreNameSyncService : DefaultLookupSyncService<StoreName>
	{

		private readonly ISyncService<Store> storeSyncService;
		public StoreNameSyncService(IRepositoryWithTypedId<StoreName, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<Store> storeSyncService) : base(repository, restTypeProvider, restSerializer, mapper) {
			this.storeSyncService = storeSyncService;
		}

		public override IQueryable<StoreName> GetAll(User user)
		{
			var stores = storeSyncService.GetAll(user);
			return base.GetAll(user)
				.Where(x => stores.Any(y => y.StoreNo == x.Key));
		}
	}
}

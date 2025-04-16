namespace Crm.Article.Services
{
	using AutoMapper;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Article.Model;
	using System;
	using System.Linq;

	public class StorageAreaSyncService : DefaultSyncService<StorageArea, Guid>
	{
		public StorageAreaSyncService(IRepositoryWithTypedId<StorageArea, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
		public override IQueryable<StorageArea> GetAll(User user) => repository.GetAll();
	}
}

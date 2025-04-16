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

	public class QuantityUnitEntrySyncService : DefaultSyncService<QuantityUnitEntry, Guid>
	{
		public QuantityUnitEntrySyncService(
			IRepositoryWithTypedId<QuantityUnitEntry, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
		public override IQueryable<QuantityUnitEntry> GetAll(User user)
		{
			return repository.GetAll();
		}
	}
}

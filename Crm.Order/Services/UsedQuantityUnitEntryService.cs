namespace Crm.Order.Services
{
	using System;
	using System.Linq;

	using Crm.Article.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Services.Interfaces;
	using Crm.Order.Model;

	public class UsedQuantityUnitEntryService : IUsedEntityService<QuantityUnitEntry>
	{
		private readonly IRepositoryWithTypedId<OrderItem, Guid> orderItemRepository;
		public UsedQuantityUnitEntryService(IRepositoryWithTypedId<OrderItem, Guid> orderItemRepository)
		{
			this.orderItemRepository = orderItemRepository;
		}

		public virtual bool IsUsed(QuantityUnitEntry entity) => orderItemRepository.GetAll().Any(x => x.QuantityUnitEntryKey == entity.Id);
	}
}

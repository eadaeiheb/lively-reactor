namespace Crm.Order.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;

	using NHibernate.Linq;

	public class OrderRecipientSyncService : DefaultSyncService<OrderRecipient, Guid>
	{
		private readonly ISyncService<Order> orderSyncService;
		private readonly ISyncService<Offer> offerSyncService;
		public OrderRecipientSyncService(IRepositoryWithTypedId<OrderRecipient, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<Order> orderSyncService, ISyncService<Offer> offerSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.orderSyncService = orderSyncService;
			this.offerSyncService = offerSyncService;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(Offer), typeof(Order) }; }
		}
		public override IQueryable<OrderRecipient> GetAll(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			var orders = orderSyncService.GetAll(user, groups, clientIds);
			var offers = offerSyncService.GetAll(user, groups, clientIds);
			return repository.GetAll().Where(x => orders.Any(y => y.Id == x.BaseOrderId) || offers.Any(y => y.Id == x.BaseOrderId));
		}
	}
}

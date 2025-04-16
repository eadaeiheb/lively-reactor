namespace Crm.Order.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;

	using Main.Model.Extensions;

	using NHibernate.Linq;

	public class OrderSyncService : DefaultSyncService<Order, Guid>
	{
		private readonly IBaseOrderService baseOrderService;
		private readonly IUserService userService;
		private readonly IAuthorizationManager authorizationManager;
		private readonly ISyncService<Company> companySyncService;

		public OrderSyncService(IRepositoryWithTypedId<Order, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IBaseOrderService baseOrderService, IUserService userService, IMapper mapper, IAuthorizationManager authorizationManager, ISyncService<Company> companySyncService)
			: base(repository,
				restTypeProvider,
				restSerializer,
				mapper)
		{
			this.baseOrderService = baseOrderService;
			this.userService = userService;
			this.authorizationManager = authorizationManager;
			this.companySyncService = companySyncService;
		}
		public override Type[] ClientSyncDependencies => new[] { typeof(Company) };
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(Address), typeof(Company), typeof(Person) }; }
		}
		public override Order Save(Order entity)
		{
			if (String.IsNullOrEmpty(entity.ResponsibleUser))
			{
				entity.ResponsibleUser = userService.CurrentUser.Id;
			}

			var orig = baseOrderService.GetOrder(entity.Id);
			if (orig != null)
			{
				entity.Items = orig.Items;
			}

			baseOrderService.SaveOrder(entity);
			return entity;
		}
		public override IQueryable<Order> GetAll(User user, IDictionary<string, int?> groups, IDictionary<string, Guid> clientIds)
		{
			var companies = companySyncService.GetAll(user,
				groups,
				clientIds);
			return repository.GetAll().VisibleTo(authorizationManager, user)
				.Where(x => x.ContactId == null || companies.Any(y => y.Id == x.ContactId.Value));
		}
		public override IQueryable<Order> Eager(IQueryable<Order> entities)
		{
			return entities
				.Fetch(x => x.Company);
		}
	}
}

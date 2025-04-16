using Microsoft.AspNetCore.Mvc;

namespace Crm.Order.Controllers
{
	using Crm.Article.Services.Interfaces;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Order.Model.Lookups;

	public class OrderRestController : RestController
	{
		private readonly IArticleService articleService;
		private readonly ILookupManager lookupManager;

		protected override string DefaultFormat
		{
			get { return jsonFormat; }
		}

		public virtual ActionResult Categories()
		{
			return Rest(lookupManager.List<OrderCategory>());
		}

		public OrderRestController(IArticleService articleService, ILookupManager lookupManager, RestTypeProvider restTypeProvider)
			: base(restTypeProvider)
		{
			this.articleService = articleService;
			this.lookupManager = lookupManager;
		}
	}
}

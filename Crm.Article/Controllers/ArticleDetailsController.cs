namespace Crm.Article.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class ArticleDetailsController : Controller
	{
		[RenderAction("MaterialHeadResource", Priority = 6000)]
		public virtual ActionResult MaterialHeadResource()
		{
			return Content(Url.JsResource("Crm.Article", "articleMaterialTs"));
		}

		[RenderAction("ArticleDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialDetailsTab()
		{
			return PartialView();
		}

		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialDetailsTabHeader()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTab", Priority = 40)]
		public virtual ActionResult UsersTab()
		{
			return PartialView();
		}

		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 40)]
		public virtual ActionResult UsersTabHeader()
		{
			return PartialView();
		}

		[RenderAction("ArticleDetailsMaterialTab", Priority = 20)]
		public virtual ActionResult DowntimesTab()
		{
			return PartialView();
		}

		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 20)]
		public virtual ActionResult DowntimesTabHeader()
		{
			return PartialView();
		}

		[RenderAction("ArticleDetailsMaterialTab", Priority = 50)]
		public virtual ActionResult SerialsTab()
		{
			return PartialView();
		}

		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 50)]
		public virtual ActionResult SerialsTabHeader()
		{
			return PartialView();
		}
	}
}

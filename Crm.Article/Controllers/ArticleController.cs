namespace Crm.Article.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;

	using Main;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class ArticleController : Controller
	{
		[HttpGet]
		[RequiredPermission(PermissionName.Create, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult CreateTemplate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult DetailsTemplate()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 60)]
		[RequiredPermission(CrmPlugin.PermissionName.DocumentsTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult MaterialDocumentsTabHeader()
		{
			return PartialView("ContactDetails/MaterialDocumentsTabHeader");
		}

		[RenderAction("ArticleDetailsMaterialTab", Priority = 60)]
		[RequiredPermission(CrmPlugin.PermissionName.DocumentsTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult MaterialDocumentsTab()
		{
			return PartialView("ContactDetails/MaterialDocumentsTab");
		}
		[RenderAction("ArticleDetailsMaterialTab", Priority = 80)]
		[RequiredPermission(CrmPlugin.PermissionName.RelationshipsTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult RelationshipsTab()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(CrmPlugin.PermissionName.RelationshipsTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult RelationshipsTabHeader()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTab", Priority = 80)]
		[RequiredPermission(ArticlePlugin.PermissionName.QuantityUnitsTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult QuantityUnitsTab()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(ArticlePlugin.PermissionName.QuantityUnitsTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult QuantityUnitsTabHeader()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTab", Priority = 80)]
		[RequiredPermission(ArticlePlugin.PermissionName.PricesTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult PricesTab()
		{
			return PartialView();
		}
		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(ArticlePlugin.PermissionName.PricesTab, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult PricesTabHeader()
		{
			return PartialView();
		}
		[AllowAnonymous]
		[RenderAction("TemplateHeadResource", Priority = 2000)]
		public virtual ActionResult TemplateHeadResource()
		{
			return Content(Url.JsResource("Crm.Article", "articleReportJs"));
		}

		[RenderAction("ArticleDetailsMaterialTabHeader", Priority = 0)]
		public virtual ActionResult MaterialStockTabHeader() => PartialView();

		[RenderAction("ArticleDetailsMaterialTab", Priority = 0)]
		public virtual ActionResult MaterialStockTab() => PartialView();
	}
}

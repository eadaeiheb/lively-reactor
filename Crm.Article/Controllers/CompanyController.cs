namespace Crm.Article.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Modularization;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class CompanyController : Controller
	{

		[RenderAction("CompanyMaterialDetailsTabExtensions")]
		public virtual ActionResult SalesInformationExtension()
		{
			return PartialView();
		}

		[RequiredPermission(ArticlePlugin.PermissionName.PricesTab, Group = ArticlePlugin.PermissionGroup.Article)]
		[RenderAction("CompanyDetailsMaterialTabHeader", Priority = 60)]
		public virtual ActionResult MaterialPricesTabHeader() => PartialView();

		[RequiredPermission(ArticlePlugin.PermissionName.PricesTab, Group = ArticlePlugin.PermissionGroup.Article)]
		[RenderAction("CompanyDetailsMaterialTab", Priority = 60)]
		public virtual ActionResult MaterialPricesTab() => PartialView();
	}
}

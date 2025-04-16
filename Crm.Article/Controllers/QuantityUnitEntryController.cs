namespace Crm.Article.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class QuantityUnitEntryController : Controller
	{
		[RequiredPermission(PermissionName.View, Group = ArticlePlugin.PermissionGroup.Article)]
		public virtual ActionResult DetailsTemplate() => PartialView();
		public virtual ActionResult EditTemplate() => PartialView();
	}
}

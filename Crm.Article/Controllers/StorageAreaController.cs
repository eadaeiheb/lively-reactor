namespace Crm.Article.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class StorageAreaController : Controller
	{
		[RequiredPermission(PermissionName.Edit, Group = ArticlePlugin.PermissionGroup.Location)]
		public virtual ActionResult EditTemplate()
		{
			return PartialView();
		}
	}
}

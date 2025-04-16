using Microsoft.AspNetCore.Mvc;

namespace Crm.Article.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class LocationController : Controller
	{
		[RequiredPermission(PermissionName.Edit, Group = ArticlePlugin.PermissionGroup.Location)]
		public virtual ActionResult EditTemplate()
		{
			return PartialView();
		}
	}
}

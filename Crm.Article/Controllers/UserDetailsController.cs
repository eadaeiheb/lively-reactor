namespace Crm.Article.Controllers
{
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Mvc;

	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class UserDetailsController : Controller
	{
		[RenderAction("UserDetailsMaterialTabHeader", Priority = 40)]
		public virtual ActionResult ArticlesTabHeader() => PartialView();
		[RenderAction("UserDetailsMaterialTab", Priority = 40)]
		public virtual ActionResult ArticlesTab() => PartialView();
	}
}

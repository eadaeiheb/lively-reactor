namespace Crm.Article.Controllers
{
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Mvc;

	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class UserAdminController : Controller
	{
		[RenderAction("UserDetailsGeneralView")]
		public virtual ActionResult LicensePlateView() => PartialView();

		[RenderAction("UserDetailsGeneralEdit")]
		public virtual ActionResult LicensePlateEdit() => PartialView();
	}
}

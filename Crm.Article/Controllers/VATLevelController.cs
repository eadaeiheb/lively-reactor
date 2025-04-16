namespace Crm.Article.Controllers
{
	using Crm.Library.Modularization;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class VATLevelController : Controller
	{
		[RenderAction("LookupBasicInformation")]
		public virtual ActionResult LookupBasicInformation() => PartialView();

		[RenderAction("LookupEditBasicInformation")]
		public virtual ActionResult LookupEditBasicInformation() => PartialView();
	}
}

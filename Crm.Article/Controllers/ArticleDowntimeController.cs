namespace Crm.Article.Controllers;

using Microsoft.AspNetCore.Mvc;

public class ArticleDowntimeController : Controller
{
	public virtual ActionResult EditTemplate() => PartialView();
}

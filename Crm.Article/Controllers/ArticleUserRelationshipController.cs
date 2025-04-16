namespace Crm.Article.Controllers;

using Microsoft.AspNetCore.Mvc;

public class ArticleUserRelationshipController : Controller
{
	public virtual ActionResult EditTemplate() => PartialView();
}

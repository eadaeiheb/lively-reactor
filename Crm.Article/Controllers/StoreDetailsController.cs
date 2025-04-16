namespace Crm.Article.Controllers
{
	using Crm.Article;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class StoreDetailsController : Controller
	{
		[RenderAction("StoreDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialDetailsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("StoreDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialDetailsTab()
		{
			return PartialView();
		}
		[RenderAction("StoreDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialLocationsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("StoreDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialLocationsTab()
		{
			return PartialView();
		}
		[RenderAction("StoreDetailsMaterialTabHeader", Priority = 50)]
		public virtual ActionResult MaterialStorageAreasTabHeader()
		{
			return PartialView();
		}

		[RenderAction("StoreDetailsMaterialTab", Priority = 50)]
		public virtual ActionResult MaterialStorageAreasTab()
		{
			return PartialView();
		}
		[RenderAction("LocationItemTemplateActions")]
		public virtual ActionResult LocationActionDetails()
		{
			return PartialView();
		}
		[RenderAction("StorageAreaItemTemplateActions")]
		public virtual ActionResult StorageAreaActionDetails()
		{
			return PartialView();
		}
		[RequiredPermission(PermissionName.Create, Group = ArticlePlugin.PermissionGroup.Location)]
		[RenderAction("StoreLocationsTabMaterialsTabPrimaryAction")]
		public virtual ActionResult MaterialPrimaryActionAddLocation() => PartialView();
		[RequiredPermission(PermissionName.Create, Group = ArticlePlugin.PermissionGroup.Location)]
		[RenderAction("StoreStorageAreasTabMaterialsTabPrimaryAction")]
		public virtual ActionResult MaterialPrimaryActionAddStorageArea() => PartialView();
	}
}

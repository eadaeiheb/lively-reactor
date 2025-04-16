namespace Crm.Article
{
	using System.Runtime.CompilerServices;

	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Menu;

	public class ArticleMenuRegistrar : IMenuRegistrar<MaterialMainMenu>
	{
		[MethodImpl(MethodImplOptions.NoInlining)]
		public virtual void Initialize(MenuProvider<MaterialMainMenu> menuProvider)
		{
			menuProvider.Register(
				"MasterData",
				"VehiclesAndTools",
				url: "~/Crm.Article/ArticleList/IndexTemplate?filterByType=VehicleAndTool",
				iconClass: "zmdi zmdi-file-text",
				priority: 800);
			menuProvider.AddPermission("MasterData", "VehiclesAndTools", ArticlePlugin.PermissionGroup.Article, PermissionName.View);
			menuProvider.Register(
					"MasterData",
					"Articles",
					url: "~/Crm.Article/ArticleList/IndexTemplate",
					iconClass: "zmdi zmdi-file-text",
					priority: 700);
			menuProvider.AddPermission("MasterData", "Articles", ArticlePlugin.PermissionGroup.Article, PermissionName.View);
			menuProvider.Register(
				"MasterData",
				"ProductFamilies",
				url: "~/Crm.Article/ProductFamilyList/IndexTemplate",
				iconClass: "zmdi zmdi-view-dashboard",
				priority: 500);
			menuProvider.AddPermission("MasterData", "ProductFamilies", ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.View);
			menuProvider.Register(
				"MasterData",
				"QuantityUnitGroups",
				url: "~/Crm.Article/QuantityUnitEntryList/IndexTemplate",
				iconClass: "zmdi zmdi-view-dashboard",
				priority: 600);
			menuProvider.AddPermission("MasterData", "QuantityUnitGroups", ArticlePlugin.PermissionGroup.Article, PermissionName.View);
			menuProvider.Register("MasterData", "Stores", url: "~/Crm.Article/StoreList/IndexTemplate", iconClass: "zmdi zmdi-view-dashboard", priority: 100);
			menuProvider.AddPermission("MasterData", "Stores", ArticlePlugin.PermissionGroup.Store, PermissionName.View);

		}
	}
}
 

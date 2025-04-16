namespace Crm.Article.Controllers.ActionRoleProvider
{
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	using Main;

	public class ProductFamilyActionRoleProvider : RoleCollectorBase
	{
		public ProductFamilyActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Index, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.View, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Create, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);
			Add(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Edit, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);
			Add(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Read, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);

			Add(PermissionGroup.WebApi, nameof(ProductFamily), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, "HeadOfService", "ServiceBackOffice", "InternalService", Roles.APIUser);
			
			AddImport(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Index, PermissionGroup.WebApi, nameof(ProductFamilyStatus));
			AddImport(ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Create, ArticlePlugin.PermissionGroup.ProductFamily, PermissionName.Index);
			Add(PermissionGroup.WebApi, nameof(ProductFamilyDescription), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(PermissionGroup.WebApi, nameof(ProductFamilyStatus));
		}
	}
}

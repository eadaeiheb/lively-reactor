using Crm.Library.Model.Authorization.PermissionIntegration;

namespace Crm.Article.Controllers.ActionRoleProvider
{
	using Crm.Article.Model.Lookups;
	using Crm.Article.Model.Relationships;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Modularization.Interfaces;

	using Main;

	public class ArticleRelationshipActionRoleProvider : RoleCollectorBase
	{
		public ArticleRelationshipActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Create, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Create, ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Read);
			Add(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Edit, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Edit, ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Read);
			Add(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Delete, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Delete, ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Create);
			AddImport(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Delete, ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Edit);
			Add(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Read, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			AddImport(ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Read, ArticlePlugin.PermissionGroup.Article, PermissionName.Read);

			Add(PermissionGroup.WebApi, nameof(ArticleRelationship), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleRelationshipType), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
		}
	}
}

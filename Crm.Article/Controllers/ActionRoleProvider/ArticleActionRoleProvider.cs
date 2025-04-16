namespace Crm.Article.Controllers.ActionRoleProvider
{
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Article.Model.Relationships;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	using Main.Model.Lookups;

	public class ArticleActionRoleProvider : RoleCollectorBase
	{
		public ArticleActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ArticlePlugin.PermissionGroup.Article, PermissionName.View, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(ArticlePlugin.PermissionGroup.Article, PermissionName.Read, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.RelationshipsTab, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, ArticlePlugin.PermissionGroup.Article, PermissionName.Read);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(ArticleGroup01));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(ArticleGroup02));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(ArticleGroup03));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(ArticleGroup04));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(ArticleGroup05));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(ArticleType));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Index, PermissionGroup.WebApi, nameof(Currency));
			Add(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, ArticlePlugin.PermissionGroup.Article, PermissionName.Index);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleGroup01));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleGroup02));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleGroup03));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleGroup04));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleGroup05));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleType));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(VATLevel));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(DrivingLicenceCategory));
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Create, PermissionGroup.WebApi, nameof(ArticleDowntimeReason));
			Add(ArticlePlugin.PermissionGroup.Article, PermissionName.Edit, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Edit, ArticlePlugin.PermissionGroup.Article, PermissionName.Create);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Edit, ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Create);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Edit, ArticlePlugin.PermissionGroup.ArticleRelationship, PermissionName.Edit);
			Add(ArticlePlugin.PermissionGroup.Article, PermissionName.Delete, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, PermissionName.Delete, ArticlePlugin.PermissionGroup.Article, PermissionName.Edit);

			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.CreateTag, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.CreateTag, ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.AssociateTag);
			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.AssociateTag, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);
			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.RenameTag, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.RenameTag, ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.DeleteTag);
			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.RemoveTag, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.RemoveTag, ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.AssociateTag);
			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.DeleteTag, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales);
			AddImport(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.DeleteTag, ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.CreateTag);
			Add(ArticlePlugin.PermissionGroup.Article, ArticlePlugin.PermissionName.ViewPurchasePrices, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.SalesBackOffice);


			Add(PermissionGroup.WebApi, nameof(Article));
			AddImport(PermissionGroup.WebApi, nameof(Article), ArticlePlugin.PermissionGroup.Article, PermissionName.Read);
			Add(PermissionGroup.WebApi, nameof(ArticleDescription));
			Add(PermissionGroup.WebApi, nameof(ArticleGroup01));
			Add(PermissionGroup.WebApi, nameof(ArticleGroup02));
			Add(PermissionGroup.WebApi, nameof(ArticleGroup03));
			Add(PermissionGroup.WebApi, nameof(ArticleGroup04));
			Add(PermissionGroup.WebApi, nameof(ArticleGroup05));
			Add(PermissionGroup.WebApi, nameof(ArticleType));
			Add(PermissionGroup.WebApi, nameof(QuantityUnit));
			Add(PermissionGroup.WebApi, nameof(VATLevel));
			Add(PermissionGroup.WebApi, nameof(Article), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleType), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleDescription), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleGroup01), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleGroup02), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleGroup03), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleGroup04), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleGroup05), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(QuantityUnit), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(DrivingLicenceCategory));
			Add(PermissionGroup.WebApi, nameof(ArticleCompanyRelationship), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleUserRelationship), CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales, "HeadOfService", "ServiceBackOffice", "InternalService", Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ArticleCompanyRelationshipType), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(QuantityUnitEntry), CrmPlugin.Roles.FieldSales, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.SalesBackOffice, Roles.APIUser);
			AddImport(PermissionGroup.WebApi, nameof(ArticleUserRelationship), ArticlePlugin.PermissionGroup.Article, PermissionName.Read);
			AddImport(PermissionGroup.WebApi, nameof(Article), PermissionGroup.WebApi, nameof(ArticleCompanyRelationship));
			AddImport(PermissionGroup.WebApi, nameof(ArticleCompanyRelationshipType), ArticlePlugin.PermissionGroup.Article, PermissionName.Read);
			AddImport(PermissionGroup.WebApi, nameof(Article), PermissionGroup.WebApi, nameof(ArticleCompanyRelationshipType));
			AddImport(CrmPlugin.PermissionGroup.Company, CrmPlugin.PermissionName.RelationshipsTab, ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.RelationshipsTab);
			Add(ArticlePlugin.PermissionGroup.Article, CrmPlugin.PermissionName.DocumentsTab, CrmPlugin.Roles.SalesBackOffice, CrmPlugin.Roles.HeadOfSales, CrmPlugin.Roles.InternalSales, CrmPlugin.Roles.FieldSales);
		}
	}
}

namespace Crm.Article.Database
{
	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20230825100300)]
	public class AddAuthDataIdToLookups : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<ArticleCompanyRelationshipType>("LU", "ArticleCompanyRelationshipType");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleGroup01>("LU", "ArticleGroup");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleGroup02>("LU", "ArticleGroup2", "ArticleGroupId");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleGroup03>("LU", "ArticleGroup3", "ArticleGroupId");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleGroup04>("LU", "ArticleGroup4", "ArticleGroupId");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleGroup05>("LU", "ArticleGroup5", "ArticleGroupId");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleRelationshipType>("LU", "ArticleRelationshipType");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleType>("LU", "ArticleType");
			helper.AddOrUpdateEntityAuthDataColumn<ProductFamilyDescription>("LU", "ProductFamilyDescription");
			helper.AddOrUpdateEntityAuthDataColumn<ProductFamilyStatus>("LU", "ProductFamilyStatus");
			helper.AddOrUpdateEntityAuthDataColumn<QuantityUnit>("LU", "QuantityUnit");
			helper.AddOrUpdateEntityAuthDataColumn<VATLevel>("LU", "VATLevel");
		}
	}
}

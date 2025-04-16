namespace Crm.Article.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230825100200)]
	public class ChangeLookupsToGuidId : Migration
	{
		public override void Up()
		{
			Database.ChangeTableFromIntToGuidId("LU", "ArticleCompanyRelationshipType", "ArticleCompanyRelationshipTypeId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleDescription", "ArticleDescriptionId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleGroup", "ArticleGroupId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleGroup2", "ArticleGroupId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleGroup3", "ArticleGroupId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleGroup4", "ArticleGroupId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleGroup5", "ArticleGroupId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleRelationshipType", "ArticleRelationshipTypeId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleType", "ArticleTypeId");
			Database.ChangeTableFromIntToGuidId("LU", "ProductFamilyDescription", "ProductFamilyDescriptionId");
			Database.ChangeTableFromIntToGuidId("LU", "ProductFamilyStatus", "ProductFamilyStatusId");
			Database.ChangeTableFromIntToGuidId("LU", "QuantityUnit", "QuantityUnitId");
			Database.ChangeTableFromIntToGuidId("LU", "VATLevel", "VATLevelId");
		}
	}
}

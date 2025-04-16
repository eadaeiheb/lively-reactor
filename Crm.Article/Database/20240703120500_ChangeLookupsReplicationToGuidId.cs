namespace Crm.Article.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240703120500)]
	public class ChangeLookupsReplicationToGuidId : Migration
	{
		public override void Up()
		{
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleCompanyRelationshipType", "ArticleCompanyRelationshipTypeId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleDescription", "ArticleDescriptionId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleGroup", "ArticleGroupId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleGroup2", "ArticleGroupId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleGroup3", "ArticleGroupId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleGroup4", "ArticleGroupId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleGroup5", "ArticleGroupId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleRelationshipType", "ArticleRelationshipTypeId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ArticleType", "ArticleTypeId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ProductFamilyDescription", "ProductFamilyDescriptionId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "ProductFamilyStatus", "ProductFamilyStatusId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "QuantityUnit", "QuantityUnitId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "VATLevel", "VATLevelId");
		}
	}
}

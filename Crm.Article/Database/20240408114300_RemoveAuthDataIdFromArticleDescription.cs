namespace Crm.Article.Database
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240408114300)]
	public class RemoveAuthDataIdFromArticleDescription : Migration
	{
		public override void Up()
		{
			var entityTypeId = Database.ExecuteScalar($"SELECT UId FROM EntityType WHERE IsDeleted = 0 AND [Name] = '{typeof(ArticleDescription).FullName}'");

			if (entityTypeId != null)
			{
				Database.RemoveForeignKeyIfExisting("LU", "ArticleDescription", "FK_ArticleDescription_EntityAuthData");
				Database.RemoveColumnIfExisting("[LU].[ArticleDescription]", "AuthDataId");
				Database.ExecuteNonQuery($"DELETE FROM [GrantedEntityAccess] WHERE [TargetEntityTypeId] = '{entityTypeId}'");
				Database.ExecuteNonQuery($"DELETE FROM [EntityAccess] WHERE [TargetEntityTypeId] = '{entityTypeId}'");
				Database.ExecuteNonQuery($"UPDATE [EntityType] SET IsDeleted = 1 WHERE [UId] = '{entityTypeId}'");
			}
		}
	}
}

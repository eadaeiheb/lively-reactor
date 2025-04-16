namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230418133200)]
	public class AddTableCrmArticleUserRelationship : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[ArticleUserRelationship]"))
			{
				Database.AddTable(
					"CRM.ArticleUserRelationship",
					new Column("ArticleUserRelationshipId", DbType.Guid, ColumnProperty.PrimaryKey),
					new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull),
					new Column("UserKey", DbType.String, 256, ColumnProperty.NotNull),
					new Column("[From]", DbType.DateTime, ColumnProperty.Null),
					new Column("[To]", DbType.DateTime, ColumnProperty.Null),
					new Column("AuthDataId", DbType.Guid, ColumnProperty.Null),
					new Column("CreateUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true));

				Database.ExecuteNonQuery("ALTER TABLE CRM.ArticleUserRelationship ADD FOREIGN KEY (ArticleKey) REFERENCES CRM.Article(ArticleId)");
				Database.ExecuteNonQuery("ALTER TABLE CRM.ArticleUserRelationship ADD FOREIGN KEY (UserKey) REFERENCES CRM.[User](Username)");
				Database.ExecuteNonQuery("ALTER TABLE CRM.ArticleUserRelationship ADD FOREIGN KEY (AuthDataId) REFERENCES dbo.EntityAuthData(UId)");

			}
		}
	}
}

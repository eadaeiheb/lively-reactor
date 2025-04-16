namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230525085800)]
	public class AddTableArticleDowntime : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[ArticleDowntime]"))
			{
				Database.AddTable(
					"CRM.ArticleDowntime",
					new Column("ArticleDowntimeId", DbType.Guid, ColumnProperty.PrimaryKey),
					new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull),
					new Column("Description", DbType.String, 4000, ColumnProperty.Null),
					new Column("DowntimeReasonKey", DbType.String, ColumnProperty.NotNull),
					new Column("IsExported", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("[From]", DbType.DateTime, ColumnProperty.NotNull),
					new Column("[To]", DbType.DateTime, ColumnProperty.NotNull),
					new Column("AuthDataId", DbType.Guid, ColumnProperty.Null),
					new Column("CreateUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true));

				Database.ExecuteNonQuery("ALTER TABLE CRM.ArticleDowntime ADD FOREIGN KEY (ArticleKey) REFERENCES CRM.Article(ArticleId)");
				Database.ExecuteNonQuery("ALTER TABLE CRM.ArticleDowntime ADD FOREIGN KEY (AuthDataId) REFERENCES dbo.EntityAuthData(UId)");

			}
		}
	}
}


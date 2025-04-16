namespace Crm.Article.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230525084000)]

	public class InsertValuesIntoLuArticleDowntimeReason : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									 "([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('Other', 'Other', 'en', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('Other', 'Sonstiges', 'de', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('Other', 'Autre', 'fr', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('Other', 'Otra', 'es', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									 "([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('Maintenance', 'Maintenance', 'en', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('Maintenance', 'Wartung', 'de', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('Maintenance', 'Maintenance', 'fr', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.ArticleDowntimeReason " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('Maintenance', 'Mantenimiento', 'es', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230525084000', N'Migration_20230525084000',1)");

		}
	}
}

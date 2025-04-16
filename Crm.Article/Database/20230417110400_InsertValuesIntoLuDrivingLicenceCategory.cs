namespace Crm.Article.Database
{

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230417110400)]

	public class InsertValuesIntoLuDrivingLicenceCategory : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									 "([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('A', 'A', 'en', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('A', 'A', 'de', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('A', 'A', 'fr', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('A', 'A', 'es', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									 "([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('B', 'B', 'en', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('B', 'B', 'de', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('B', 'B', 'fr', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('B', 'B', 'es', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									 "([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('C', 'C', 'en', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('C', 'C', 'de', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('C', 'C', 'fr', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('C', 'C', 'es', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									 "([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('D', 'D', 'en', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('D', 'D', 'de', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('D', 'D', 'fr', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");
			Database.ExecuteNonQuery("INSERT INTO LU.DrivingLicenceCategory " +
									"([Value], [Name], [Language], [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															"VALUES ('D', 'D', 'es', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230417110400', N'Migration_20230417110400',1)");

		}
	}
}

namespace Crm.Article.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230407131600)]
	public class AddArticleTypeVehicleToLUArticleType : Migration
	{

		public override void Up()
		{
			var count = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM [LU].[ArticleType] WHERE [Value]= 'Vehicle'");

			if (count == 0)
			{
				Database.ExecuteNonQuery("INSERT INTO LU.ArticleType " +
									 "([Value], [Name], [Language], [Color] , [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
															 "VALUES ('Vehicle', 'Vehicle', 'en', '#0EA26A', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230407131600', N'Migration_20230407131600',1)");
				Database.ExecuteNonQuery("INSERT INTO LU.ArticleType " +
										"([Value], [Name], [Language], [Color] , [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
																"VALUES ('Vehicle', 'Fahrzeug', 'de', '#0EA26A', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230407131600', N'Migration_20230407131600',1)");
				Database.ExecuteNonQuery("INSERT INTO LU.ArticleType " +
										"([Value], [Name], [Language], [Color] , [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
																"VALUES ('Vehicle', 'Véhicule', 'fr', '#0EA26A', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230407131600', N'Migration_20230407131600',1)");
				Database.ExecuteNonQuery("INSERT INTO LU.ArticleType " +
										"([Value], [Name], [Language], [Color] , [Favorite], [SortOrder], [CreateDate], [ModifyDate], [CreateUser], [ModifyUser], [IsActive]) " +
																"VALUES ('Vehicle', 'Vehículo', 'es', '#0EA26A', 0, 0, GETUTCDATE(),GETUTCDATE(),N'Migration_20230407131600', N'Migration_20230407131600',1)");
			}
		}
	}
}

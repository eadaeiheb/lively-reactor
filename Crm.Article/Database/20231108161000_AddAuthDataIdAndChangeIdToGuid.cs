namespace Crm.Article.Database
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20231108161000)]

	public class AddAuthDataIdAndChangeIdToGuid : Migration
	{
		public override void Up()
		{

			Database.ChangeTableFromIntToGuidId("LU", "DrivingLicenceCategory", "DrivingLicenceCategoryId");
			Database.ChangeTableFromIntToGuidId("LU", "ArticleDowntimeReason", "ArticleDowntimeReasonId");
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<DrivingLicenceCategory>("LU", "DrivingLicenceCategory");
			helper.AddOrUpdateEntityAuthDataColumn<ArticleDowntimeReason>("LU", "ArticleDowntimeReason");
		}
	}
}

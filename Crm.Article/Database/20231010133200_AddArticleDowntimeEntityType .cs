namespace Crm.Article.Database
{
	using Crm.Article.Model;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20231010133200)]
	public class AddArticleDowntimeEntityType : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<ArticleDowntime>("CRM", "ArticleDowntime");
		}
	}
}



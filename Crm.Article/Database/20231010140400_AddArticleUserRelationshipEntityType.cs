namespace Crm.Article.Database
{
	using Crm.Article.Model.Relationships;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20231010140600)]
	public class AddArticleUserRelationshipEntityType : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<ArticleUserRelationship>("CRM", "ArticleUserRelationship");
		}
	}
}



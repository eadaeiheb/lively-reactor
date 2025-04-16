namespace Crm.Article.Database
{
	using System.Text;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20240411163000)]
	public class AddColorColumnToArticleDowntimeReason : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[LU].[ArticleDowntimeReason]") && !Database.ColumnExists("[LU].[ArticleDowntimeReason]", "Color"))
			{
				StringBuilder query = new StringBuilder();
				query.Append("ALTER TABLE [LU].[ArticleDowntimeReason] ADD Color nvarchar(20) NOT NULL DEFAULT '#AAAAAA'");
				Database.ExecuteNonQuery(query.ToString());
			}
		}
	}
}

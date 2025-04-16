namespace Crm.Article.Database
{
	using System.Collections.Generic;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20240411163100)]
	public class InsertColorValuesToArticleDowntimeReason : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[LU].[ArticleDowntimeReason]") && Database.ColumnExists("[LU].[ArticleDowntimeReason]", "Color"))
			{
				var colorValues = new List<KeyValuePair<string, string>>()
				{
					new KeyValuePair<string, string>("Other","#2196F3"),
					new KeyValuePair<string, string>("Maintenance","#4CAF50"),
				};
				foreach (var colorvalue in colorValues)
				{
					Database.ExecuteNonQuery($"UPDATE [LU].[ArticleDowntimeReason] SET Color = '{colorvalue.Value}' Where Value = '{colorvalue.Key}'");
				}
			}
		}
	}
}

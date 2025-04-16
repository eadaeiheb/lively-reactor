namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20241112154000)]
	public class SetArticleQuantityUnitAndStep : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("Update crm.article set QuantityUnit = crm.QuantityUnitEntry.QuantityUnitKey, QuantityStep = crm.QuantityUnitEntry.QuantityStep from crm.article Join crm.QuantityUnitEntry on crm.article.QuantityUnitEntryKey = crm.QuantityUnitEntry.QuantityUnitEntryId");
		}
	}
}

namespace Crm.Article.Database
{
	using System.Collections.Generic;
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240524183000)]
	public class AddMinStockToArticle : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("Crm.Article", new Column("MinimumStock", DbType.Decimal, ColumnProperty.Null));
			Database.ExecuteNonQuery(@"ALTER TABLE Crm.Article 
			ALTER COLUMN MinimumStock decimal(19,5) NULL");
		}
	}
}

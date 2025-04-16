namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230616111050)]
	public class AddCompanyExtension : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Company", new Column("CompanyPriceGroupKey", DbType.String, 256, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Company", new Column("CompanyPriceLevelKey", DbType.String, 256, ColumnProperty.Null));
		}
	}
}

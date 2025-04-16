namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
		using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

		[Migration(20230407134000)]
	public class AddNewFieldsToArticle : Migration
	{
		public override void Up()
		{
				Database.AddColumnIfNotExisting("CRM.Article", new Column("Manufacturer", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("Model", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("VIN", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("TUV", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("Inspection", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("EAN", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("Serial", DbType.String, 50, ColumnProperty.Null));
				Database.AddColumnIfNotExisting("CRM.Article", new Column("DrivingLicenceCategoryKey", DbType.String, 20, ColumnProperty.Null));
		}
	}
}

namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240806131200)]
	public class AddNewFieldToCrmArticle : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Article", new Column("LicensePlate", DbType.String, 50, ColumnProperty.Null));
		}
	}
}

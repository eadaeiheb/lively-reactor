namespace Crm.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240903133000)]
	public class AddLicensePlateToCrmUser : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[User]", new Column("LicensePlate", DbType.String, 50, ColumnProperty.Null));
		}
	}
}

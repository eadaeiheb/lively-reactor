namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230531113300)]
	public class UpdateUsageOfQuantityUnit : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("Crm.OrderItem", new Column("QuantityUnitEntryKey", DbType.Guid,ColumnProperty.Null));
			Database.ExecuteNonQuery(@"
  ALTER TABLE CRM.OrderItem
ADD FOREIGN KEY (QuantityUnitEntryKey) REFERENCES CRM.QuantityUnitEntry(QuantityUnitEntryId);");
		}
	}
}

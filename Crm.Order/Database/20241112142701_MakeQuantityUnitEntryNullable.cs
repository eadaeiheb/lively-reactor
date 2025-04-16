namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20241112142701)]
	public class MakeQuantityUnitEntryNullable : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE CRM.[OrderItem] ALTER COLUMN [QuantityUnitEntryKey] UNIQUEIDENTIFIER NULL");
		}
	}
}

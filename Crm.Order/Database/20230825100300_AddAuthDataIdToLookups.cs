namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;
	using Crm.Order.Model.Lookups;

	[Migration(20230825100300)]
	public class AddAuthDataIdToLookups : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<CalculationPositionType>("LU", "CalculationPositionType");
			helper.AddOrUpdateEntityAuthDataColumn<OrderCancelReasonCategory>("LU", "OrderCancelReasonCategory");
			helper.AddOrUpdateEntityAuthDataColumn<OrderCategory>("LU", "OrderCategory");
			helper.AddOrUpdateEntityAuthDataColumn<OrderEntryType>("LU", "OrderEntryType");
			helper.AddOrUpdateEntityAuthDataColumn<OrderStatus>("LU", "OrderStatus", "StatusId");
		}
	}
}

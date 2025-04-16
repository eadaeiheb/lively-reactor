namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20230825100200)]
	public class ChangeLookupsToGuidId : Migration
	{
		public override void Up()
		{
			Database.ChangeTableFromIntToGuidId("LU", "CalculationPositionType", "CalculationPositionTypeId");
			Database.ChangeTableFromIntToGuidId("LU", "OrderCancelReasonCategory", "OrderCancelReasonCategoryId");
			Database.ChangeTableFromIntToGuidId("LU", "OrderCategory", "OrderCategoryId");
			Database.ChangeTableFromIntToGuidId("LU", "OrderEntryType", "OrderEntryTypeId");
			Database.ChangeTableFromIntToGuidId("LU", "OrderStatus", "StatusId");
		}
	}
}

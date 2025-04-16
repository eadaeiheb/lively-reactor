namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20240703120500)]
	public class ChangeLookupsReplicationToGuidId : Migration
	{
		public override void Up()
		{
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "CalculationPositionType", "CalculationPositionTypeId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "OrderCancelReasonCategory", "OrderCancelReasonCategoryId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "OrderCategory", "OrderCategoryId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "OrderEntryType", "OrderEntryTypeId");
			Database.ChangeReplicatedEntityFromIntToGuidId("LU", "OrderStatus", "StatusId");
		}
	}
}

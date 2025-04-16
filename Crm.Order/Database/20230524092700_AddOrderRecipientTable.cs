namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230524092700)]
	public class AddOrderRecipientTable : Migration
	{
		public override void Up()
		{
			Database.AddTable(
				"[CRM].[OrderRecipient]",
				new Column("OrderRecipientId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
				new Column("BaseOrderId", DbType.Guid, ColumnProperty.NotNull),
				new Column("Email", DbType.String, 100, ColumnProperty.NotNull),
				new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("CreateUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
				new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("ModifyUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
				new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true)
			);
			
			Database.AddForeignKey("FK_OrderRecipient_BaseOrder", "[CRM].[OrderRecipient]", "BaseOrderId", "[CRM].[Order]", "OrderId");

		}
	}
}

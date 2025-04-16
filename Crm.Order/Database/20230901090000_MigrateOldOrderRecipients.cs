namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230901090000)]
	public class MigrateOldOrderRecipients : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[Order]", "[CustomEmail]"))
			{
				Database.ExecuteNonQuery(@"  INSERT INTO [CRM].[OrderRecipient] (BaseOrderId, Email, CreateUser, ModifyUser)
  SELECT OrderId, CustomEmail, '20230901090000_MigrateOldOrderRecipients','20230901090000_MigrateOldOrderRecipients'
  FROM [CRM].[Order] WHERE CustomEmail IS NOT NULL");
				Database.RemoveColumn("[CRM].[Order]", "[CustomEmail]");
			}
		}
	}
}

namespace Crm.Order.Database
{
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230530090000)]
	public class AddContactPersonIdToOrderRecipient : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[CRM].[OrderRecipient]"))
			{
				Database.AddColumn("[CRM].[OrderRecipient]", new Column("ContactPersonId", DbType.Guid, ColumnProperty.Null));
			}
		}
	}
}

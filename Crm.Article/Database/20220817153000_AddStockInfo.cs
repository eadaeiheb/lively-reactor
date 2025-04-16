namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20220817153000)]
	public class AddStockInfo : Migration
	{
		public override void Up()
		{
			Database.AddTable(
				"CRM.Stock",
				new Column("StockId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
				new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
				new Column("ModifyUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
				new Column("CreateUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
				new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("LocationKey", DbType.Guid, ColumnProperty.Null),
				new Column("StoreKey", DbType.Guid, ColumnProperty.NotNull),
				new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull),
				new Column("Quantity", DbType.Decimal, ColumnProperty.NotNull)
				);

		}
	}
}

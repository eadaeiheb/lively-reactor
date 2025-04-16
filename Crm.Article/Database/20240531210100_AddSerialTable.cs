namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Article.Model;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20240531210100)]

	public class AddSerialTable : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("Crm.Serial"))
			{
				Database.AddTable("Crm.Serial",
					new Column("SerialId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("ModifyUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("LocationKey", DbType.Guid, ColumnProperty.Null),
					new Column("IsAvailable", DbType.Boolean, ColumnProperty.NotNull),
					new Column("StoreKey", DbType.Guid, ColumnProperty.Null),
					new Column("SerialNo", DbType.String, ColumnProperty.NotNull),
					new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull)
				);
			}
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<Serial>("Crm", "Serial");
		}
	}
}

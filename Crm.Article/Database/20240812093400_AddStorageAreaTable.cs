namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Article.Model;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20240812093400)]

	public class AddStorageAreaTable : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("Crm.StorageArea"))
			{
				Database.AddTable("Crm.StorageArea",
					new Column("StorageAreaId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("ModifyUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("StoreId", DbType.Guid, ColumnProperty.NotNull),
					new Column("StorageAreaNo", DbType.String, ColumnProperty.NotNull)
				);
			}
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<StorageArea>("Crm", "StorageArea");

			Database.AddColumnIfNotExisting("CRM.[User]", new Column("DefaultStorageAreaNo", DbType.String, 50, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("SMS.Location", new Column("StorageAreaId", DbType.Guid, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Serial", new Column("StorageAreaKey", DbType.Guid, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Stock", new Column("StorageAreaKey", DbType.Guid, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("SMS.ServiceOrderMaterial", new Column("FromStorageArea", DbType.String, ColumnProperty.Null));
		}
	}
}

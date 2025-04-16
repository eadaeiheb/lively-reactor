namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Article.Model;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20230530105500)]
	public class AddQuantityUnitEntryTable : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[QuantityUnitEntry]"))
			{
				Database.AddTable("[CRM].[QuantityUnitEntry]",
					new Column("QuantityUnitEntryId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("ModifyUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("QuantityUnitGroupKey", DbType.Guid, ColumnProperty.Null),
					new Column("Name", DbType.String, 256, ColumnProperty.Null),
					new Column("QuantityUnitKey", DbType.String, 256, ColumnProperty.NotNull),
					new Column("Description", DbType.String, 1000, ColumnProperty.Null),
					new Column("IsCustom", DbType.Boolean, ColumnProperty.NotNull),
					new Column("IsGroup", DbType.Boolean, ColumnProperty.NotNull),
					new Column("Factor", DbType.Decimal, ColumnProperty.Null),
					new Column("Divisor", DbType.Decimal, ColumnProperty.Null),
					new Column("QuantityStep", DbType.Decimal, ColumnProperty.NotNull)
					);
			}
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddEntityTypeAndAuthDataColumnIfNeeded<QuantityUnitEntry>("CRM", "QuantityUnitEntry");
			Database.AddColumnIfNotExisting("Crm.Article", new Column("QuantityUnitEntryKey", DbType.Guid, ColumnProperty.Null));

			Database.Insert("CRM.QuantityUnitEntry",
				new string[] { "[QuantityUnitEntryId]", "[Name]", "[QuantityUnitKey]", "[QuantityStep]", "[IsGroup]", "[IsCustom]" },
				new string[] { "3B04C4D3-CE4E-4019-9B41-425C7DA8EB83", "Pieces", "Stk", "0", "1", "0" });
			Database.ExecuteNonQuery(@"  
				ALTER TABLE CRM.Article
				ADD FOREIGN KEY (QuantityUnitEntryKey) REFERENCES CRM.QuantityUnitEntry(QuantityUnitEntryId);
				ALTER TABLE CRM.QuantityUnitEntry
				ADD FOREIGN KEY (QuantityUnitGroupKey) REFERENCES CRM.QuantityUnitEntry(QuantityUnitEntryId);
			");
		}
	}
}

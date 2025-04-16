namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Article.Model.Lookups;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20240130103001)]
	public class AddStoreName : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("CRM.StoreName"))
			{
				Database.AddTable("CRM.StoreName",
					new Column("StoreNameId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
					new Column("Name", DbType.String, 20, ColumnProperty.NotNull),
					new Column("Language", DbType.StringFixedLength, 2, ColumnProperty.NotNull),
					new Column("Favorite", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("SortOrder", DbType.Int16, ColumnProperty.Null),
					new Column("Value", DbType.String, 30, ColumnProperty.NotNull),
					new Column("CreateUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true));
			}
		}
	}
}

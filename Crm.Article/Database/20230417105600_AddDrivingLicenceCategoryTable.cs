namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

		[Migration(20230417105600)]

		public class AddDrivingLicenceCategoryTable : Migration
		{
		public override void Up()
		{
			if (!Database.TableExists("[LU].[DrivingLicenceCategory]"))
			{
				Database.AddTable(
					"[LU].[DrivingLicenceCategory]",
					new Column("DrivingLicenceCategoryId", DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
					new Column("Value", DbType.String, 20, ColumnProperty.NotNull),
					new Column("Name", DbType.String, 100, ColumnProperty.NotNull),
					new Column("Favorite", DbType.Boolean, ColumnProperty.NotNull, false),
					new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0),
					new Column("Language", DbType.String, 2, ColumnProperty.NotNull),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ModifyUser", DbType.String, ColumnProperty.NotNull, "'Setup'"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true)
				);
			}
		}
	}
}

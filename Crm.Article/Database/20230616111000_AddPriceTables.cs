namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	using ForeignKeyConstraint = Crm.Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;

	[Migration(20230616111000)]
	public class AddPriceTables : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("CRM.Price"))
			{
				Database.AddTable("CRM.Price",
					new Column("PriceId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
					new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, true),
					new Column("ModifyUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("CreateUser", DbType.String, 250, ColumnProperty.NotNull, "'Setup'"),
					new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
					new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull),
					new Column("QuantityUnitEntryKey", DbType.Guid, ColumnProperty.NotNull),
					new Column("CompanyKey", DbType.Guid, ColumnProperty.Null),
					new Column("CompanyPriceGroupKey", DbType.String, 256, ColumnProperty.Null),
					new Column("CompanyPriceLevelKey", DbType.String, 256, ColumnProperty.Null),
					new Column("CurrencyKey", DbType.String, 256, ColumnProperty.NotNull),
					new Column("NetPricePerUnit", DbType.Decimal, ColumnProperty.NotNull),
					new Column("MinQuantity", DbType.Decimal, ColumnProperty.Null),
					new Column("ValidFrom", DbType.DateTime, ColumnProperty.Null),
					new Column("ValidTo", DbType.DateTime, ColumnProperty.Null)
					);
			}
			if (!Database.TableExists("LU.CompanyPriceGroup"))
			{
				Database.AddTable("LU.CompanyPriceGroup",
					new Column("CompanyPriceGroupId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
				new Column("Value", DbType.String, 20, ColumnProperty.NotNull),
				new Column("Name", DbType.String, ColumnProperty.NotNull),
				new Column("Language", DbType.String, 2, ColumnProperty.NotNull),
				new Column("Favorite", DbType.Boolean, ColumnProperty.NotNull, false),
				new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0),
				new Column("CreateUser", DbType.String, 256, ColumnProperty.NotNull, "'Setup'"),
				new Column("ModifyUser", DbType.String, 256, ColumnProperty.NotNull, "'Setup'"),
				new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, "1"));
			}

			if (!Database.TableExists("LU.CompanyPriceLevel"))
			{
				Database.AddTable("LU.CompanyPriceLevel",
					new Column("CompanyPriceLevelId", DbType.Guid, ColumnProperty.PrimaryKey, "NEWSEQUENTIALID()"),
				new Column("Value", DbType.String, 20, ColumnProperty.NotNull),
				new Column("Name", DbType.String, ColumnProperty.NotNull),
				new Column("Language", DbType.String, 2, ColumnProperty.NotNull),
				new Column("Favorite", DbType.Boolean, ColumnProperty.NotNull, false),
				new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0),
				new Column("CreateUser", DbType.String, 256, ColumnProperty.NotNull, "'Setup'"),
				new Column("ModifyUser", DbType.String, 256, ColumnProperty.NotNull, "'Setup'"),
				new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull, "GETUTCDATE()"),
				new Column("IsActive", DbType.Boolean, ColumnProperty.NotNull, "1"));
			}

			Database.AddForeignKey("FK_Price_Company", "CRM.Price", "CompanyKey", "CRM.Company", "ContactKey", ForeignKeyConstraint.NoAction);
			Database.AddForeignKey("FK_Price_Article", "CRM.Price", "ArticleKey", "CRM.Article", "ArticleId", ForeignKeyConstraint.NoAction);
			Database.AddForeignKey("FK_Price_QuantityUnitEntry", "CRM.Price", "QuantityUnitEntryKey", "CRM.QuantityUnitEntry", "QuantityUnitEntryId", ForeignKeyConstraint.NoAction);

		}
	}
}

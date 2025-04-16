namespace Crm.Article.Database
{
	using System.Data;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Article.Model.Relationships;
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;
	using Crm.Library.Data.MigratorDotNet.Migrator.Helper;

	[Migration(20231006151100)]
	public class AddQuantityUnitEntryAuthData : Migration
	{
		public override void Up()
		{
			var helper = new UnicoreMigrationHelper(Database);
			helper.AddOrUpdateEntityAuthDataColumn<QuantityUnitEntry>("CRM", "QuantityUnitEntry");
			helper.AddOrUpdateEntityAuthDataColumn<Price>("CRM", "Price");
			helper.AddOrUpdateEntityAuthDataColumn<CompanyPriceGroup>("LU", "CompanyPriceGroup");
			helper.AddOrUpdateEntityAuthDataColumn<CompanyPriceLevel>("LU", "CompanyPriceLevel");
			helper.AddOrUpdateEntityAuthDataColumn<QuantityUnitEntry>("CRM", "QuantityUnitEntry");
			helper.AddOrUpdateEntityAuthDataColumn<Price>("CRM", "Price");
			helper.AddOrUpdateEntityAuthDataColumn<CompanyPriceGroup>("LU", "CompanyPriceGroup");
			helper.AddOrUpdateEntityAuthDataColumn<CompanyPriceLevel>("LU", "CompanyPriceLevel");
		}
	}
}

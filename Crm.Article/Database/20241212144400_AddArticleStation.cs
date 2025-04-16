namespace Crm.Article.Database
{
	using ForeignKeyConstraint = Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20241212144400)]

	public class AddArticleStation : Migration
	{
		public override void Up()
		{
			Database.AddColumn("CRM.Article", "StationKey", DbType.Guid, ColumnProperty.Null);

			Database.AddForeignKey("FK_Article_Station", "[CRM].[Article]", "StationKey", "[CRM].[Station]", "StationId", ForeignKeyConstraint.NoAction);
		}
	}
}

namespace Crm.Article.Database
{
	using ForeignKeyConstraint = Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20240208130000)]

	public class AddArticleAsset : Migration
	{
		public override void Up()
		{
			Database.AddTable("CRM.ArticleAsset", new Column[]
			{
				new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull),
				new Column("AssetKey", DbType.String, ColumnProperty.NotNull)
			});

			Database.AddForeignKey("FK_ArticleAsset_ArticleId", "[CRM].[ArticleAsset]", "ArticleKey", "[CRM].[Article]", "ArticleId", ForeignKeyConstraint.Cascade);
		}
	}
}

namespace Crm.Article.Database
{
	using ForeignKeyConstraint = Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;
	using System.Data;
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20230412094400)]

	public class AddArticleSkill : Migration
	{
		public override void Up()
		{
			Database.AddTable("CRM.ArticleSkill", new Column[]
			{
				new Column("ArticleKey", DbType.Guid, ColumnProperty.NotNull),
				new Column("SkillKey", DbType.String, ColumnProperty.NotNull)
			});

			Database.AddForeignKey("FK_ArticleSkill_ArticleId", "[CRM].[ArticleSkill]", "ArticleKey", "[CRM].[Article]", "ArticleId", ForeignKeyConstraint.Cascade);
		}
	}
}

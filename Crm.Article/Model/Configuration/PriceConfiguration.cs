namespace Crm.Article.Model.Configuration
{
	using Crm.Library.EntityConfiguration;

	public class PriceConfiguration : EntityConfiguration<Price>
	{
		public override void Initialize()
		{
			//Filterable properties
			NestedProperty(x => x.Article.Description, f => f.Filterable());
			NestedProperty(
				x => x.Article.ItemNo,
				f =>
				{
					f.Filterable();
					f.Sortable();
				});
			NestedProperty(x => x.Article.ArticleGroup01, f => f.Filterable());
			NestedProperty(x => x.Article.ArticleGroup02, f => f.Filterable());
			NestedProperty(x => x.Article.ArticleGroup03, f => f.Filterable());
			NestedProperty(x => x.Article.ArticleGroup04, f => f.Filterable());
			NestedProperty(x => x.Article.ArticleGroup05, f => f.Filterable());
			NestedProperty(x => x.Article.ArticleType, f => f.Filterable());
			Property(x => x.NetPricePerUnit, c =>
			{
				c.Filterable(f => f.Definition(new ScaleFilterDefinition(0, 0, 0, Operator.GreaterThan)));
				c.Sortable();
			});
			Property(x => x.CreateDate, s => s.Sortable());
		}

		public PriceConfiguration(IEntityConfigurationHolder<Price> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}

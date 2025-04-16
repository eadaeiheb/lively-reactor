namespace Crm.Article.Model.Configuration
{
	using Crm.Library.EntityConfiguration;

	public class QuantityUnitEntryConfiguration : EntityConfiguration<QuantityUnitEntry>
	{
		public override void Initialize()
		{
			Property(x => x.Description,
				f =>
				{
					f.Filterable();
					f.Sortable();
				});
			Property(
				x => x.Name,
				f =>
				{
					f.Filterable();
					f.Sortable();
				});
			Property(x => x.QuantityUnit, f => f.Filterable());
			Property(x => x.IsCustom, f => f.Filterable());
			Property(x => x.IsGroup, f => f.Filterable());
		}

		public QuantityUnitEntryConfiguration(IEntityConfigurationHolder<QuantityUnitEntry> entityConfigurationHolder)
			: base(entityConfigurationHolder)
		{
		}
	}
}

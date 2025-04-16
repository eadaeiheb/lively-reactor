namespace Crm.Article.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class QuantityUnitEntryMap : EntityClassMapping<QuantityUnitEntry>
	{
		public QuantityUnitEntryMap()
		{
			Schema("CRM");
			Table("QuantityUnitEntry");

			Id(x => x.Id,
				m =>
				{
					m.Column("QuantityUnitEntryId");
					m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
					m.UnsavedValue(Guid.Empty);
				});

			Property(x => x.Name);
			Property(x => x.QuantityUnitKey);
			Property(x => x.Description);
			Property(x => x.IsCustom);
			Property(x => x.IsGroup);
			Property(x => x.Factor);
			Property(x => x.Divisor);
			Property(x => x.QuantityStep);

			Property(x => x.QuantityUnitGroupKey, m => m.Column("QuantityUnitGroupKey"));
			ManyToOne(x => x.QuantityUnitGroup, m =>
			{
				m.Column("QuantityUnitGroupKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});

			this.EntitySet(x=>x.ChildQuantityUnitEntries, m =>
			{
				m.Key(km => km.Column("QuantityUnitGroupKey"));
				m.Inverse(true);
				m.Cascade(Cascade.Remove);
			}, a => a.OneToMany());
		}
	}
}

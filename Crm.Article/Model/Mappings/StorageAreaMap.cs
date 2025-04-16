namespace Crm.Article.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	using GuidCombGeneratorDef = LMobile.Unicore.NHibernate.GuidCombGeneratorDef;

	public class StorageAreaMap : EntityClassMapping<StorageArea>
	{
		public StorageAreaMap()
		{
			Schema("CRM");
			Table("StorageArea");

			Id(a => a.Id,
				m =>
				{
					m.Column("StorageAreaId");
					m.Generator(GuidCombGeneratorDef.Instance);
					m.UnsavedValue(Guid.Empty);
				});

			Property(x => x.StorageAreaNo);

			Property(x => x.StoreId);
			ManyToOne(x => x.Store,
				m =>
				{
					m.Column("StoreId");
					m.Insert(false);
					m.Update(false);
					m.Fetch(FetchKind.Select);
					m.Lazy(LazyRelation.Proxy);
				});
			this.EntitySet(x => x.Locations,
				map =>
				{
					map.Key(km => km.Column("StorageAreaId"));
					map.Fetch(CollectionFetchMode.Select);
					map.Lazy(CollectionLazy.Lazy);
					map.Cascade(Cascade.Persist);
					map.Inverse(true);
				},
				action => action.OneToMany());
			this.EntitySet(x => x.Stocks,
				map =>
				{
					map.Key(km => km.Column("StorageAreaKey"));
					map.Fetch(CollectionFetchMode.Select);
					map.Lazy(CollectionLazy.Lazy);
					map.Cascade(Cascade.Persist);
					map.Inverse(true);
				},
				action => action.OneToMany());
			this.EntitySet(x => x.Serials,
				map =>
				{
					map.Key(km => km.Column("StorageAreaKey"));
					map.Fetch(CollectionFetchMode.Select);
					map.Lazy(CollectionLazy.Lazy);
					map.Cascade(Cascade.Persist);
					map.Inverse(true);
				},
				action => action.OneToMany());
		}
	}
}

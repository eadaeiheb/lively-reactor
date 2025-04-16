namespace Crm.Article.Model.Mappings
{
	using Crm.Library.BaseModel.Mappings;
	using NHibernate.Mapping.ByCode;
	using System;

	public class LocationMap : EntityClassMapping<Location>
	{
		public LocationMap()
		{
			Schema("SMS");
			Table("Location");

			Id(a => a.Id, m =>
			{
				m.Column("LocationId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});

			Property(x => x.LocationNo);

			Property(x => x.StoreId);
			ManyToOne(x => x.Store, m =>
			{
				m.Column("StoreId");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});

			Property(x => x.StorageAreaId);
			ManyToOne(x => x.StorageArea, m =>
			{
				m.Column("StorageAreaId");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
			this.EntitySet(x => x.Stocks, map =>
			{
				map.Key(km => km.Column("LocationKey"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.Inverse(true);
			}, action => action.OneToMany());
			this.EntitySet(x => x.Serials, map =>
			{
				map.Key(km => km.Column("LocationKey"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.Inverse(true);
			}, action => action.OneToMany());
		}
	}
}

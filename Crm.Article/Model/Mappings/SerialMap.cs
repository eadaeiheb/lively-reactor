namespace Crm.Article.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class SerialMap : EntityClassMapping<Serial>
	{
		public SerialMap()
		{
			Schema("CRM");
			Table("Serial");

			Id(a => a.Id, m =>
			{
				m.Column("SerialId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});

			Property(x => x.SerialNo);
			Property(x => x.ArticleKey);
			Property(x => x.IsAvailable);
			Property(x => x.LocationKey);
			Property(x => x.StorageAreaKey);
			Property(x => x.StoreKey);

			ManyToOne(x => x.Store, m =>
			{
				m.Column("StoreKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
			ManyToOne(x => x.StorageArea, m =>
			{
				m.Column("StorageAreaKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
			ManyToOne(x => x.Location, m =>
			{
				m.Column("LocationKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
			ManyToOne(x => x.Article, m =>
			{
				m.Column("ArticleKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
		}
	}
}

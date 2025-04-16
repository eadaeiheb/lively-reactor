namespace Crm.Article.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class PriceMap : EntityClassMapping<Price>
	{
		public PriceMap()
		{
			Schema("CRM");
			Table("Price");

			Id(x => x.Id,
				m =>
				{
					m.Column("PriceId");
					m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
					m.UnsavedValue(Guid.Empty);
				});
			Property(x=>x.ArticleKey);
			Property(x=>x.QuantityUnitEntryKey);
			Property(x=>x.CompanyKey);
			Property(x=>x.CompanyPriceGroupKey);
			Property(x=>x.CompanyPriceLevelKey);
			Property(x=>x.CurrencyKey);
			Property(x=>x.NetPricePerUnit);
			Property(x=>x.MinQuantity);
			Property(x=>x.ValidFrom);
			Property(x=>x.ValidTo);
			ManyToOne(x => x.Article, m =>
			{
				m.Column("ArticleKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
			ManyToOne(x => x.Company, m =>
			{
				m.Column("CompanyKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
			ManyToOne(x => x.QuantityUnitEntry, m =>
			{
				m.Column("QuantityUnitEntryKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
		}
	}
}

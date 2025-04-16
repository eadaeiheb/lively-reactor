namespace Crm.Article.Model
{
	using System;

	using AutoMapper;

	using Crm.Article.Model.Lookups;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Model;

	using Main.Model.Lookups;

	public class Price : EntityBase<Guid>, ISoftDelete
	{
		public virtual Guid ArticleKey {get; set; }
		public virtual Article Article {get; set; }
		public virtual Guid QuantityUnitEntryKey {get; set; }
		public virtual QuantityUnitEntry QuantityUnitEntry {get; set; }
		public virtual Guid? CompanyKey {get; set; }
		public virtual Company Company {get; set; }
		public virtual string CompanyPriceGroupKey {get; set; }
		[IgnoreMap]
		public virtual CompanyPriceGroup CompanyPriceGroup => CompanyPriceGroupKey != null ? LookupManager.Instance.Get<CompanyPriceGroup>(CompanyPriceGroupKey) : null;
		public virtual string CompanyPriceLevelKey {get; set; }
		[IgnoreMap]
		public virtual CompanyPriceLevel CompanyPriceLevel => CompanyPriceLevelKey != null ? LookupManager.Instance.Get<CompanyPriceLevel>(CompanyPriceLevelKey) : null;
		public virtual string CurrencyKey {get; set; }
		[IgnoreMap]
		public virtual Currency Currency => CurrencyKey != null ? LookupManager.Instance.Get<Currency>(CurrencyKey) : null;
		public virtual decimal NetPricePerUnit {get; set; }
		public virtual decimal MinQuantity {get; set; }
		public virtual DateTime? ValidFrom {get; set; }
		public virtual DateTime? ValidTo { get; set; }
	}
}

namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Article.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;

	[RestTypeFor(DomainType = typeof(Price))]
	public class PriceRest : RestEntityWithExtensionValues
	{
		public Guid ArticleKey {get; set; }
		[NavigationProperty(nameof(ArticleKey))] public ArticleRest Article {get; set; }
		public Guid QuantityUnitEntryKey {get; set; }
		[NavigationProperty(nameof(QuantityUnitEntryKey))] public QuantityUnitEntryRest QuantityUnitEntry {get; set; }
		public Guid? CompanyKey {get; set; }
		[NavigationProperty(nameof(CompanyKey))] public CompanyRest Company {get; set; }
		public string CompanyPriceGroupKey {get; set; }
		public string CompanyPriceLevelKey {get; set; }
		public string CurrencyKey {get; set; }
		public decimal NetPricePerUnit {get; set; }
		public decimal MinQuantity {get; set; }
		public DateTime? ValidFrom {get; set; }
		public DateTime? ValidTo { get; set; }
	}
}

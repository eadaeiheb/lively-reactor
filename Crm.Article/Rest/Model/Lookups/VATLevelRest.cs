namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(VATLevel))]
	public class VATLevelRest : RestEntityLookupWithExtensionValues
	{
		public decimal PercentageValue { get; set; }
		public string CountryKey { get; set; }
	}
}

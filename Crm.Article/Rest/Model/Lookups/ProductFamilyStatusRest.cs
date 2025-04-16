namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(ProductFamilyStatus))]
	public class ProductFamilyStatusRest : RestEntityLookupWithExtensionValues
	{
		public string Color { get; set; } = "#AAAAAA";
	}
}

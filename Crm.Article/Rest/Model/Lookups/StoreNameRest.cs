namespace Crm.Article.Rest.Model.Lookups
{
	using Crm.Article.Model.Lookups;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(StoreName))]
	public class StoreNameRest : RestEntityLookupWithExtensionValues
	{
	}
}

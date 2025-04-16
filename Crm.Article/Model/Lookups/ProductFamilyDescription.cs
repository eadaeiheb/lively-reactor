namespace Crm.Article.Model.Lookups
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[ProductFamilyDescription]")]
	[IgnoreMissingLookups]
	public class ProductFamilyDescription : EntityLookup<string>
	{
	}
}

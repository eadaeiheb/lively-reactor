namespace Crm.Article.Model.Lookups
{
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Globalization.Lookup;

	[Lookup("[CRM].[StoreName]")]
	[IgnoreMissingLookups]
	public class StoreName : EntityLookup<string>, INoAuthorisedObject
	{
	}
}

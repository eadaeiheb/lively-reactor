namespace Crm.Article.Model.Lookups
{
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[ArticleDescription]")]
	[IgnoreMissingLookups]
	public class ArticleDescription : EntityLookup<string>, INoAuthorisedObject
	{
	}
}

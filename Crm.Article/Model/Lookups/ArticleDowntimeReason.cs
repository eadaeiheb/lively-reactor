namespace Crm.Article.Model.Lookups
{
	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[ArticleDowntimeReason]")]
	public class ArticleDowntimeReason : EntityLookup<string>, ILookupWithColor
	{
		[LookupProperty(Shared = true)]
		public virtual string Color { get; set; }
	}
}

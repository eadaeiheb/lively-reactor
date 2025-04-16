namespace Crm.Article.Model.Lookups
{
	using Crm.Library.BaseModel.Attributes;

	using Library.Globalization.Lookup;

	[Lookup("[LU].[VATLevel]", "VATLevelId")]
	public class VATLevel : EntityLookup<string>
	{
		[LookupProperty(Shared = true)]
		public virtual decimal PercentageValue { get; set; }
		[LookupProperty(Shared = true)]
		[UI(Hidden = true)]
		public virtual string CountryKey { get; set; }
	}
}

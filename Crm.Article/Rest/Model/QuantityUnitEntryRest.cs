namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Article.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(QuantityUnitEntry))]
	public class QuantityUnitEntryRest : RestEntityWithExtensionValues
	{
		public string Name { get; set; }
		public string QuantityUnitKey { get; set; }
		public string Description { get; set; }
		public bool IsCustom { get; set; }
		public Guid? QuantityUnitGroupKey { get; set; }
		[NavigationProperty(nameof(QuantityUnitGroupKey), nameof(ChildQuantityUnitEntries))]
		public QuantityUnitEntryRest QuantityUnitGroup { get; set; }
		[NavigationProperty(nameof(QuantityUnitGroupKey), nameof(QuantityUnitGroup))]
		public QuantityUnitEntryRest[] ChildQuantityUnitEntries { get; set; }
		public bool IsGroup { get; set; }
		public decimal? Factor { get; set; }
		public decimal? Divisor { get; set; }
		public decimal QuantityStep { get; set; }
	}
}

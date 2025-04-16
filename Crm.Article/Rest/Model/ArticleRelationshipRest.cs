namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Article.Model.Relationships;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(ArticleRelationship))]
	public class ArticleRelationshipRest : RestEntityWithExtensionValues
	{
		public Guid ParentId { get; set; }
		public Guid ChildId { get; set; }
		public string Information { get; set; }
		public string RelationshipTypeKey { get; set; }
		public virtual decimal? QuantityValue { get; set; }
		public virtual string QuantityUnitKey { get; set; }
		[NavigationProperty(nameof(ChildId))] public ArticleRest Child { get; set; }
		[NavigationProperty(nameof(ParentId))] public ArticleRest Parent { get; set; }
	}
}

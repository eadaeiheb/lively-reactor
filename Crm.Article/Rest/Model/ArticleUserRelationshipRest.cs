namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Main.Rest.Model;
	using Crm.Article.Model.Relationships;

	[RestTypeFor(DomainType = typeof(ArticleUserRelationship))]

	public class ArticleUserRelationshipRest : RestEntityWithExtensionValues
	{
		public virtual Guid ArticleKey { get; set; }
		public virtual string UserKey { get; set; }
		public virtual DateTime? From { get; set; }
		public virtual DateTime? To { get; set; }

		[NavigationProperty(nameof(ArticleKey))]
		public virtual ArticleRest Article { get; set; }

		[NavigationProperty(nameof(UserKey))]
		public virtual UserRest User { get; set; }
	}
}

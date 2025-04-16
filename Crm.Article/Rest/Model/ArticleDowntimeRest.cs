namespace Crm.Article.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Article.Model;

	[RestTypeFor(DomainType = typeof(ArticleDowntime))]
	public class ArticleDowntimeRest : RestEntityWithExtensionValues
	{
		public virtual string Description { get; set; }
		public virtual string DowntimeReasonKey { get; set; }
		public virtual DateTime From { get; set; }
		public virtual DateTime To { get; set; }
		public virtual Guid ArticleKey { get; set; }

		[NavigationProperty(nameof(ArticleKey))]
		public virtual ArticleRest Article { get; set; }
		public virtual bool IsExported { get; set; }
	}
}

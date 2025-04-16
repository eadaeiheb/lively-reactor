namespace Crm.Article.Model.Relationships
{
		using System;

		using Crm.Library.BaseModel;
		using Crm.Library.BaseModel.Interfaces;
		using Crm.Library.Model;

		public class ArticleUserRelationship : EntityBase<Guid>, ISoftDelete
	{
		public virtual Article Article { get; set; }
		public virtual Guid ArticleKey { get; set; }
		public virtual User User { get; set; }
		public virtual string UserKey { get; set; }
		public virtual DateTime? From { get; set; }
		public virtual DateTime? To { get; set; }

	}
}

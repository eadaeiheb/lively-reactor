namespace Crm.Article.Model
{
	using System;

	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.BaseModel;
	using Crm.Article.Model.Lookups;

	public class ArticleDowntime : EntityBase<Guid>, ISoftDelete, IExportable
	{
		public virtual string Description { get; set; }
		public virtual string DowntimeReasonKey { get; set; }
		public virtual DateTime From { get; set; }
		public virtual DateTime To { get; set; }
		public virtual Guid ArticleKey { get; set; }
		public virtual Article Article { get; set; }
		public virtual ArticleDowntimeReason ArticleDowntimeReason => DowntimeReasonKey != null ? LookupManager.Get<ArticleDowntimeReason>(DowntimeReasonKey) : null;
		public virtual bool IsExported { get; set; }

	}
}

namespace Crm.Article.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using System;

	public class Serial : EntityBase<Guid>, ISoftDelete
	{
		public virtual string SerialNo { get; set; }
		public virtual Guid? StoreKey { get; set; }
		public virtual Guid? StorageAreaKey { get; set; }
		public virtual Guid? LocationKey { get; set; }
		public virtual Guid ArticleKey { get; set; }
		public virtual bool IsAvailable { get; set; }
		public virtual Store Store { get; set; }
		public virtual StorageArea StorageArea { get; set; }
		public virtual Location Location { get; set; }
		public virtual Article Article { get; set; }
	}
}

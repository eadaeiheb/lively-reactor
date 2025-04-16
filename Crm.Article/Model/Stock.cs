namespace Crm.Article.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using System;
	
	public class Stock : EntityBase<Guid>, ISoftDelete
	{
		public virtual decimal Quantity { get; set; }
		public virtual Guid StoreKey { get; set; }
		public virtual Guid? StorageAreaKey { get; set; }
		public virtual Guid? LocationKey { get; set; }
		public virtual Guid ArticleKey { get; set; }
		public virtual Store Store { get; set; }
		public virtual StorageArea StorageArea { get; set; }
		public virtual Location Location { get; set; }
		public virtual Article Article { get; set; }
	}
}

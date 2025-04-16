namespace Crm.Article.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Newtonsoft.Json;
	using System;
	using System.Collections.Generic;
	
	public class Location : EntityBase<Guid>, ISoftDelete
	{
		public virtual string LocationNo { get; set; }

		public virtual Guid? StorageAreaId { get; set; }
		[JsonIgnore]
		public virtual StorageArea StorageArea { get; set; }

		public virtual Guid StoreId { get; set; }
		[JsonIgnore]
		public virtual Store Store { get; set; }

		public virtual ICollection<Stock> Stocks { get; set; }
		public virtual ICollection<Serial> Serials { get; set; }

		public Location()
		{
			Stocks = new List<Stock>();
			Serials = new List<Serial>();
		}
	}
}

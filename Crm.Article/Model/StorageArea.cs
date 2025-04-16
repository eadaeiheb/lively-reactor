namespace Crm.Article.Model
{
	using System;
	using System.Collections.Generic;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;

	using Newtonsoft.Json;

	public class StorageArea : EntityBase<Guid>, ISoftDelete
	{
		public virtual string StorageAreaNo { get; set; }

		public virtual Guid StoreId { get; set; }
		[JsonIgnore]
		public virtual Store Store { get; set; }

		[JsonIgnore]
		public virtual ICollection<Location> Locations { get; set; }
		public virtual ICollection<Stock> Stocks { get; set; }
		public virtual ICollection<Serial> Serials { get; set; }

		public StorageArea()
		{
			Locations = new List<Location>();
			Stocks = new List<Stock>();
			Serials = new List<Serial>();
		}
	}
}

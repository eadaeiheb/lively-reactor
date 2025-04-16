namespace Crm.Article.Model
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Newtonsoft.Json;
	using System;
	using System.Collections.Generic;

	public class Store : EntityBase<Guid>, ISoftDelete
	{
		public virtual string StoreNo { get; set; }
		public virtual string Name { get; set; }
		public virtual string LegacyId { get; set; }

		[JsonIgnore]
		public virtual ICollection<Location> Locations { get; set; }
		public virtual ICollection<StorageArea> StorageAreas { get; set; }

		public virtual ICollection<Stock> Stocks { get; set; }
		public virtual ICollection<Serial> Serials { get; set; }

		public Store()
		{
			Locations = new List<Location>();
			Stocks = new List<Stock>();
			Serials = new List<Serial>();
		}
	}
}

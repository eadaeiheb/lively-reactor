namespace Crm.Article.Model
{
	using System;
	using System.Collections.Generic;

	using Crm.Article.Model.Lookups;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;

	public class QuantityUnitEntry : EntityBase<Guid>, ISoftDelete
	{
		public virtual string Name { get; set; }
		public virtual string QuantityUnitKey { get; set; }
		public virtual QuantityUnit QuantityUnit
		{
			get { return QuantityUnitKey != null ? LookupManager.Get<QuantityUnit>(QuantityUnitKey) : null; }
		}
		public virtual string Description { get; set; }
		public virtual bool IsCustom { get; set; }
		public virtual Guid? QuantityUnitGroupKey { get; set; }
		public virtual QuantityUnitEntry QuantityUnitGroup { get; set; }
		public virtual ICollection<QuantityUnitEntry> ChildQuantityUnitEntries { get; set; }
		public virtual bool IsGroup { get; set; }
		public virtual decimal? Factor { get; set; }
		public virtual decimal? Divisor { get; set; }
		public virtual decimal QuantityStep { get; set; }
		public QuantityUnitEntry()
		{
			ChildQuantityUnitEntries = new List<QuantityUnitEntry>();
		}
	}
}

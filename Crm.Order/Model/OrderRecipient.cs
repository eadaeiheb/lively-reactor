namespace Crm.Order.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;

	public class OrderRecipient : EntityBase<Guid>, INoAuthorisedObject, ISoftDelete
	{
		public virtual Guid BaseOrderId { get; set; }
		public virtual string Email { get; set; }
		public virtual Guid ContactPersonId { get; set; }
	}
}

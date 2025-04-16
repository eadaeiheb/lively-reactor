namespace Crm.Order.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Order.Model;

	[RestTypeFor(DomainType = typeof(OrderRecipient))]
	public class OrderRecipientRest : RestEntityWithExtensionValues
	{
		public Guid BaseOrderId { get; set; }
		public string Email { get; set; }
		public Guid ContactPersonId { get; set; }
	}
}

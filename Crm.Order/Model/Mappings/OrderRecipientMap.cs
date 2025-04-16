namespace Crm.Order.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	using GuidCombGeneratorDef = LMobile.Unicore.NHibernate.GuidCombGeneratorDef;

	public class OrderRecipientMap : EntityClassMapping<OrderRecipient>
	{
		public OrderRecipientMap()
		{
			Schema("Crm");
			Table("OrderRecipient");

			Id(
				x => x.Id,
				map =>
				{
					map.Column("OrderRecipientId");
					map.Generator(GuidCombGeneratorDef.Instance);
					map.UnsavedValue(Guid.Empty);
				});

			Property(x => x.Email);
			Property(x => x.BaseOrderId);
			Property(x => x.ContactPersonId);
		}
	}
}

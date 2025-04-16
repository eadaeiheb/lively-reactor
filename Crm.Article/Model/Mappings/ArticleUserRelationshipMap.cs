namespace Crm.Article.Model.Relationships
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	using GuidCombGeneratorDef = LMobile.Unicore.NHibernate.GuidCombGeneratorDef;

	public class ArticleUserRelationshipMap : EntityClassMapping<ArticleUserRelationship>
	{
		public ArticleUserRelationshipMap()
		{
			Schema("CRM");
			Table("ArticleUserRelationship");

			Id(
				x => x.Id,
				map =>
				{
					map.Column("ArticleUserRelationshipId");
					map.Generator(GuidCombGeneratorDef.Instance);
					map.UnsavedValue(Guid.Empty);
				});
			Property(x => x.ArticleKey);
			Property(x => x.UserKey);
			Property(x => x.From, map => map.Column("`From`"));
			Property(x => x.To, map => map.Column("`To`"));
			ManyToOne(x => x.Article, m =>
			{
				m.Column("ArticleKey");
				m.Insert(false);
				m.Update(false);
				m.Lazy(LazyRelation.Proxy);
			});
			ManyToOne(x => x.User, m =>
			{
				m.Column("UserKey");
				m.Insert(false);
				m.Update(false);
				m.Lazy(LazyRelation.Proxy);
			});
		}
	}
}

namespace Crm.Article.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;
	public class ArticleDowntimeMap : EntityClassMapping<ArticleDowntime>
	{
		public ArticleDowntimeMap()
		{
			Schema("CRM");
			Table("ArticleDowntime");

			Id(x => x.Id, m =>
			{
				m.Column("ArticleDowntimeId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});
			Property(x => x.Description);
			Property(x => x.ArticleKey);
			Property(x => x.From, map => map.Column("`From`"));
			Property(x => x.To, map => map.Column("`To`"));
			Property(x => x.DowntimeReasonKey);
			Property(x => x.IsExported);
			ManyToOne(x => x.Article, m =>
			{
				m.Column("ArticleKey");
				m.Insert(false);
				m.Update(false);
				m.Lazy(LazyRelation.Proxy);
			});


		}
	}
}

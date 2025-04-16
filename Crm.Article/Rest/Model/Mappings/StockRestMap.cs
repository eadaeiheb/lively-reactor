namespace Crm.Article.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Library.AutoMapper;
	using Crm.Model;
	using Crm.Rest.Model;

	public class StockRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<Stock, StockRest>()
				.ForMember(x => x.Article, m =>
				{
					m.MapFrom(x => x.Article);
					m.MapAtRuntime();
				})
				.ForMember(x => x.Store, m =>
				{
					m.MapFrom(x => x.Store);
					m.MapAtRuntime();
				})
				.ForMember(x => x.Location, m =>
				{
					m.MapFrom(x => x.Location);
					m.MapAtRuntime();
				});
		}
	}
}

namespace Crm.Article.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Article.Model;

	public class LocationRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<Location, LocationRest>();
			mapper.CreateMap<LocationRest, Location>();
		}
	}
}

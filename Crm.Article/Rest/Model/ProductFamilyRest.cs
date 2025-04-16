namespace Crm.Article.Rest.Model
{
	using Crm.Article.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;

	using Main.Rest.Model;

	[RestTypeFor(DomainType = typeof(ProductFamily))]
	public class ProductFamilyRest : ContactRest
	{
		public virtual string StatusKey { get; set; }
		[NavigationProperty(nameof(ParentId), nameof(ChildProductFamilies))]
		public ProductFamilyRest ParentProductFamily { get; set; }

		[NavigationProperty(nameof(ParentId), nameof(ParentProductFamily))]
		public ProductFamilyRest[] ChildProductFamilies { get; set; }

		[NavigationProperty(nameof(ResponsibleUser))]
		public UserRest ResponsibleUserUser { get; set; }
	}
}

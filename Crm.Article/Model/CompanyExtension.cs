namespace Crm.Article.Model
{
	using Crm.Library.BaseModel;
	using Crm.Model;

	public class CompanyExtension : EntityExtension<Company>
	{
		public string CompanyPriceGroupKey { get; set; }
		public string CompanyPriceLevelKey { get; set; }
	}
}

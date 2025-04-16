namespace Crm.Article.BusinessRules.LocationRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Article.Model;

	public class LocationNoRequired : RequiredRule<Location>
	{
		public LocationNoRequired()
		{
			Init(c => c.LocationNo);
		}
	}
}

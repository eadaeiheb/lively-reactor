namespace Crm.Article.BusinessRules.StoreRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Article.Model;

	public class StoreNoRequired : RequiredRule<Store>
	{
		public StoreNoRequired()
		{
			Init(c => c.StoreNo);
		}
	}
}

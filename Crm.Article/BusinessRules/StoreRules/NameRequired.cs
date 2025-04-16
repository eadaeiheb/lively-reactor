namespace Crm.Article.BusinessRules.StoreRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Article.Model;
	public class NameRequired : RequiredRule<Store>
	{
		public NameRequired()
		{
			Init(c => c.Name);
		}
	}
}

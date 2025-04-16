namespace Crm.Article.BusinessRules.QuantityUnitEntryRules
{
	using Crm.Article.Model;
	using Crm.Library.Validation.BaseRules;

	public class QuantityStepNotNegative : NotNegativeRule<QuantityUnitEntry>
	{
		public QuantityStepNotNegative()
		{
			Init(a => a.QuantityStep);
		}
	}
}

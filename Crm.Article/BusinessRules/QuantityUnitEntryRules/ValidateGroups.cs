namespace Crm.Article.BusinessRules.QuantityUnitEntryRules
{
	using Crm.Article.Model;
	using Crm.Library.Validation;

	[Rule]
	public class ValidateGroups : Rule<QuantityUnitEntry>
	{
		public ValidateGroups()
			: base(RuleClass.Match)
		{
		}
		protected override RuleViolation CreateRuleViolation(QuantityUnitEntry entity)
		{
			return RuleViolation(entity, x => x.IsGroup);
		}
		protected override bool IsIgnoredFor(QuantityUnitEntry entity) => !entity.IsGroup;
		public override bool IsSatisfiedBy(QuantityUnitEntry entity)
		{
			if (string.IsNullOrEmpty(entity.Name))
				return false;
			if (entity.Factor != null || entity.Divisor != null)
				return false;
			if (entity.QuantityUnitGroupKey != null)
				return false;
			if (entity.QuantityStep < 0)
				return false;
			return true;
		}
	}
}

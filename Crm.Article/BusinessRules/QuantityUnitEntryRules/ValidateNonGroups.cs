namespace Crm.Article.BusinessRules.QuantityUnitEntryRules
{
	using Crm.Article.Model;
	using Crm.Library.Validation;

	[Rule]
	public class ValidateNonGroups : Rule<QuantityUnitEntry>
	{
		public ValidateNonGroups()
			: base(RuleClass.Match)
		{
		}
		protected override RuleViolation CreateRuleViolation(QuantityUnitEntry entity)
		{
			return RuleViolation(entity, x => x.IsGroup);
		}
		protected override bool IsIgnoredFor(QuantityUnitEntry entity) => entity.IsGroup;
		public override bool IsSatisfiedBy(QuantityUnitEntry entity)
		{
			if (!string.IsNullOrEmpty(entity.Name))
				return false;
			if (entity.Factor == null || entity.Factor <= 0)
				return false;
			if (entity.Divisor == null || entity.Divisor <= 0)
				return false;
			if (entity.QuantityUnitGroupKey == null)
				return false;
			if (entity.QuantityStep < 0)
				return false;
			return true;
		}
	}
}

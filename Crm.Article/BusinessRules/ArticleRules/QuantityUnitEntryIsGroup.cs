namespace Crm.Article.BusinessRules.ArticleRules
{
	using System;
	using System.Linq;

	using Crm.Article.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Validation;

	[Rule]
	public class QuantityUnitEntryIsGroup : Rule<Article>
	{
		private readonly IRepositoryWithTypedId<QuantityUnitEntry, Guid> quantityUnitEntryRepository;
		public QuantityUnitEntryIsGroup(IRepositoryWithTypedId<QuantityUnitEntry, Guid> quantityUnitEntryRepository)
			: base(RuleClass.Match)
		{
			this.quantityUnitEntryRepository = quantityUnitEntryRepository;
		}
		protected override RuleViolation CreateRuleViolation(Article entity) => RuleViolation(entity, x => x.QuantityUnitEntryKey);
		public override bool IsSatisfiedBy(Article entity)
		{
			if (!entity.QuantityUnitEntryKey.HasValue)
				return true;
			QuantityUnitEntry quantityUnitEntry = quantityUnitEntryRepository.GetAll().FirstOrDefault(x => x.Id == entity.QuantityUnitEntryKey);
			return quantityUnitEntry != null && quantityUnitEntry.IsGroup;
		}
	}
}

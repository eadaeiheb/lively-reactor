namespace Crm.Article.BusinessRules.ArticleRules
{
	using System.Linq;

	using Crm.Article.Model;
	using Crm.Article.Services.Interfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Validation;
	public class LicensePlateUnique : Rule<Article>
	{
		private readonly IArticleService articleService;

		protected override bool IsIgnoredFor(Article article)
		{
			return article.LicensePlate.IsNullOrEmpty();
		}

		public override bool IsSatisfiedBy(Article article)
		{
			return !articleService
				.GetArticles()
				.Any(a => a.LicensePlate == article.LicensePlate && a.Id != article.Id);
		}

		protected override RuleViolation CreateRuleViolation(Article article)
		{
			return RuleViolation(article, a => a.LicensePlate);
		}
		public LicensePlateUnique(IArticleService articleService) : base(RuleClass.Unique)
		{
			this.articleService = articleService;

		}

	}

}

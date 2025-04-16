namespace Crm.Article.Services
{
	using System;
	using System.Linq;

	using Crm.Article.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Services.Interfaces;

	public class UsedQuantityUnitEntryService : IUsedEntityService<QuantityUnitEntry>
	{
		private readonly IRepositoryWithTypedId<Article, Guid> articleRepository;
		public UsedQuantityUnitEntryService(IRepositoryWithTypedId<Article, Guid> articleRepository)
		{
			this.articleRepository = articleRepository;
		}

		public virtual bool IsUsed(QuantityUnitEntry entity) => articleRepository.GetAll().Any(x => x.QuantityUnitEntryKey == entity.Id);
	}
}

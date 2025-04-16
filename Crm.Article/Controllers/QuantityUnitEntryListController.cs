namespace Crm.Article.Controllers
{
	using System.Collections.Generic;

	using Crm.Article.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.EntityConfiguration;
	using Crm.Library.EntityConfiguration.Interfaces;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;

	using Main.Controllers;

	using Microsoft.AspNetCore.Mvc;

	public class QuantityUnitEntryListController : GenericListController<QuantityUnitEntry>
	{
		protected override string GetTitle()
		{
			return "QuantityUnitGroups";
		}

		[RequiredPermission(PermissionName.Index, Group = ArticlePlugin.PermissionGroup.Article)]
		public override ActionResult FilterTemplate()
		{
			return base.FilterTemplate();
		}
		[RequiredPermission(PermissionName.Index, Group = ArticlePlugin.PermissionGroup.Article)]
		public override ActionResult IndexTemplate()
		{
			return base.IndexTemplate();
		}
		public override ActionResult MaterialPrimaryAction()
		{
			return PartialView();
		}

		public QuantityUnitEntryListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<QuantityUnitEntry>> rssFeedProviders, IEnumerable<ICsvDefinition<QuantityUnitEntry>> csvDefinitions, IEntityConfigurationProvider<QuantityUnitEntry> entityConfigurationProvider, IRepository<QuantityUnitEntry> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}

	}
}

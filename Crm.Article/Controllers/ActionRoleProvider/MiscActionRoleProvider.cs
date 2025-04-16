namespace Crm.Article.Controllers.ActionRoleProvider
{
	using System.Linq;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Article.Model;

	public class MiscActionRoleProvider : RoleCollectorBase
	{
		public MiscActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(PermissionGroup.WebApi, nameof(Store));
			Add(PermissionGroup.WebApi, nameof(Location));
			Add(PermissionGroup.WebApi, nameof(StorageArea));
			if (pluginProvider.ActivePluginNames.Contains("Crm.Offline"))
			{
				Add(PermissionGroup.Sync, nameof(Store));
				AddImport(PermissionGroup.Sync, nameof(Store), PermissionGroup.WebApi, nameof(Store));
				Add(PermissionGroup.Sync, nameof(Location));
				AddImport(PermissionGroup.Sync, nameof(Location), PermissionGroup.WebApi, nameof(Location));
				Add(PermissionGroup.Sync, nameof(StorageArea));
				AddImport(PermissionGroup.Sync, nameof(StorageArea), PermissionGroup.WebApi, nameof(StorageArea));
			}
		}
	}
}

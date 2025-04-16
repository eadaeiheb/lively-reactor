window.jQuery = window.$ = require("jquery");
require("../../../Plugins/Main/Content/ts/namespace");
window.ko = require("knockout");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm/Content/ts/ContactDetailsViewModel");

describe("ContactDetailsViewModel", () => {
	test("contactDropboxAddress is generated correctly", () => {
		if (!window.Crm) {
			window.Crm = {};
		}
		if (!window.Crm.Settings) {
			window.Crm.Settings = {};
		}
		if (!window.Crm.Settings.DropboxDomain) {
			window.Crm.Settings.DropboxDomain = {};
		}
		const contactDetailsViewmodel = new window.Crm.ViewModels.ContactDetailsViewModel();
		expect(contactDetailsViewmodel.contactDropboxAddress()).not.toEqual("EntityInfo <EntityType_null_currentUserDropboxToken@DropboxDomain>");
		contactDetailsViewmodel.dropboxName = ko.pureComputed(() => "EntityInfo");
		contactDetailsViewmodel.currentUserDropboxToken("currentUserDropboxToken");
		contactDetailsViewmodel.contactType("EntityType");
		window.Crm.Settings.DropboxDomain = "DropboxDomain";
		expect(contactDetailsViewmodel.contactDropboxAddress()).toEqual("EntityInfo <EntityType_null_currentUserDropboxToken@DropboxDomain>");
	});

	test("currentUserDropboxAddress is generated correctly", () => {
		if (!window.Crm) {
			window.Crm = {};
		}
		if (!window.Crm.Settings) {
			window.Crm.Settings = {};
		}
		if (!window.Crm.Settings.DropboxDomain) {
			window.Crm.Settings.DropboxDomain = {};
		}
		const contactDetailsViewmodel = new window.Crm.ViewModels.ContactDetailsViewModel();
		expect(contactDetailsViewmodel.currentUserDropboxAddress()).not.toEqual("EntityInfo <EntityType_null_currentUserDropboxToken@DropboxDomain>")
		contactDetailsViewmodel.dropboxName = ko.pureComputed(() => "EntityInfo");
		contactDetailsViewmodel.currentUserDropboxToken("currentUserDropboxToken");
		contactDetailsViewmodel.contactType("EntityType");
		window.Crm.Settings.DropboxDomain = "DropboxDomain";
		expect(contactDetailsViewmodel.currentUserDropboxAddress()).toBe("?BCC=EntityInfo <EntityType_null_currentUserDropboxToken@DropboxDomain>");

	});
});

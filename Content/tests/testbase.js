window.jQuery = window.$ = require("jquery");
require("../../Plugins/Main/Content/ts/namespace");
window.ko = require("knockout");
window.Log = {
	debug: console.log,
	info: console.log,
	warn: console.warn,
	error: console.error
};
window.swal = () => {};
window._ = require("lodash");
require("../../Plugins/Main/Content/ts/helper/Helper.Url");
require("../../Plugins/Main/Content/ts/helper/Helper.User");
require("../../Plugins/Main/Content/ts/helper/Helper.String");
require("../../Plugins/Main/Content/ts/helper/Helper.DOM");
require("../../Plugins/Main/Content/ts/helper/helper");
window.$data = require("../../Plugins/Main/Content/js/jaydata/jaydata");
require("../../Plugins/Main/Content/js/jaydata/jaydata-compatibility");
require("../../Plugins/Main/Content/js/jaydata/jaydatamodules/deferred");
require("../../Plugins/Main/Content/js/jaydata/jaydatamodules/knockout");
require("../../Plugins/Main/Content/js/jaydata/jaydataproviders/InMemoryProvider");
require("../../Plugins/Main/Content/js/jaydata/jaydataproviders/oDataProvider");
require("../../Plugins/Main/Content/ts/helper/Helper.Database");
require("../../Plugins/Main/Content/ts/jaydata.custom");
require("./jquery.mockjax");
const {addFetchMockData} = require("./fetchMock");
window.ko.wrap = require("../../Plugins/Main/Content/js/system/knockout.wrap");
window.mock = window.mock || {};
window.mock.Users = window.mock.Users || [];
const klaus = {
	"$type": "Crm.Rest.Model.UserRest, Main",
	"FirstName": "Klaus",
	"LastName": "Techniker",
	"DisplayName": "Techniker, Klaus",
	"Email": "klaus@techniker.de",
	"DefaultLanguageKey": "de",
	"PersonnelId": null,
	"Latitude": null,
	"Longitude": null,
	"LastStatusUpdate": null,
	"Roles": [{"$type": "Crm.Rest.Model.Role, Main", "Id": "6", "Name": "Techniker", "Permissions": []}],
	"ExtensionValues": {"StationIds":[]},
	"Usergroups": [],
	"Id": "klaus.techniker"
};

window.mock.Users["klaus.techniker"] = klaus;
window.mockCurrentUser = function (user) {
	window.Main.ViewModels.DefaultViewModel.prototype.currentUser = window.ko.observable(window.ko.wrap.fromJS(user));
};
window.$.mockjax({
	url: window.Helper.Url.resolveUrl("~/Main/Users/CurrentUser.json"),
	responseText: klaus
});
addFetchMockData(window.Helper.Url.resolveUrl("~/Main/Users/CurrentUser.json"), klaus);
window.HelperLookup = function() {
	window.Helper.Lookup = window.Helper.Lookup || {};
	window.Helper.Lookup.getDefaultLookupValueSingleSelect = function() {
		return null;
	};
	window.Helper.Lookup.getLocalizedArrayMaps = function(lookups) {
		Object.keys(lookups).forEach(function(key) {
			lookups[key] = { "$array": [] };
		});
		return Promise.resolve();
	};
};
window.Helper?.Lookup?.setDefaultLanguage("en");
window.AuthorizationManager ||= {
	hasPermission() { return true; },
	initPromise() { return Promise.resolve(); },
	isAuthorizedForAction() { return true; }
}

// use jaydata in memory provider to mock database
// TODO: add functions to add mock/test data to in memory storage
if (!!window.Helper && !!window.Helper.Database) {
	const defaultStorageOptions = window.Helper.Database.getStorageOptions;
	window.Helper.DOM.getMetadata = function () {
		return "offline";
	};
	window.Helper.Database.getStorageOptions = function () {
		const options = defaultStorageOptions();
		options.provider = "InMemory";
		//options.dbCreation = $data.storageProviders.DbCreationType.DropAllExistingTables;
		return options;
	};
	window.$data.Queryable.prototype.include = function () { return this; };
	window.$data.Queryable.prototype.include2 = function () { return this; };
	window.$data.Queryable.prototype.withInlineCount = function() { return this; };
	window.$data.InMemoryConverter.escape["$data.String"] = function(text) {
		return typeof text === "string" ? "'" + text.replace(/'/g, "''") + "'" : text;
	};
	const initialize = window.Helper.Database.initialize;
	window.Helper.Database.initialize = function() {
		return initialize.apply(this, arguments).then(function() {
			window.database.storageProvider.supportedSetOperations.include = {};
			window.database.storageProvider.supportedSetOperations.withInlineCount = {};
		});
	};
}


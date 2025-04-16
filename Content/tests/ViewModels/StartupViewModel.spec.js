require("../testbase");
require("../JaydataDbModel");
window.async = require("../../../node_modules/async/dist/async");
require("../../../Plugins/Main/Content/ts/DefaultViewModel");
require("../../../Plugins/Main/Content/ts/OfflineBootstrapper");
require("../../../Plugins/Main/Content/ts/SignalR");
require("../../../Plugins/Main/Content/ts/StartupViewModel");

describe("StartupViewModelTests", () => {

	beforeEach(async () => {
		await window.Helper.Database.initialize();
	});

	test("cancelling a step does not execute next cancellable step", (done) => {
		expect.assertions(2);
		$.connection = $.connection || {};
		const viewModel = new Main.ViewModels.HomeStartupViewModel();
		viewModel.steps([]);
		viewModel.steps.push({
			cancellable: ko.observable(true),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress() {
			},
			run() {
				expect(true).toBe(true);
				return $.Deferred().promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.steps.push({
			cancellable: ko.observable(true),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress() {
			},
			run() {
				expect(true).toBe(false);
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.steps.push({
			cancellable: ko.observable(false),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress() {
			},
			run() {
				expect(true).toBe(true);
				return $.Deferred().promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.hideStartupPage = () => {
		};
		viewModel.init({}).then(() => {
			viewModel.cancel();
			setTimeout(() => done(), 100);
		});
	});


	test("cancelling when there are no cancellable steps", (done) => {
		expect.assertions(3);
		$.connection = $.connection || {};
		mockCurrentUser(window.mock.Users["klaus.techniker"]);
		const viewModel = new Main.ViewModels.HomeStartupViewModel();
		viewModel.steps([]);
		const firstStepPromise = $.Deferred();
		viewModel.steps.push({
			cancellable: ko.observable(false),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress: function () {
			},
			run: function () {
				expect(true).toBe(true);
				return firstStepPromise.promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.steps.push({
			cancellable: ko.observable(false),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress: function () {
			},
			run: function () {
				expect(true).toBe(true);
				return $.Deferred().resolve().promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.steps.push({
			cancellable: ko.observable(false),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress: function () {
			},
			run: function () {
				expect(true).toBe(true);
				return $.Deferred().resolve().promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.hideStartupPage = function () {
		};
		viewModel.init({}).then(() => {
			viewModel.cancel();
			firstStepPromise.resolve();
			setTimeout(() => done(), 100);
		});
	});

	test("cancelling before cancellable step", (done) => {
		expect.assertions(2);
		$.connection = $.connection || {};
		mockCurrentUser(window.mock.Users["klaus.techniker"]);
		const viewModel = new Main.ViewModels.HomeStartupViewModel();
		viewModel.steps([]);
		const firstStepPromise = $.Deferred();
		viewModel.steps.push({
			cancellable: ko.observable(false),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress: function () {
			},
			run: function () {
				expect(true).toBe(true);
				return firstStepPromise.promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.steps.push({
			cancellable: ko.observable(true),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress: function () {
			},
			run: function () {
				expect("this step should not run when cancelled").toBe(false);
				return $.Deferred().resolve().promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.steps.push({
			cancellable: ko.observable(false),
			completedItems: ko.observable(null),
			completion: ko.observable(null),
			description: ko.observable(null),
			progress: function () {
			},
			run: function () {
				expect("this step should when cancelled").toBeTruthy();
				return $.Deferred().resolve().promise();
			},
			status: ko.observable(null),
			totalItems: ko.observable(null)
		});
		viewModel.hideStartupPage = () => {
		};
		viewModel.init({}).then(() => {
			viewModel.cancel();
			firstStepPromise.resolve();
			setTimeout(() => done(), 100);
		});
	});
});

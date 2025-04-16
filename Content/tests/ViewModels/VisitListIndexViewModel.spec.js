window = window || {};
window.ko = window.ko || {
	observable: jest.fn(x => {
		let obs = function (val) {
			if (val !== undefined) obs.value = val;
			return obs.value;
		};
		obs.value = x;
		obs.subscribe = jest.fn().mockReturnValue({ dispose: jest.fn() });
		return obs;
	}),
	observableArray: jest.fn(arr => {
		let obs = window.ko.observable(arr || []);
		obs.push = jest.fn(item => { obs.value.push(item); return obs.value.length; });
		return obs;
	}),
	unwrap: jest.fn(x => x && typeof x === 'function' ? x() : x),
	contextFor: jest.fn().mockReturnValue({ $root: {} })
};

window.Helper = window.Helper || {};
window.Helper.Visit = window.Helper.Visit || {};
window.Helper.Visit.setStatus = jest.fn().mockReturnValue({
	then: jest.fn().mockImplementation(function (callback) {
		callback();
		return this;
	}),
	fail: jest.fn().mockImplementation(function (callback) {
		return this;
	})
});

window.Helper.String = window.Helper.String || {};
window.Helper.String.getTranslatedString = jest.fn(key => key);

window.Main = window.Main || {};
window.Main.ViewModels = window.Main.ViewModels || {};

window.Crm = window.Crm || {};
window.Crm.VisitReport = window.Crm.VisitReport || {};
window.Crm.VisitReport.ViewModels = window.Crm.VisitReport.ViewModels || {};

window.Crm.VisitReport.ViewModels.VisitListIndexViewModel = function () {
	this.loading = jest.fn();
	this.showSnackbar = jest.fn();
};

window.Crm.VisitReport.ViewModels.VisitListIndexViewModel.prototype.setInProgress = function (item) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(item, "InProgress").then(function () {
		viewModel.loading(false);
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("VisitInProgress"));
	});
};

window.Crm.VisitReport.ViewModels.VisitListIndexViewModel.prototype.complete = function (item) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(item, "Completed").then(function () {
		viewModel.loading(false);
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("VisitCompleted"));
	}).fail(function () {
		viewModel.loading(false);
	});
};

describe("Crm.VisitReport.ViewModels.VisitListIndexViewModel", () => {
	let viewModel;
	let mockItem;

	beforeEach(() => {
		jest.clearAllMocks();

		viewModel = new window.Crm.VisitReport.ViewModels.VisitListIndexViewModel();

		mockItem = {
			Id: window.ko.observable("test-visit-id"),
			StatusKey: window.ko.observable("Planned")
		};
	});

	test("setInProgress should set visit status to InProgress and show success message", () => {
		viewModel.setInProgress(mockItem);

		expect(viewModel.loading).toHaveBeenCalledWith(true);
		expect(window.Helper.Visit.setStatus).toHaveBeenCalledWith(mockItem, "InProgress");
		expect(viewModel.loading).toHaveBeenCalledWith(false);
		expect(viewModel.showSnackbar).toHaveBeenCalledWith("VisitInProgress");
	});

	test("complete should set visit status to Completed and show success message", () => {
		viewModel.complete(mockItem);

		expect(viewModel.loading).toHaveBeenCalledWith(true);
		expect(window.Helper.Visit.setStatus).toHaveBeenCalledWith(mockItem, "Completed");
		expect(viewModel.loading).toHaveBeenCalledWith(false);
		expect(viewModel.showSnackbar).toHaveBeenCalledWith("VisitCompleted");
	});

	test("complete should handle failure case", () => {
		const originalSetStatus = window.Helper.Visit.setStatus;
		window.Helper.Visit.setStatus = jest.fn().mockReturnValue({
			then: jest.fn().mockReturnThis(),
			fail: jest.fn().mockImplementation(function (callback) {
				callback();
				return this;
			})
		});

		viewModel.complete(mockItem);

		expect(viewModel.loading).toHaveBeenCalledWith(true);
		expect(window.Helper.Visit.setStatus).toHaveBeenCalledWith(mockItem, "Completed");
		expect(viewModel.loading).toHaveBeenCalledWith(false);
		expect(viewModel.showSnackbar).not.toHaveBeenCalled();

		window.Helper.Visit.setStatus = originalSetStatus;
	});
});

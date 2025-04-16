require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderCreateViewModel");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../Plugins/Main/Content/ts/knockout.custom");
require("../../../Plugins/Main/Content/ts/knockout.custom.validation");
require("../../../Plugins/Crm.Service/Content/ts/validation-rules")
require("../../../Plugins/Main/Content/ts/VisibilityViewModel");
require("../../../Plugins/Main/Content/ts/NumberingService");
require("../../../Plugins/Crm.Service/Content/ts/DispatchAdHocViewModel");
window.Helper.Address = require("../../../Plugins/Crm/Content/ts/helper/Helper.Address").HelperAddress;

describe("DispatchAdHocViewModel", () => {

	beforeAll(async () => {

		await window.Helper.Database.initialize();

		window.Crm.Service.Settings = {
			Dispatch: {
				DispatchNoIsGenerated: false,
				DispatchNoIsCreateable: false
			},
			AdHoc: {
				AdHocNumberingSequenceName: ""
			}
		}
		window.NumberingService.createNewNumberBasedOnAppSettings = jest.fn().mockResolvedValue(new Promise((resolve) => resolve(undefined)));
		window.NumberingService.getNextFormattedNumber = jest.fn().mockResolvedValue(new Promise((resolve) => resolve(undefined)));
		window.database.saveChanges = jest.fn();
		window.Helper.ServiceOrder = {
			CreateServiceOrderData: jest.fn().mockImplementation(() => ({
				create: jest.fn()
			}))
		}
	})

	test("Knockout validation is working properly", async () => {

		const dispatchAdhocViewModel = new window.Crm.Service.ViewModels.DispatchAdHocViewModel();

		const serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create().asKoObservable()
		const vmServiceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create().asKoObservable();
		vmServiceOrder.ServiceOrderTemplate = window.ko.observable();
		dispatch.ServiceOrder = window.ko.observable(serviceOrder);
		dispatch.DispatchNo = ko.observable();
		dispatch.Date(new Date(2019, 0, 1, 12, 30, 0));
		dispatch.EndDate(new Date(2019, 0, 1, 17, 0, 0));
		dispatch.StatusKey("ClosedComplete");

		dispatchAdhocViewModel.dispatch(dispatch);
		dispatchAdhocViewModel.serviceOrder = ko.observable(vmServiceOrder);
		dispatchAdhocViewModel.errors = ko.observableArray(["Dummy error message", "Another dummy error message"]);
		dispatchAdhocViewModel.errors.showAllMessages = jest.fn();
		dispatchAdhocViewModel.errors.scrollToError = jest.fn();
		dispatchAdhocViewModel.errors.expandCollapsiblesWithErrors = jest.fn();

		await dispatchAdhocViewModel.submit();

		expect(dispatchAdhocViewModel.errors.showAllMessages).toHaveBeenCalled();
		expect(window.Helper.ServiceOrder.CreateServiceOrderData().create).not.toHaveBeenCalled();
		expect(window.database.saveChanges).not.toHaveBeenCalled();
	});
});

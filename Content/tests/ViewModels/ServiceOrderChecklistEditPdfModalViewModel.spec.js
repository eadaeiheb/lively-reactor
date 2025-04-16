require("../testbase");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Sms.Checklists/Content/ts/ServiceOrderChecklistEditPdfModalViewModel");

describe("ServiceOrderChecklistEditPdfModalViewModelTests", () => {
	test("getData", async () => {
		await window.Helper.Database.initialize();
		const viewModel = new window.Sms.Checklists.ViewModels.ServiceOrderChecklistEditPdfModalViewModel(null);

		const serviceOrder = window.database.CrmService_ServiceOrderHead.defaultType.create().asKoObservable();
		const dispatch = window.database.CrmService_ServiceOrderDispatch.defaultType.create().asKoObservable();
		dispatch.ServiceOrder = window.ko.observable(serviceOrder);
		dispatch.Date(new Date(2019, 0, 1, 12, 30, 0));
		dispatch.EndDate(new Date(2019, 0, 1, 17, 0, 0));
		dispatch.CreateUser("Test");

		viewModel.dispatch = dispatch;
		viewModel.serviceOrder = serviceOrder;

		const testEmptyString = viewModel.getData("");
		expect(testEmptyString).toBe("");

		const testGetCorrectData = viewModel.getData("dispatch_CreateUser");
		expect(testGetCorrectData).toBe("Test");

		const testDateFormat = viewModel.getData("dispatch_Date");
		expect(testDateFormat).toBe(new Date(2019, 0, 1, 12, 30, 0).toLocaleString());

		const testFalseString = viewModel.getData("abc_iajdkjas_sadlk_bad");
		expect(testFalseString).toBe("");
	});
});

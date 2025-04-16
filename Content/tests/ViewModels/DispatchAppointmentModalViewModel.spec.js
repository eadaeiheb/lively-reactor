require("../testbase");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../JaydataDbModel");
window.Helper.Address = require("../../../Plugins/Crm/Content/ts/helper/Helper.Address").HelperAddress;
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm.Service/Content/ts/DispatchAppointmentModalViewModel");

describe("DispatchAppointmentModalViewModel", () => {
	test("Get primary communication", async () => {
		await window.Helper.Database.initialize();
		let dispatchAppointmentModalViewModel = new window.Crm.Service.ViewModels.DispatchAppointmentModalViewModel();
		const emails = [];
		let result = dispatchAppointmentModalViewModel.getPrimaryEmail(emails);
		expect(result).toBeNull();
		let email = window.database.Crm_Email.Crm_Email.create();
		email.Data = "oldemail@test.com";
		emails.push(email.asKoObservable());
		email = window.database.Crm_Email.Crm_Email.create();
		email.CreateDate = new Date();
		email.Data = "newemail@test.com";
		emails.push(email.asKoObservable());
		result = dispatchAppointmentModalViewModel.getPrimaryEmail(emails);
		expect(result).toBe("oldemail@test.com");

		dispatchAppointmentModalViewModel = new window.Crm.Service.ViewModels.DispatchAppointmentModalViewModel();
		const phones = [];
		result = dispatchAppointmentModalViewModel.getPrimaryPhone(phones);
		expect(result).toBe("");
		let phone = new window.database.Crm_Phone.createNew();
		phone.Data = "+49 4471 966 0";
		phones.push(phone.asKoObservable());
		phone = new window.database.Crm_Phone.createNew();
		phone.Data = "+49 1234 567 8";
		phone.CreateDate = new Date();
		phones.push(phone.asKoObservable());
		result = dispatchAppointmentModalViewModel.getPrimaryPhone(phones);
		expect(result).toBe("+49 4471 966 0");
	});
});

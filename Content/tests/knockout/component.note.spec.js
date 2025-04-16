require("../testbase");
require("../JaydataDbModel");
window.Helper.Note = require("../../../Plugins/Crm/Content/ts/helper/Helper.Note").HelperNote;
require("../../../Plugins/Crm/Content/ts/NoteViewModel");
require("../../../Plugins/Crm/Content/ts/knockout.component.note");
require("../../../Plugins/Crm.Service/Content/ts/NoteDisplayTextProvider");
require("../../../Plugins/Crm.VisitReport/Content/ts/NoteDisplayTextProvider");
require("../../../Plugins/Crm.Project/Content/ts/NoteDisplayTextProvider");
require("../../../Plugins/Crm.Order/Content/ts/NoteDisplayTextProvider");
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Lookup.setDefaultLanguage("en");

describe("Knockout Component", () => {
	beforeAll(async () => {
		await window.Helper.Database.initialize();
		const v1 = new window.database.CrmService_ServiceOrderStatus.CrmService_ServiceOrderStatus();
		v1.Key = v1.Value = "1";
		const v2 = new window.database.CrmService_ServiceOrderStatus.CrmService_ServiceOrderStatus();
		v2.Key = v2.Value = "ReadyForInvoice";
		const CrmService_ServiceOrderStatus = [v1, v2];

		const v3 = new window.database.CrmService_ServiceOrderInvoiceReason.CrmService_ServiceOrderInvoiceReason();
		v3.Key = v3.Value = "1";
		const CrmService_ServiceOrderInvoiceReason = [v3];

		const v4 = new window.database.CrmProject_ProjectStatus.CrmProject_ProjectStatus();
		v4.Key = v4.Value = "1";
		const CrmProject_ProjectStatus = [v4];

		const v5 = new window.database.CrmOrder_OrderStatus.CrmOrder_OrderStatus();
		v5.Key = v5.Value = "1";
		const CrmOrder_OrderStatus = [v5];

		$data.Queryable.prototype.toArray = function () {
			const d = $.Deferred();
			switch (this.defaultType.name) {
				case "CrmService_ServiceOrderStatus":
					return d.resolve(CrmService_ServiceOrderStatus).promise();
				case "CrmService_ServiceOrderInvoiceReason":
					return d.resolve(CrmService_ServiceOrderInvoiceReason).promise();
				case "CrmProject_ProjectStatus":
					return d.resolve(CrmProject_ProjectStatus).promise();
				case "CrmOrder_OrderStatus":
					return d.resolve(CrmOrder_OrderStatus).promise();
			}
		};
		Helper.String.getTranslatedString = text => "translation of " + text + " {0}";
	});

	test("ServiceOrderHeadCreatedNote", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ServiceOrderHeadCreatedNote";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toEqual("translation of ServiceOrderHeadCreated {0}"));
	});

	test("ServiceContractStatusChangedNote", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ServiceContractStatusChangedNote";
		note.Text = "trollo";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ServiceContractStatusSet trollo"));
	});

	test("ServiceCaseStatusChangedNote", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ServiceCaseStatusChangedNote";
		note.Text = "trollo";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ServiceCaseStatusSet trollo"));
	});

	test("OrderStatusChangedNote 1", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "OrderStatusChangedNote";
		note.Text = "trollo";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe(note.Text));
	});

	test("OrderStatusChangedNote 2", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "OrderStatusChangedNote";
		note.Text = "1";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ServiceOrderStatusSetTo 1"));
	});


	test("OrderStatusChangedNote 3", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "OrderStatusChangedNote";
		note.Text = "ReadyForInvoice";
		note.Meta = "";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ServiceOrderStatusSetTo ReadyForInvoice"));
	});

	test("OrderStatusChangedNote 4", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "OrderStatusChangedNote";
		note.Text = "ReadyForInvoice";
		note.Meta = "1";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ServiceOrderStatusSetTo ReadyForInvoice\r\ntranslation of InvoiceReason {0}: 1"));
	});

	test("OrderStatusChangedNote 5", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "OrderStatusChangedNote";
		note.Text = "ReadyForInvoice";
		note.Meta = "1;rem0rk";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ServiceOrderStatusSetTo ReadyForInvoice\r\ntranslation of InvoiceReason {0}: 1 (rem0rk)"));
	});

	test("VisitReportClosedNote", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "VisitReportClosedNote";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of VisitReportClosed {0}"));
	});

	test("ProjectCreatedNote", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectCreatedNote";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ProjectCreated {0}"));
	});

	test("ProjectStatusChangedNote 1", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectStatusChangedNote";
		note.Text = "hallo";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("hallo"));
	});

	test("ProjectStatusChangedNote 2", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectStatusChangedNote";
		note.Text = "1";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ProjectStatusSet 1"));
	});

	test("ProjectLostNote 1", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectLostNote";
		note.Text = ";|;;|;";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ProjectLost {0}"));
	});

	test("ProjectLostNote 2", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectLostNote";
		note.Text = "Competitor;|;;|;";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of ProjectLost {0}\ntranslation of Category {0}: Competitor"));
	});

	test("ProjectLostNote 3", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectLostNote";
		note.Text = "Competitor;|;test;|;";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text =>
				expect(text).toBe("translation of ProjectLost {0}\ntranslation of Category {0}: Competitor"
					+ "\ntest translation of Competitor {0}"));
	});

	test("ProjectLostNote 4", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "ProjectLostNote";
		note.Text = "Competitor;|;test;|;sample remark";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text =>
				expect(text).toBe("translation of ProjectLost {0}"
					+ "\ntranslation of Category {0}: Competitor"
					+ "\ntest translation of Competitor {0}"
					+ "\ntranslation of Remark {0}: sample remark"));
	});

	test("BaseOrderCreatedNote", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "BaseOrderCreatedNote";
		note.Text = "123";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of 123 {0}"));
	});

	test("BaseOrderStatusChangedNote 1", async () => {
		expect.assertions(1);
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "BaseOrderStatusChangedNote";
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of nullStatusSet {0}"));
	});

	test("BaseOrderStatusChangedNote 2", async () => {
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "BaseOrderStatusChangedNote";
		note.Meta = 123;
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of 123StatusSet {0}"));
	});
	test("BaseOrderStatusChangedNote 3", async () => {
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "BaseOrderStatusChangedNote";
		note.Text = "Closed";
		note.Meta = 123;
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of 123Closed {0}"));
	});
	test("BaseOrderStatusChangedNote 4", async () => {
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "BaseOrderStatusChangedNote";
		note.Text = "123";
		note.Meta = 123;
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("123"));
	});
	test("BaseOrderStatusChangedNote 5", async () => {
		const note = new window.database.Crm_Note.Crm_Note();
		note.NoteType = "BaseOrderStatusChangedNote";
		note.Text = "1";
		note.Meta = 123;
		await window.Crm.ViewModels.NoteViewModel.getDisplayText(note)
			.then(text => expect(text).toBe("translation of 123StatusSetTo 1"));
	});
});


const openDatabase = require("websql");

window.openDatabase = new Proxy(openDatabase, {
	apply(target, thisArg, argArray) {
		argArray[0] = argArray[0].replace("Lmobile", ":memory:");
		return Reflect.apply(target, thisArg, argArray);
	}
});

window.async = require("../../../node_modules/async/dist/async");
require("../testbase");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../Plugins/Main/Content/ts/knockout.custom");
window.Helper.Object = require("../../../Plugins/Main/Content/ts/helper/Helper.Object").HelperObject;
require("../../../Plugins/Crm.Offline/Content/ts/Helper.Offline");
require("../../../Plugins/Crm.Offline/Content/ts/Helper.Sync");
require("./DisableRelations");
require("../JaydataDbModel");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.DynamicForms/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Offline/Content/ts/OfflineModel");
require("../../../Plugins/Sms.Checklists/Content/ts/OfflineModel");
require("../../../Plugins/Crm.PerDiem/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");


describe("Helper.Sync.Transaction", () => {
	const url = Helper.Url.resolveUrl("~/Crm/File/AddFile");
	$.mockjax({
		url: url,
		responseTime: 250,
		responseText: ""
	});
	let localDatabaseWithoutRelations;

	async function setup(cb) {
		window.Helper.DOM.getMetadata = function () {
			return "offline";
		};
		await window.Helper.Database.initialize();
		const initializeStore = window.$data.storageProviders.InMemory.InMemoryProvider.prototype.initializeStore;
		window.$data.storageProviders.InMemory.InMemoryProvider.prototype.initializeStore = function () {
			localDatabaseWithoutRelations = this.context;
			return initializeStore.apply(this, arguments);
		};
		await window.Helper.Sync.syncToServer(function () {
		});
		localDatabaseWithoutRelations.stateManager.reset();
		const definitions = window.Helper.Sync.getDefinitions();

		definitions.forEach(definition => {
			if (definition.table) {
				const table = localDatabaseWithoutRelations[definition.table];
				if (table) {
					table.map(x => table.remove(x));
				}
			}
		});
		await localDatabaseWithoutRelations.saveChanges();
		namespace("window.Crm.Offline").Database = localDatabaseWithoutRelations;
		cb(localDatabaseWithoutRelations);
	}

	function create(type) {
		const entity = window.database[type].defaultType.create();
		entity.Id = window.$data.createGuid().toString();
		entity.ItemStatus = window.ko.ItemStatus.Added;
		entity.localTimestamp = Date.now();
		return entity;
	}

	function save(db, expectedTransactionCount, doneCallback) {
		const expectedAmount = db.stateManager.trackedEntities.length;
		expectedTransactionCount = expectedTransactionCount || 1;
		let transactions = {};
		let actualAmount = 0;

		db.saveChanges().then(function () {
			window.odatajs.oData.request = function (data, cb) {
				const changeRequests = data.data.__batchRequests[0].__changeRequests;
				actualAmount += changeRequests.length;
				let hasUniqueId = true;
				changeRequests.forEach(function (change) {
					const entityIds = [];
					entityIds.push(change.data.Id);
					if (entityIds.indexOf(change.headers["Transaction-ID"]) !== -1)
						hasUniqueId = false;
				});
				expect(hasUniqueId).toBe(true);

				transactions = changeRequests.reduce(function (map, x) {
					const transactionId = x.headers["Transaction-ID"];
					map[transactionId] = map[transactionId] + 1 || 1;
					return map;
				}, transactions);

				data.__batchResponses = [];
				cb(data, {statusCode: 200});
			};
			window.Helper.Sync.syncToServer(() => {
			}).then(function () {
				expect(actualAmount).toBe(expectedAmount);
				const actualTransactionCount = Object.keys(transactions).length;
				expect(actualTransactionCount).toBe(expectedTransactionCount);
				doneCallback();
			});
		});
	}

	test("Sync Transaction Note FileResource", done => {
		expect.assertions(3);
		setup(db => {
			const note = create("Crm_Note");
			const file = create("Crm_FileResource");
			file.ParentId = note.Id;
			db.add(note);
			db.add(file);
			save(db, undefined, done);
		});
	}, 10000);

	test("Sync Transaction Checklist FileResources", done => {
		expect.assertions(3);
		setup(db => {
			const checklist = create("SmsChecklists_ServiceOrderChecklist");
			checklist.ReferenceKey = window.$data.createGuid().toString();
			const file1 = create("Crm_FileResource");
			const file2 = create("Crm_FileResource");
			const file3 = create("Crm_FileResource");
			const response1 = create("CrmDynamicForms_DynamicFormResponse")
			response1.DynamicFormReferenceKey = checklist.Id;
			response1.DynamicFormElementType = "FileAttachmentDynamicFormElement";
			response1.Value = '';
			const response2 = create("CrmDynamicForms_DynamicFormResponse")
			response2.DynamicFormReferenceKey = checklist.Id;
			response2.DynamicFormElementType = "FileAttachmentDynamicFormElement";
			response2.Value = '';
			const response3 = create("CrmDynamicForms_DynamicFormResponse")
			response3.DynamicFormReferenceKey = checklist.Id;
			response3.DynamicFormElementType = "FileAttachmentDynamicFormElement";
			response3.Value = '';
			const relationship1 = create("CrmDynamicForms_DynamicFormResponseFileResourceRelationship");
			relationship1.DynamicFormResponseKey = response2.Id;
			relationship1.FileResourceKey = file1.Id;
			const relationship2 = create("CrmDynamicForms_DynamicFormResponseFileResourceRelationship");
			relationship2.DynamicFormResponseKey = response3.Id;
			relationship2.FileResourceKey = file2.Id;
			const relationship3 = create("CrmDynamicForms_DynamicFormResponseFileResourceRelationship");
			relationship3.DynamicFormResponseKey = response3.Id;
			relationship3.FileResourceKey = file3.Id;
			db.add(checklist);
			db.add(file1);
			db.add(relationship1);
			db.add(file2);
			db.add(relationship2);
			db.add(file3);
			db.add(relationship3);
			db.add(response1);
			db.add(response2);
			db.add(response3);
			save(db, 1, done);
		});
	}, 10000);
	test("Sync Transaction ServiceOrder Installation", done => {
		expect.assertions(3);
		setup(db => {
			const order = create("CrmService_ServiceOrderHead");
			const installation = create("CrmService_Installation");
			order.InstallationId = installation.Id;
			db.add(order);
			db.add(installation);
			save(db, undefined, done);
		});
	});

	test("Sync Transaction ServiceOrder Dispatch Checklist Response", done => {
		expect.assertions(3);
		setup(db => {
			const order = create("CrmService_ServiceOrderHead");
			const dispatch = create("CrmService_ServiceOrderDispatch");
			dispatch.OrderId = order.Id;
			const checklist = create("SmsChecklists_ServiceOrderChecklist");
			checklist.ReferenceKey = order.Id;

			const response = create("CrmDynamicForms_DynamicFormResponse")
			response.DynamicFormReferenceKey = checklist.Id;
			response.DynamicFormElementType = "SingleLineText";
			response.Value = "slt slt";

			db.add(order);
			db.add(dispatch);
			db.add(checklist);
			db.add(response);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction Two ServiceOrders same Installation", done => {
		expect.assertions(3);
		setup(db => {
			const order1 = create("CrmService_ServiceOrderHead");
			const order2 = create("CrmService_ServiceOrderHead");
			const installation = create("CrmService_Installation");
			order1.InstallationId = installation.Id;
			order2.InstallationId = installation.Id;
			db.add(order1);
			db.add(order2);
			db.add(installation);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction ServiceOrder Dispatch", done => {
		expect.assertions(3);
		setup(db => {
			const order = create("CrmService_ServiceOrderHead");
			const dispatch = create("CrmService_ServiceOrderDispatch");
			dispatch.OrderId = order.Id;
			db.add(order);
			db.add(dispatch);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction ServiceOrder TimePosting PerDiemReport UserTimeEntry", done => {
		expect.assertions(3);
		setup(db => {
			const order = create("CrmService_ServiceOrderHead");
			order.OrderNo = "1";
			const report = create("CrmPerDiem_PerDiemReport");
			const posting = create("CrmService_ServiceOrderTimePosting");
			posting.OrderId = order.Id;
			posting.PerDiemReportId = report.Id;
			const entry = create("CrmPerDiem_UserTimeEntry");
			entry.PerDiemReportId = report.Id;
			db.add(order);
			db.add(posting);
			db.add(report);
			db.add(entry);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction Expense PerDiemReport", done => {
		expect.assertions(3);
		setup(db => {
			const report = create("CrmPerDiem_PerDiemReport");
			const expense = create("CrmPerDiem_UserExpense");
			expense.PerDiemReportId = report.Id;
			db.add(report);
			db.add(expense);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction Expense PerDiemReport FileResource", done => {
		expect.assertions(3);
		setup(db => {
			const report = create("CrmPerDiem_PerDiemReport");
			const expense = create("CrmPerDiem_UserExpense");
			const file = create("Crm_FileResource");
			expense.PerDiemReportId = report.Id;
			expense.FileResourceKey = file.Id;
			db.add(report);
			db.add(expense);
			db.add(file);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction Note FileResource Dispatch ServiceOrder Installation Checklist", done => {
		setup(db => {
			const order = create("CrmService_ServiceOrderHead");
			order.OrderNo = "1";
			const dispatch = create("CrmService_ServiceOrderDispatch");
			dispatch.OrderId = order.Id;
			const installation = create("CrmService_Installation");
			order.InstallationId = installation.Id;
			const note = create("Crm_Note");
			note.ContactId = order.Id;
			const file1 = create("Crm_FileResource");
			file1.ParentId = note.Id;
			const file2 = create("Crm_FileResource");
			file2.ParentId = note.Id;
			const checklist = create("SmsChecklists_ServiceOrderChecklist");
			checklist.ReferenceKey = order.Id;
			const material = create("CrmService_ServiceOrderMaterial");
			material.OrderId = order.Id;
			db.add(order);
			db.add(dispatch);
			db.add(installation);
			db.add(note);
			db.add(file1);
			db.add(file2);
			db.add(checklist);
			db.add(material);
			save(db, undefined, done);
		});
	});
	test("Sync Transaction PerDiemReport, ServiceOrder", done => {
		expect.assertions(4);
		setup(db => {
			const order = create("CrmService_ServiceOrderHead");
			const dispatch = create("CrmService_ServiceOrderDispatch");
			dispatch.OrderId = order.Id;
			db.add(order);
			db.add(dispatch);
			const report = create("CrmPerDiem_PerDiemReport");
			const expense = create("CrmPerDiem_UserExpense");
			expense.PerDiemReportId = report.Id;
			db.add(report);
			db.add(expense);
			save(db, 2, done);
		});
	});
	test("Sync Transaction Note FileResource, Checklist FileResource", done => {
		expect.assertions(4);
		setup(db => {
			const note = create("Crm_Note");
			const file1 = create("Crm_FileResource");
			file1.ParentId = note.Id;
			db.add(note);
			db.add(file1);

			const checklist = create("SmsChecklists_ServiceOrderChecklist");
			checklist.ReferenceKey = window.$data.createGuid().toString();
			const file2 = create("Crm_FileResource");
			const response = create("CrmDynamicForms_DynamicFormResponse")
			response.DynamicFormReferenceKey = checklist.Id;
			response.DynamicFormElementType = "FileAttachmentDynamicFormElement";
			response.Value = "";
			const relationship = create("CrmDynamicForms_DynamicFormResponseFileResourceRelationship");
			relationship.FileResourceKey = file2.Id;
			relationship.DynamicFormResponseKey = response.Id;
			db.add(checklist);
			db.add(file2);
			db.add(response);
			db.add(relationship);

			save(db, 2, done);
		});
	});
	test("Sync Transaction Note FileResource, Checklist FileResource, ServiceOrder Dispatch ", done => {
		expect.assertions(5);
		setup(db => {
			const note = create("Crm_Note");
			const file1 = create("Crm_FileResource");
			file1.ParentId = note.Id;
			db.add(note);
			db.add(file1);

			const checklist = create("SmsChecklists_ServiceOrderChecklist");
			checklist.ReferenceKey = window.$data.createGuid().toString();
			const file2 = create("Crm_FileResource");
			const response = create("CrmDynamicForms_DynamicFormResponse")
			response.DynamicFormReferenceKey = checklist.Id;
			response.DynamicFormElementType = "FileAttachmentDynamicFormElement";
			response.Value = "";
			const relationship = create("CrmDynamicForms_DynamicFormResponseFileResourceRelationship");
			relationship.FileResourceKey = file2.Id;
			relationship.DynamicFormResponseKey = response.Id;
			db.add(checklist);
			db.add(file2);
			db.add(response);
			db.add(relationship);

			const order = create("CrmService_ServiceOrderHead");
			const dispatch = create("CrmService_ServiceOrderDispatch");
			dispatch.OrderId = order.Id;
			db.add(order);
			db.add(dispatch);

			save(db, 3, done);
		});
	});
	test("Sync Transaction Company ParentCompany", done => {
		expect.assertions(3);
		setup(db => {
			const parentCompany = create("Crm_Company");
			const company = create("Crm_Company");
			company.ParentId = parentCompany.Id;
			db.add(parentCompany);
			db.add(company);
			save(db, undefined, done);
		});
	});

	test("Sync Transaction Person Company", done => {
		expect.assertions(3);
		setup(db => {
			const company = create("Crm_Company");
			const person = create("Crm_Person");
			person.ParentId = company.Id;
			db.add(company);
			db.add(person);
			save(db, undefined, done);
		});
	});

	test("Sync Transaction Person Address", done => {
		expect.assertions(3);
		setup(db => {
			const person = create("Crm_Person");
			const address = create("Crm_Address");
			person.StandardAddressKey = address.Id;
			db.add(person);
			db.add(address);
			save(db, undefined, done);
		});
	});

	test("Sync Transaction with duplicated transaction id functions", done => {
		expect.assertions(3);
		setup(db => {
			window.Helper.Database.setTransactionId("Crm_FileResource",
				async function (fileResource) {
					return fileResource.ParentId;
				});
			window.Helper.Database.setTransactionId("Crm_FileResource",
				async function (fileResource) {
					return fileResource.Id;
				});
			window.Helper.Database.setTransactionId("Crm_FileResource",
				async function (fileResource) {
					return fileResource.ParentId;
				});
			window.Helper.Database.setTransactionId("Crm_FileResource",
				async function (fileResource) {
					return fileResource.Id;
				});
			const note = create("Crm_Note");
			const file1 = create("Crm_FileResource");
			file1.ParentId = note.Id;
			const file2 = create("Crm_FileResource");
			file2.ParentId = note.Id;
			db.add(note);
			db.add(file1);
			db.add(file2);

			save(db, 1, done);
		});
	});
});

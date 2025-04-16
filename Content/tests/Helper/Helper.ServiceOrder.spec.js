require("../testbase");
window.Helper.ServiceOrder = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrder").HelperServiceOrder;

describe("Helper.ServiceOrder", () => {
	test("setStatus", () => {
		expect.assertions(2);
		window.Helper.Database = {
			getDatabaseEntity: function (entity) {
				return entity;
			}
		};
		const serviceOrder = {
			Closed: null,
			StatusKey: "New"
		};
		const serviceOrderStatus = {
			Groups: "Scheduling",
			Key: "ReadyForScheduling"
		};

		window.Helper.ServiceOrder.setStatus(serviceOrder, serviceOrderStatus);

		expect(serviceOrder.StatusKey).toEqual(serviceOrderStatus.Key);
		expect(serviceOrder.Closed).toBeNull();
	});
	test("setClosedStatus", () => {
		expect.assertions(2);
		window.Helper.Database = {
			getDatabaseEntity: function (entity) {
				return entity;
			}
		};
		const serviceOrder = {
			Closed: null,
			StatusKey: "New"
		};
		const serviceOrderStatus = {
			Groups: "Closed",
			Key: "Closed"
		};

		window.Helper.ServiceOrder.setStatus(serviceOrder, serviceOrderStatus);

		expect(serviceOrder.StatusKey).toEqual(serviceOrderStatus.Key);
		expect(serviceOrder.Closed).not.toBeNull();
	});
	test("setStatusBulkAction", () => {
		expect.assertions(2);
		window.Helper.Database = {
			getDatabaseEntity: function (entity) {
				return entity;
			}
		};
		const serviceOrders = [
			{
				Closed: null,
				StatusKey: "New"
			}, {
				Closed: null,
				StatusKey: "Completed"
			}
		];
		const serviceOrderStatus = {
			Groups: "Closed",
			Key: "Closed"
		};

		window.Helper.ServiceOrder.setStatus(serviceOrders, serviceOrderStatus);

		expect(serviceOrders[0].StatusKey).toEqual(serviceOrderStatus.Key);
		expect(serviceOrders[1].StatusKey).toEqual(serviceOrderStatus.Key);
	});
	test("isInStatusGroup returns true for single group", () => {
		expect.assertions(1);
		namespace("window.Crm.Offline").Database = {
			CrmService_ServiceOrderHead: {
				map: function () {
					return window.database.CrmService_ServiceOrderHead;
				},
				find: function () {
					return $.Deferred().resolve("ReadyForInvoice").promise();
				}
			}
		};
		window.Helper.Lookup = {
			getLookupByKeyQuery: function () {
				return {
					first: function () {
						return $.Deferred().resolve({
							Groups: "PostProcessing",
							Key: "ReadyForInvoice"
						}).promise();
					}
				};
			}
		};

		Helper.ServiceOrder.isInStatusGroup("FCCC134D-52DE-4371-9084-6B49EB48C3FC", "PostProcessing")
			.then(result => expect(result).toBe(true));
	});

	test("isInStatusGroup returns false for single group", () => {
		expect.assertions(1);
		namespace("window.Crm.Offline").Database = {
			CrmService_ServiceOrderHead: {
				map: function () {
					return window.database.CrmService_ServiceOrderHead;
				},
				find: function () {
					return $.Deferred().resolve("ReadyForScheduling").promise();
				}
			}
		};
		window.Helper.Lookup = {
			getLookupByKeyQuery: function () {
				return {
					first: function () {
						return $.Deferred().resolve({
							Groups: "Scheduling",
							Key: "ReadyForScheduling"
						}).promise();
					}
				};
			}
		};

		Helper.ServiceOrder.isInStatusGroup("FCCC134D-52DE-4371-9084-6B49EB48C3FC", "PostProcessing")
			.then(result => expect(result).toBe(false));
	});

	test("isInStatusGroup returns true for array of groups", () => {
		expect.assertions(1);
		namespace("window.Crm.Offline").Database = {
			CrmService_ServiceOrderHead: {
				map: function () {
					return window.database.CrmService_ServiceOrderHead;
				},
				find: function () {
					return $.Deferred().resolve("ReadyForInvoice").promise();
				}
			}
		};
		window.Helper.Lookup = {
			getLookupByKeyQuery: function () {
				return {
					first: function () {
						return $.Deferred().resolve({
							Groups: "PostProcessing",
							Key: "ReadyForInvoice"
						}).promise();
					}
				};
			}
		};

		Helper.ServiceOrder.isInStatusGroup("FCCC134D-52DE-4371-9084-6B49EB48C3FC", ["PostProcessing", "Closed"])
			.then(result => expect(result).toBe(true));
	});
	test("isInStatusGroup returns false for array of groups", () => {
		expect.assertions(1);
		namespace("window.Crm.Offline").Database = {
			CrmService_ServiceOrderHead: {
				map: function () {
					return window.database.CrmService_ServiceOrderHead;
				},
				find: function () {
					return $.Deferred().resolve("ReadyForScheduling").promise();
				}
			}
		};
		window.Helper.Lookup = {
			getLookupByKeyQuery: function () {
				return {
					first: function () {
						return $.Deferred().resolve({
							Groups: "Scheduling",
							Key: "ReadyForScheduling"
						}).promise();
					}
				};
			}
		};

		Helper.ServiceOrder.isInStatusGroup("FCCC134D-52DE-4371-9084-6B49EB48C3FC", ["PostProcessing", "Closed"])
			.then(result => expect(result).toBe(false));
	});
});

require("../testbase");
const XHRMock = require("../xhr-mock-2.4.1");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.Service/Content/ts/OfflineModel");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderCreateViewModel");
require("../../../Plugins/Crm.Service/Content/ts/DispatchDetailsViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderDetailsMaterialsTabViewModel");

describe("ServiceOrderDetailsMaterialsTabViewModel", () => {

	test("delete material with document attribute deletes file first", async () => {
		expect.assertions(4);
		(window.Helper.Confirm ||= {}).confirmDeleteAsync = async function () {
			return true;
		};
		const viewModel = new window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel({});
		await window.Helper.Database.initialize();
		window.database.saveChanges = function () {
			expect(window.database.stateManager.trackedEntities).toHaveLength(3);
			expect(window.database.stateManager.trackedEntities[0].data instanceof window.database.Crm_DocumentAttribute.elementType).toBe(true);
			expect(window.database.stateManager.trackedEntities[1].data instanceof window.database.Crm_FileResource.elementType).toBe(true);
			expect(window.database.stateManager.trackedEntities[2].data instanceof window.database.CrmService_ServiceOrderMaterial.elementType).toBe(true);
			return Promise.resolve();
		};
		const material = new window.database.CrmService_ServiceOrderMaterial.createNew({
			Id: $data.createGuid().toString(),
			DocumentAttributes: [new window.database.Crm_DocumentAttribute.createNew({
				FileResource: new window.database.Crm_FileResource.createNew()
			})]
		});
		const mock = XHRMock.setup();
		mock.get("/api/CrmService_ServiceOrderMaterialSerial", {
			status: 200, headers: {
				"Content-Type": "application/json; odata.metadata=minimal", "OData-Version": "4.0"
			}, body: {
				"@odata.context": "http://localhost/api/$metadata#CrmService_ServiceOrderMaterialSerial", "value": []
			}
		});
		await viewModel.deleteServiceOrderMaterial(material.asKoObservable());
	});
});

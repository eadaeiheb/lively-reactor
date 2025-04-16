require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Crm/Content/ts/GenericListViewModel.Geolocation");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Visit = require("../../../Plugins/Crm.VisitReport/Content/ts/Helper/Helper.Visit");
window.Helper.Batch = require("../../../Plugins/Main/Content/ts/helper/Helper.Batch").HelperBatch;
window.Helper.Map = require("../../../Plugins/Main/Content/ts/helper/Helper.Map").HelperMap;
window.Helper.Address = require("../../../Plugins/Crm/Content/ts/helper/Helper.Address").HelperAddress;
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;

const {ContactListViewModel, isContactListViewModel} = require("../../../Plugins/Crm/Content/ts/ContactListViewModel")
const {ServiceContractListIndexViewModel} = require("../../../Plugins/Crm.Service/Content/ts/ServiceContractListIndexViewModel")
require("../../../Plugins/Main/Content/ts/VisibilityViewModel")
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderCreateViewModel")
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderDispatchListIndexViewModel");
require("../../../Plugins/Crm.Service/Content/ts/ServiceOrderHeadListIndexViewModel");
const {DispatchAdHocViewModel} = require("../../../Plugins/Crm.Service/Content/ts/DispatchAdHocViewModel")
const {DispatchDetailsViewModel} = require("../../../Plugins/Crm.Service/Content/ts/DispatchDetailsViewModel")
const {VisitCreateViewModel} = require("../../../Plugins/Crm.VisitReport/Content/ts/ViewModels/VisitCreateViewModel")
const {ContactListViewModelExtension} = require("../../../Plugins/Crm.Offline/Content/ts/ContactListViewModelExtension")

describe("ContactListViewModel", () => {
	describe("isContactListViewModel", () => {
		it("checks whether or not the viewModel is an instance of ContactListViewModel", async () => {
			window.Crm.Service.Settings = {
				ServiceContract: {
					MaintenanceOrderGenerationMode: ""
				}
			}
			await window.Helper.Database.initialize();
		
			const contactListViewModel = new ContactListViewModel("Crm_Tag");
			const serviceContractListIndexViewModel = new ServiceContractListIndexViewModel();
			const contactListViewModelExtension = new ContactListViewModelExtension("Crm_Tag");
			const dispatchAdHocViewModel = new DispatchAdHocViewModel();
			const dispatchDetailsViewModel = new DispatchDetailsViewModel();
			const visitCreateViewModel = new VisitCreateViewModel();

			expect(isContactListViewModel(contactListViewModel)).toEqual(true);
			expect(isContactListViewModel(serviceContractListIndexViewModel)).toEqual(true);
			expect(isContactListViewModel(contactListViewModelExtension)).toEqual(true);

			expect(isContactListViewModel(dispatchAdHocViewModel)).toEqual(false);
			expect(isContactListViewModel(dispatchDetailsViewModel)).toEqual(false);
			expect(isContactListViewModel(visitCreateViewModel)).toEqual(false);
		});
	})
})
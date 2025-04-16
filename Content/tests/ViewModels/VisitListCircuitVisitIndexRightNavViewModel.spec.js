require("../testbase");
require("../../../Plugins/Crm/Content/ts/OfflineModel");
require("../../../Plugins/Crm.VisitReport/Content/ts/OfflineModel");
require("../JaydataDbModel");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../Plugins/Main/Content/ts/knockout.custom.validation");
require("../../../Plugins/Main/Content/ts/knockout.custom");
require("../../../Plugins/Main/Content/ts/GenericListViewModel");
require("../../../Plugins/Main/Content/ts/GenericListViewModel.Map");
require("../../../Plugins/Crm/Content/ts/GenericListViewModel.Geolocation");
require("../../../Plugins/Crm/Content/ts/ContactListViewModel")
const VisitListCircuitVisitIndexRightNavViewModel = require("../../../Plugins/Crm.VisitReport/Content/ts/ViewModels/VisitListCircuitVisitIndexRightNavViewModel").VisitListCircuitVisitIndexRightNavViewModel;
const VisitListIndexViewModel = require("../../../Plugins/Crm.VisitReport/Content/ts/ViewModels/VisitListIndexViewModel").VisitListIndexViewModel;
require("../../../Plugins/Main/Content/ts/helper/Helper.String")
require("../../../Plugins/Main/Content/ts/helper/Helper.User")
const {HelperUrl} = require("../../../Plugins/Main/Content/ts/helper/Helper.Url");
const HelperGeocoding = require("../../../Plugins/Crm.VisitReport/Content/ts/Helper/Helper.Geocoding").HelperGeocoding;
window.Helper.Geocoding = HelperGeocoding;
window.Helper.Lookup = require("../../../Plugins/Main/Content/ts/helper/Helper.Lookup").HelperLookup;
window.Helper.Visit = require("../../../Plugins/Crm.VisitReport/Content/ts/Helper/Helper.Visit");
window.Helper.Batch = require("../../../Plugins/Main/Content/ts/helper/Helper.Batch").HelperBatch;
window.Helper.Map = require("../../../Plugins/Main/Content/ts/helper/Helper.Map").HelperMap;
window.Helper.Address = require("../../../Plugins/Crm/Content/ts/helper/Helper.Address").HelperAddress;
window.Helper.Distinct = require("../../../Plugins/Main/Content/ts/helper/Helper.Distinct").HelperDistinct;

describe("VisitListCircuitVisitIndexRightNavViewModel", () => {

	const latitude = 49.002179201803365
	const longitude = 9.491280367883553
	const fudge = 0.005;
	const street = "Im Horben 7"
	const city = "Sulzbach an der Murr"
	const reverseGeocodeResponse = `${street}, ${city}`;
	const geocodeResponse = {Latitude: latitude, Longitude: longitude};

	beforeAll(async () => {
		window.Crm.VisitReport.Settings = {
			Geocoder: {
				GoogleMapsApiKey: "some key"
			}
		};
		window.ko.contextFor = jest.fn().mockReturnValue({$root: null});
		window.Helper.Offline = {
			status: "online"
		}
	});

	beforeEach(() => {
		window.Helper.Geocoding.getFormattedAddress = jest.fn().mockResolvedValue(reverseGeocodeResponse);
		window.Helper.Geocoding.getAddress = jest.fn().mockResolvedValue(geocodeResponse);
	});

	describe("when using geocoding API", () => {
		it("doesn't trigger geocoding api if no key is provided", async () => {
			await window.Helper.Database.initialize();
			window.Crm.VisitReport.Settings.Geocoder.GoogleMapsApiKey = "";
			const viewModel = new VisitListCircuitVisitIndexRightNavViewModel()
			viewModel.parentListViewModel = new VisitListIndexViewModel();
			viewModel.search = jest.fn();
			viewModel.setLatitude(latitude);
			viewModel.setLongitude(longitude);
			viewModel.setFudge(fudge);
			expect(viewModel.getLocationPoint()).not.toBeNull();
			expect(viewModel.geocodingIsEnabled()).toBe(false);
			await viewModel.init();
			expect(window.Helper.Geocoding.getFormattedAddress).not.toHaveBeenCalled();
			expect(viewModel.hasGeocodingError()).toBe(false);
			expect(viewModel.locationPointAsFormattedAddress()).toBe(null);
		});
		it("handles success response properly when initializing", async () => {
			await window.Helper.Database.initialize();
			window.Crm.VisitReport.Settings.Geocoder.GoogleMapsApiKey = "some key";
			const viewModel = new VisitListCircuitVisitIndexRightNavViewModel()
			viewModel.parentListViewModel = new VisitListIndexViewModel();
			viewModel.search = jest.fn();
			viewModel.setLatitude(latitude);
			viewModel.setLongitude(longitude);
			viewModel.setFudge(fudge);
			expect(viewModel.getLocationPoint()).not.toBeNull();
			expect(viewModel.geocodingIsEnabled()).toBe(true);
			await viewModel.init();
			expect(viewModel.hasGeocodingError()).toBe(false);
			expect(viewModel.locationPointAsFormattedAddress()).toBe(reverseGeocodeResponse);
		});
		it("handles error response properly when initializing", async () => {
			await window.Helper.Database.initialize();
			window.Crm.VisitReport.Settings.Geocoder.GoogleMapsApiKey = "some key";
			const viewModel = new VisitListCircuitVisitIndexRightNavViewModel()
			viewModel.parentListViewModel = new VisitListIndexViewModel();
			viewModel.search = jest.fn();
			viewModel.setLatitude(latitude);
			viewModel.setLongitude(longitude);
			viewModel.setFudge(fudge);
			expect(viewModel.getLocationPoint()).not.toBeNull();
			expect(viewModel.geocodingIsEnabled()).toBe(true);
			window.Helper.Geocoding.getFormattedAddress = jest.fn().mockImplementation(() => Promise.reject({message: "couldn't get address"}));
			await viewModel.init();
			expect(viewModel.hasGeocodingError()).toBe(true);
			expect(viewModel.locationPointAsFormattedAddress()).toBe(null);
		});
		it("handles success response properly when saving custom location", async () => {
			await window.Helper.Database.initialize();
			window.Crm.VisitReport.Settings.Geocoder.GoogleMapsApiKey = "some key";
			const viewModel = new VisitListCircuitVisitIndexRightNavViewModel()
			viewModel.parentListViewModel = new VisitListIndexViewModel();
			viewModel.search = jest.fn();
			viewModel.editLocationPoint(true);
			viewModel.useArbitraryAddress(true);
			viewModel.arbitraryAddress().street(street);
			viewModel.arbitraryAddress().city(city);
			viewModel.normalAddressErrors = ko.observableArray([]);
			viewModel.arbitraryAddressErrors = ko.observableArray([]);
			await viewModel.saveCustomLocation();
			expect(viewModel.hasGeocodingError()).toBe(false);
			expect(viewModel.editLocationPoint()).toBe(false);
			expect(viewModel.getLocationPoint()).toEqual(expect.objectContaining({
				latitude: geocodeResponse.Latitude,
				longitude: geocodeResponse.Longitude
			}));
		});
		it("handles error response properly when saving custom location", async () => {
			await window.Helper.Database.initialize();
			window.Crm.VisitReport.Settings.Geocoder.GoogleMapsApiKey = "some key";
			const viewModel = new VisitListCircuitVisitIndexRightNavViewModel()
			viewModel.parentListViewModel = new VisitListIndexViewModel();
			viewModel.search = jest.fn();
			viewModel.editLocationPoint(true);
			viewModel.useArbitraryAddress(true);
			viewModel.arbitraryAddress().street(street);
			viewModel.arbitraryAddress().city(city);
			viewModel.normalAddressErrors = ko.observableArray([]);
			viewModel.arbitraryAddressErrors = ko.observableArray([]);
			window.Helper.Geocoding.getAddress = jest.fn().mockImplementation(() => Promise.reject({message: "couldn't get address"}));
			await viewModel.saveCustomLocation();
			expect(viewModel.hasGeocodingError()).toBe(true);
			expect(viewModel.editLocationPoint()).toBe(true);
		})
	});
});
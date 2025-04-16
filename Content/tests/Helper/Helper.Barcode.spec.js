require("../testbase");
require("../JaydataDbModel");
const {HelperBarcode} = require("../../../Plugins/Main/Content/ts/helper/Helper.Barcode");

describe("Helper.Barcode", () => {

	beforeAll(async () => {
		await window.Helper.Database.initialize();
	});

	describe("getPreviewValue", () => {
		test("returns placeholder as a fallback", () => {
			const placeholder = "no value";
			window.Helper.String.setStringTranslation("BarcodePlaceholder", placeholder);
			const site = window.database.Main_Site.defaultType.create().asKoObservable();
			site.ExtensionValues().ReportBarcodePrefix("");
			site.ExtensionValues().ReportBarcodeSuffix("");
			const val = HelperBarcode.getPreviewValue(site);
			expect(val).toEqual(placeholder);
		});
		test("concatenates prefix and suffix correctly", () => {
			let val = "";
			const site = window.database.Main_Site.defaultType.create().asKoObservable();
			site.ExtensionValues().ReportBarcodePrefix("ERP-24321");
			site.ExtensionValues().ReportBarcodeSuffix("");
			val = HelperBarcode.getPreviewValue(site);
			expect(val).toEqual(`${site.ExtensionValues().ReportBarcodePrefix()}-`);

			site.ExtensionValues().ReportBarcodePrefix("");
			site.ExtensionValues().ReportBarcodeSuffix("ERP-24321");
			val = HelperBarcode.getPreviewValue(site);
			expect(val).toEqual(`-${site.ExtensionValues().ReportBarcodeSuffix()}`);

			site.ExtensionValues().ReportBarcodePrefix("ERP-24321");
			site.ExtensionValues().ReportBarcodeSuffix("ERP-24321");
			val = HelperBarcode.getPreviewValue(site);
			expect(val).toEqual(`${site.ExtensionValues().ReportBarcodePrefix()}--${site.ExtensionValues().ReportBarcodeSuffix()}`);
		});
	});

	test("getValue", () => {
		const serviceOrder = window.database.CrmService_ServiceOrderHead.defaultType.create();
		serviceOrder.OrderNo = "AdHoc-124324"
		serviceOrder.PurchaseOrderNo = "1234242";

		const site = window.database.Main_Site.defaultType.create().asKoObservable();
		site.ExtensionValues().ReportBarcodePrefix(null);
		site.ExtensionValues().ReportBarcodeRoot("OrderNo,PurchaseOrderNo");
		site.ExtensionValues().ReportBarcodeSuffix(null);

		let val = ""
		val = HelperBarcode.getValue(site, serviceOrder);
		expect(val).toEqual(`${serviceOrder.OrderNo}-${serviceOrder.PurchaseOrderNo}`);

		site.ExtensionValues().ReportBarcodePrefix("ERP-24321");
		site.ExtensionValues().ReportBarcodeSuffix("ERP-24321");
		val = HelperBarcode.getValue(site, serviceOrder);
		expect(val).toEqual(`${site.ExtensionValues().ReportBarcodePrefix()}-${serviceOrder.OrderNo}-${serviceOrder.PurchaseOrderNo}-${site.ExtensionValues().ReportBarcodeSuffix()}`);
	});
})

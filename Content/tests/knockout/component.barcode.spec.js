require("../testbase");

const {
	BarcodeViewModel,
	validateLength,
	validateContent
} = require("../../../Plugins/Main/Content/ts/knockout.component.barcode");

describe("knockout.component.barcode", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe("validation", () => {
		test("validateLength", () => {
			let val = "AdHoc-341243"
			let format = "CODE39";
			let res = validateLength(val, format)
			expect(res.isValid).toEqual(true);
			expect(res.errorMessage).toBeFalsy()

			val = "AdHoc-341243-432487895hdffdfdsfhshfsd4237825543";
			format = "CODE39";
			res = validateLength(val, format)
			expect(res.isValid).toEqual(false);
			expect(res.errorMessage).toBeTruthy()

			val = "AdHoc-341243";
			format = "CODE128";
			res = validateLength(val, format)
			expect(res.isValid).toEqual(true);
			expect(res.errorMessage).toBeFalsy();

			val = "AdHoc-341243432147672364423-fdhgjsaggkahsadffdasfasfd";
			format = "CODE128";
			res = validateLength(val, format)
			expect(res.isValid).toEqual(false);
			expect(res.errorMessage).toBeTruthy();

			val = "AdHoc-3412434";
			format = "QR-Code";
			res = validateLength(val, format)
			expect(res.isValid).toEqual(true);
			expect(res.errorMessage).toBeFalsy();

			val = "AdHoc-341243432147672364423-fdhgjsaggkahsadffdasfasfdfdjaskfj4320rj89234jf8i9j238ijrrj3i2ij29fj328jf2u32uf9u 239u98fu2389fu32uf932u f8932u89fu2398uf8923uf9u3298fu8932fu9u2389fu2389fu8932uf8932u8932uf9832u98u38u2uf823uf92f988888888888888888888888888fu82rfu23rf2f3frf33f";
			format = "QR-Code";
			res = validateLength(val, format)
			expect(res.isValid).toEqual(false);
			expect(res.errorMessage).toBeTruthy();
		});
		test("validateContent", () => {
			let val = "AdHoc-341243-£"
			let format = "CODE39";
			let res = validateContent(val, format)
			expect(res.isValid).toEqual(false);
			expect(res.errorMessage).toBeTruthy()

			val = "AdHoc-341243"
			format = "CODE39";
			res = validateContent(val, format)
			expect(res.isValid).toEqual(true);
			expect(res.errorMessage).toBeFalsy()

			val = "£¬-AdHoc-341243"
			format = "CODE128";
			res = validateContent(val, format)
			expect(res.isValid).toEqual(false);
			expect(res.errorMessage).toBeTruthy()

			val = "AdHoc-341243"
			format = "CODE128";
			res = validateContent(val, format)
			expect(res.isValid).toEqual(true);
			expect(res.errorMessage).toBeFalsy()

			val = "AdHoc-455345243-☺"
			format = "QR-Code";
			res = validateContent(val, format)
			expect(res.isValid).toEqual(false);
			expect(res.errorMessage).toBeTruthy()
		})
	});
	test("validates correctly", () => {
		const invalidChar = "£";
		const val = ko.observable(`val-${invalidChar}`);
		const format = ko.observable("CODE39");
		const onValidate = jest.fn();
		const viewModel = new BarcodeViewModel(
			{
				barcodeElementId: "",
				value: val,
				format,
				printOnly: false,
				onValidate
			}
		);
		viewModel.validate()
		expect(viewModel.isInvalid()).toEqual(true)
		expect(onValidate).toHaveBeenCalled();
	})
	test("renders if validation passes", () => {

		document.getElementById = jest.fn().mockReturnValue({
			style: {
				width: "auto",
				height: "auto"
			}
		});

		const renderBarcodeMock = jest
			.spyOn(BarcodeViewModel.prototype, "renderBarcode")
			.mockImplementation()

		const val = ko.observable(`AdHoc-43721894`);
		const format = ko.observable("CODE39");

		new BarcodeViewModel(
			{
				barcodeElementId: "",
				value: val,
				format,
				printOnly: false,
			}
		);

		expect(renderBarcodeMock).toHaveBeenCalled();
	});
	test("doesn't render if validation fails", () => {

		document.getElementById = jest.fn().mockReturnValue({
			style: {
				width: "auto",
				height: "auto"
			}
		});

		const renderBarcodeMock = jest
			.spyOn(BarcodeViewModel.prototype, "renderBarcode")
			.mockImplementation()

		const val = ko.observable(`AdHoc-341243-£`);
		const format = ko.observable("CODE39");

		new BarcodeViewModel(
			{
				barcodeElementId: "",
				value: val,
				format,
				printOnly: false,
			}
		);

		expect(renderBarcodeMock).not.toHaveBeenCalled();
	})
})
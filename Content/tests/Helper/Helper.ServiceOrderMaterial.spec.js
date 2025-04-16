require("../testbase");
window.Helper.ServiceOrderMaterial = require("../../../Plugins/Crm.Service/Content/ts/helper/Helper.ServiceOrderMaterial").HelperServiceOrderMaterial;

describe("Helper.ServiceOrderMaterial", () => {
	test("validate quantity step any", () => {
		expect.assertions(5);
		const serviceOrderMaterial = {
			Article: ko.observable({
				QuantityUnitEntry: ko.observable({
					QuantityStep: ko.observable(0)
				})
			}), QuantityUnitEntry: ko.observable({
				QuantityStep: ko.observable(0)
			})
		};

		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.1, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.25, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.5, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(1, serviceOrderMaterial)).toBe(true);
	});
	test("validate quantity step 0.25", () => {
		expect.assertions(5);
		const serviceOrderMaterial = {
			Article: ko.observable({
				QuantityUnitEntry: ko.observable({
					QuantityStep: ko.observable(0.25)
				})
			}), QuantityUnitEntry: ko.observable({
				QuantityStep: ko.observable(0.25)
			})
		};

		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.1, serviceOrderMaterial)).toBe(false);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.25, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.5, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(1, serviceOrderMaterial)).toBe(true);
	});
	test("validate quantity step 1", () => {
		expect.assertions(5);
		const serviceOrderMaterial = {
			Article: ko.observable({
				QuantityUnitEntry: ko.observable({
					QuantityStep: ko.observable(1)
				})
			}), QuantityUnitEntry: ko.observable({
				QuantityStep: ko.observable(1)
			})
		};

		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.1, serviceOrderMaterial)).toBe(false);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.25, serviceOrderMaterial)).toBe(false);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.5, serviceOrderMaterial)).toBe(false);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(1, serviceOrderMaterial)).toBe(true);
	});

	test("validate quantity step 0.01", () => {
		expect.assertions(6);
		const serviceOrderMaterial = {
			Article: ko.observable({
				QuantityUnitEntry: ko.observable({
					QuantityStep: ko.observable(0.01)
				})
			}), QuantityUnitEntry: ko.observable({
				QuantityStep: ko.observable(0.01)
			})
		};

		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.1, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.25, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.5, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.001, serviceOrderMaterial)).toBe(false);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(1, serviceOrderMaterial)).toBe(true);
	});

	test("validate quantity step 0.001", () => {
		expect.assertions(6);
		const serviceOrderMaterial = {
			Article: ko.observable({
				QuantityUnitEntry: ko.observable({
					QuantityStep: ko.observable(0.001)
				})
			}), QuantityUnitEntry: ko.observable({
				QuantityStep: ko.observable(0.001)
			})
		};

		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.1, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.25, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.5, serviceOrderMaterial)).toBe(true);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(0.0001, serviceOrderMaterial)).toBe(false);
		expect(window.Helper.ServiceOrderMaterial.quantityValidator(1, serviceOrderMaterial)).toBe(true);
	});
});

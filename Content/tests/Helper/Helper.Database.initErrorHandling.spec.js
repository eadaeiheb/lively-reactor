require("../testbase");
require("../JaydataDbModel");

describe("Helper.Database", function () {
	test("init rejects on error", () => {
		expect.assertions(1);
		window.Helper.Database.getStorageOptions = function () {
			throw new Error("test error");
		};
		window.Helper.Database.initialize().catch(function (e) {
			expect(e.message).toEqual("test error");
		});
	});
});


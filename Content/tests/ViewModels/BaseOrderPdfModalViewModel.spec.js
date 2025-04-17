
require("../testbase");
require("../knockout/testbase");
require("../JaydataDbModel");

// Initialize the namespace structure
window.Crm = window.Crm || {};
window.Crm.Order = window.Crm.Order || {};
window.Crm.Order.ViewModels = window.Crm.Order.ViewModels || {};

require("../../../Plugins/Crm.Order/Content/ts/BaseOrderPdfModalViewModel");

describe("BaseOrderPdfModalViewModel", () => {
	test("updates article thumbnail when initializing", async () => {
		expect.assertions(4);

		// Initialize the view model
		const viewModel = new window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel();
		const mockOrder = {
			CurrencyKey: ko.observable("EUR"),
			Id: ko.observable("test-order-id")
		};
		const mockArticleId = "test-article-id";
		const mockOrderItem = {
			ArticleId: ko.observable(mockArticleId),
			VATLevelKey: ko.observable(null),
			Article: ko.observable({
				VATLevelKey: ko.observable("VAT-20"),
				DocumentAttributes: ko.observableArray([])
			}),
			CurrencyKey: null
		};

		viewModel.order = ko.observable(mockOrder);
		viewModel.items = ko.observableArray([mockOrderItem]);

		// Mock database calls
		const mockDocumentAttributes = [
			{
				UseForThumbnail: true,
				FileResource: { Id: "new-thumb" },
				asKoObservable: function () { return this; }
			}
		];

		window.database = {
			CrmArticle_Article: {
				include2: function () { return this; },
				include: function () { return this; },
				find: () => Promise.resolve({
					DocumentAttributes: mockDocumentAttributes
				})
			}
		};

		// Act
		await viewModel.init();

		// Assert
		const updatedItem = viewModel.items()[0];
		expect(updatedItem.CurrencyKey).toBe(mockOrder.CurrencyKey());
		expect(updatedItem.VATLevelKey()).toBe("VAT-20");
		expect(updatedItem.Article().DocumentAttributes().length).toBe(1);
		expect(updatedItem.Article().DocumentAttributes()[0].FileResource.Id).toBe("new-thumb");
	});
});

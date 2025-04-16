
require("../testbase");
require("../knockout/testbase");
require("../JaydataDbModel");

describe("BaseOrderPdfModalViewModel", () => {
    let viewModel;
    const mockArticleId = "test-article-id";
    const mockOrder = {
        CurrencyKey: ko.observable("EUR"),
        Id: ko.observable("test-order-id")
    };
    const mockOrderItem = {
        ArticleId: ko.observable(mockArticleId),
        VATLevelKey: ko.observable(null),
        Article: ko.observable({
            VATLevelKey: ko.observable("VAT-20"),
            DocumentAttributes: ko.observableArray([])
        }),
        CurrencyKey: null
    };

    beforeEach(async () => {
        // Initialize the view model
        viewModel = new window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel();
        viewModel.order = ko.observable(mockOrder);
        viewModel.items = ko.observableArray([mockOrderItem]);

        // Mock database calls
        const mockDocumentAttributes = [
            { 
                UseForThumbnail: true,
                FileResource: { Id: "new-thumb" },
                asKoObservable: function() { return this; }
            }
        ];

        const mockArticle = {
            DocumentAttributes: mockDocumentAttributes
        };

        // Setup database mock
        window.database = {
            CrmArticle_Article: {
                include2: function() { return this; },
                include: function() { return this; },
                find: jest.fn().mockResolvedValue(mockArticle)
            }
        };
    });

    it("should update article thumbnail when initializing", async () => {
        // Act
        await viewModel.init();

        // Assert
        const updatedItem = viewModel.items()[0];
        expect(updatedItem.CurrencyKey).toBe(mockOrder.CurrencyKey());
        expect(updatedItem.VATLevelKey()).toBe("VAT-20");
        expect(updatedItem.Article().DocumentAttributes().length).toBe(1);
        expect(updatedItem.Article().DocumentAttributes()[0].FileResource.Id).toBe("new-thumb");
    });

    it("should handle missing article gracefully", async () => {
        // Arrange
        window.database.CrmArticle_Article.find = jest.fn().mockResolvedValue(null);

        // Act
        await viewModel.init();

        // Assert
        const updatedItem = viewModel.items()[0];
        expect(updatedItem.Article().DocumentAttributes().length).toBe(0);
    });

    it("should not update VAT if already set", async () => {
        // Arrange
        const existingVAT = "CUSTOM-VAT";
        viewModel.items()[0].VATLevelKey(existingVAT);

        // Act
        await viewModel.init();

        // Assert
        expect(viewModel.items()[0].VATLevelKey()).toBe(existingVAT);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

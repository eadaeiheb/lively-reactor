
require("../testbase");
require("../knockout/testbase");
require("../JaydataDbModel");

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
                asKoObservable: function() { return this; }
            }
        ];

        window.database = {
            CrmArticle_Article: {
                include2: function() { return this; },
                include: function() { return this; },
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

    test("handles missing article gracefully", async () => {
        expect.assertions(1);
        
        const viewModel = new window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel();
        viewModel.order = ko.observable({
            CurrencyKey: ko.observable("EUR"),
            Id: ko.observable("test-order-id")
        });
        viewModel.items = ko.observableArray([{
            ArticleId: ko.observable("non-existent"),
            Article: ko.observable({
                DocumentAttributes: ko.observableArray([])
            })
        }]);

        window.database.CrmArticle_Article.find = () => Promise.resolve(null);

        await viewModel.init();

        expect(viewModel.items()[0].Article().DocumentAttributes().length).toBe(0);
    });

    test("preserves existing VAT value", async () => {
        expect.assertions(1);
        
        const viewModel = new window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel();
        const existingVAT = "CUSTOM-VAT";
        viewModel.order = ko.observable({
            CurrencyKey: ko.observable("EUR"),
            Id: ko.observable("test-order-id")
        });
        viewModel.items = ko.observableArray([{
            ArticleId: ko.observable("test-id"),
            VATLevelKey: ko.observable(existingVAT),
            Article: ko.observable({
                DocumentAttributes: ko.observableArray([])
            })
        }]);

        await viewModel.init();

        expect(viewModel.items()[0].VATLevelKey()).toBe(existingVAT);
    });
});

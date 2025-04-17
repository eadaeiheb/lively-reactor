
require("../testbase");
require("../knockout/testbase");
require("../JaydataDbModel");

describe("BaseOrderPdfModalViewModel", () => {
    test("updates article thumbnail when initializing", async () => {
        expect.assertions(4);

        // Initialize test dependencies and mock namespaces
        window.Main = window.Main || {};
        window.Main.ViewModels = window.Main.ViewModels || {};
        window.Main.ViewModels.ViewModelBase = class ViewModelBase {
            loading = ko.observable(false);
        };
        
        window.Crm = window.Crm || {};
        window.Crm.Order = window.Crm.Order || {};
        window.Crm.Order.ViewModels = window.Crm.Order.ViewModels || {};
        window.Crm.Order.ViewModels.BaseOrderDetailsViewModel = {
            prototype: {
                getCalculatedPriceWithDiscount: function() { return ko.observable(100); },
                getDiscountPercentageValue: function() { return ko.observable(0); },
                getDiscountExactValue: function() { return ko.observable(0); }
            }
        };

        // Load the actual BaseOrderPdfModalViewModel
        require("../../../Plugins/Crm.Order/Content/ts/BaseOrderPdfModalViewModel");

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

        // Mock Helper.User and Helper.Lookup
        window.Helper = window.Helper || {};
        window.Helper.User = window.Helper.User || {};
        window.Helper.User.getCurrentUser = () => Promise.resolve({ GeneralToken: "test-token" });
        window.Helper.Lookup = window.Helper.Lookup || {};
        window.Helper.Lookup.getLocalizedArrayMap = () => Promise.resolve({});
        window.Helper.Lookup.getLocalizedArrayMaps = () => Promise.resolve();

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

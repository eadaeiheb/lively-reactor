export class TopSearchViewModelExtension extends window.Main.ViewModels.TopSearchViewModel {
    constructor() {
        super();

        if (window.AuthorizationManager.isAuthorizedForAction("TopSearch", "Offer")) {
            this.entities.push({
                caption: "Offers",
                searchProperties: ["OrderNo"],
                template: "item-OfferList",
                viewModel: new window.Crm.Order.ViewModels.OfferListIndexViewModel()
            });
        }
        if (window.AuthorizationManager.isAuthorizedForAction("TopSearch", "Order")) {
            this.entities.push({
                caption: "Orders",
                searchProperties: ["OrderNo"],
                template: "item-OrderList",
                viewModel: new window.Crm.Order.ViewModels.OrderListIndexViewModel()
            });
        }
    }
}

window.Main.ViewModels.TopSearchViewModel = TopSearchViewModelExtension;
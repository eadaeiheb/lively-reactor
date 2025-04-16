import {HelperOrder} from "../ts/helper/Helper.Order";
import {
	BaseOrderAccessoryListModalViewModel as BaseOrderAccessoryListModalViewModelType
} from "../ts/BaseOrderAccessoryListModalViewModel";
import {
	BaseOrderAddDeliveryModalViewModel as BaseOrderAddDeliveryModalViewModelType
} from "../ts/BaseOrderAddDeliveryModalViewModel";
import {BaseOrderCreateViewModel as BaseOrderCreateViewModelType} from "../ts/BaseOrderCreateViewModel";
import {
	BaseOrderDetailsCalculationTabViewModel as BaseOrderDetailsCalculationTabViewModelType
} from "../ts/BaseOrderDetailsCalculationTabViewModel";
import {
	BaseOrderDetailsTreeviewTabViewModel as BaseOrderDetailsTreeviewTabViewModelType
} from "../ts/BaseOrderDetailsTreeviewTabViewModel";
import {BaseOrderDetailsViewModel as BaseOrderDetailsViewModelType} from "../ts/BaseOrderDetailsViewModel";
import {BaseOrderPdfModalViewModel as BaseOrderPdfModalViewModelType} from "../ts/BaseOrderPdfModalViewModel";
import {BaseOrderSaveModalViewModel as BaseOrderSaveModalViewModelType} from "../ts/BaseOrderSaveModalViewModel";
import {
	CompanyDetailsOffersTabViewModel as CompanyDetailsOffersTabViewModelType
} from "../ts/CompanyDetailsOffersTabViewModel";
import {
	CompanyDetailsOrdersTabViewModel as CompanyDetailsOrdersTabViewModelType
} from "../ts/CompanyDetailsOrdersTabViewModel";
import {
	OfferAccessoryListModalViewModel as OfferAccessoryListModalViewModelType
} from "../ts/OfferAccessoryListModalViewModel";
import {OfferCopyModalViewModel as OfferCopyModalViewModelType} from "../ts/OfferCopyModalViewModel";
import {
	OfferCreateOrderModalViewModel as OfferCreateOrderModalViewModelType
} from "../ts/OfferCreateOrderModalViewModel";
import {OfferCreateViewModel as OfferCreateViewModelType} from "../ts/OfferCreateViewModel";
import {
	OfferDetailsCalculationTabViewModel as OfferDetailsCalculationTabViewModelType
} from "../ts/OfferDetailsCalculationTabViewModel";
import {
	OfferDetailsTreeviewTabViewModel as OfferDetailsTreeviewTabViewModelType
} from "../ts/OfferDetailsTreeviewTabViewModel";
import {OfferDetailsViewModel as OfferDetailsViewModelType} from "../ts/OfferDetailsViewModel";
import {OfferListIndexViewModel as OfferListIndexViewModelType} from "../ts/OfferListIndexViewModel";
import {OfferLoadModalViewModel as OfferLoadModalViewModelType} from "../ts/OfferLoadModalViewModel";
import {OfferPdfModalViewModel as OfferPdfModalViewModelType} from "../ts/OfferPdfModalViewModel";
import {OfferSaveModalViewModel as OfferSaveModalViewModelType} from "../ts/OfferSaveModalViewModel";
import {
	OrderAccessoryListModalViewModel as OrderAccessoryListModalViewModelType
} from "../ts/OrderAccessoryListModalViewModel";
import {OrderCreateViewModel as OrderCreateViewModelType} from "../ts/OrderCreateViewModel";
import {
	OrderDetailsCalculationTabViewModel as OrderDetailsCalculationTabViewModelType
} from "../ts/OrderDetailsCalculationTabViewModel";
import {
	OrderDetailsTreeviewTabViewModel as OrderDetailsTreeviewTabViewModelType
} from "../ts/OrderDetailsTreeviewTabViewModel";
import {OrderDetailsViewModel as OrderDetailsViewModelType} from "../ts/OrderDetailsViewModel";
import {OrderListIndexViewModel as OrderListIndexViewModelType} from "../ts/OrderListIndexViewModel";
import {OrderLoadModalViewModel as OrderLoadModalViewModelType} from "../ts/OrderLoadModalViewModel";
import {OrderPdfModalViewModel as OrderPdfModalViewModelType} from "../ts/OrderPdfModalViewModel";
import {OrderSaveModalViewModel as OrderSaveModalViewModelType} from "../ts/OrderSaveModalViewModel";
import {BaseOrderRecipientsModalViewModel as BaseOrderRecipientsModalViewModelType} from "../ts/BaseOrderRecipientsModalViewModel";

declare global {
	namespace Crm {
		namespace Order {
			namespace Settings {
				namespace Offer {
					let OfferNoIsCreateable: boolean;
					let OfferNoIsEditable: boolean;
					let OfferNoIsGenerated: boolean;
				}
				let OffersEnableExport: boolean;
				let OffersEnabled: boolean;
				namespace Order {
					let OrderNoIsCreateable: boolean;
					let OrderNoIsEditable: boolean;
					let OrderNoIsGenerated: boolean;
					namespace Report {
						let IncludePrivacyPolicy: boolean;
					}
					namespace Show {
						let PrivacyPolicy: boolean;
					}
				}
				let OrderBarcodeEnabled: boolean;
				let OrderBillingAddressEnabled: boolean;
				let OrderComissionEnabled: boolean;
				let OrderDeliveryAddressEnabled: boolean;
				let OrderItemDiscountEnabled: boolean;
				let OrderPrivateDescriptionEnabled: boolean;
				let OrderSignatureEnabled: boolean;
				let OrdersEnableExport: boolean;
				let PDFFooterMargin: string;
				let PDFFooterTextPush: string;
				let PDFHeaderMargin: string;
				let ValidToDefaultTimespan: string;
			}
			namespace ViewModels {
				let BaseOrderAccessoryListModalViewModel: typeof BaseOrderAccessoryListModalViewModelType;
				let BaseOrderAddDeliveryModalViewModel: typeof BaseOrderAddDeliveryModalViewModelType;
				let BaseOrderCreateViewModel: typeof BaseOrderCreateViewModelType;
				let BaseOrderDetailsCalculationTabViewModel: typeof BaseOrderDetailsCalculationTabViewModelType;
				let BaseOrderDetailsTreeviewTabViewModel: typeof BaseOrderDetailsTreeviewTabViewModelType;
				let BaseOrderDetailsViewModel: typeof BaseOrderDetailsViewModelType;
				let BaseOrderPdfModalViewModel: typeof BaseOrderPdfModalViewModelType;
				let BaseOrderSaveModalViewModel: typeof BaseOrderSaveModalViewModelType;
				let BaseOrderRecipientsModalViewModel: typeof BaseOrderRecipientsModalViewModelType;
				let OfferAccessoryListModalViewModel: typeof OfferAccessoryListModalViewModelType;
				let OfferCopyModalViewModel: typeof OfferCopyModalViewModelType;
				let OfferCreateOrderModalViewModel: typeof OfferCreateOrderModalViewModelType;
				let OfferCreateViewModel: typeof OfferCreateViewModelType;
				let OfferDetailsCalculationTabViewModel: typeof OfferDetailsCalculationTabViewModelType;
				let OfferDetailsTreeviewTabViewModel: typeof OfferDetailsTreeviewTabViewModelType;
				let OfferDetailsViewModel: typeof OfferDetailsViewModelType;
				let OfferListIndexViewModel: typeof OfferListIndexViewModelType;
				let OfferLoadModalViewModel: typeof OfferLoadModalViewModelType;
				let OfferPdfModalViewModel: typeof OfferPdfModalViewModelType;
				let OfferSaveModalViewModel: typeof OfferSaveModalViewModelType;
				let OrderAccessoryListModalViewModel: typeof OrderAccessoryListModalViewModelType;
				let OrderCreateViewModel: typeof OrderCreateViewModelType;
				let OrderDetailsCalculationTabViewModel: typeof OrderDetailsCalculationTabViewModelType;
				let OrderDetailsTreeviewTabViewModel: typeof OrderDetailsTreeviewTabViewModelType;
				let OrderDetailsViewModel: typeof OrderDetailsViewModelType;
				let OrderListIndexViewModel: typeof OrderListIndexViewModelType;
				let OrderLoadModalViewModel: typeof OrderLoadModalViewModelType;
				let OrderPdfModalViewModel: typeof OrderPdfModalViewModelType;
				let OrderSaveModalViewModel: typeof OrderSaveModalViewModelType;
			}
		}
		namespace ViewModels {
			let CompanyDetailsOffersTabViewModel: typeof CompanyDetailsOffersTabViewModelType;
			let CompanyDetailsOrdersTabViewModel: typeof CompanyDetailsOrdersTabViewModelType;
		}
	}
	namespace Helper {
		let Order: typeof HelperOrder;
	}
}
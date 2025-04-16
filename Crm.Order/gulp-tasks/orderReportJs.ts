import "../../Main/Content/ts/ClientInfo";
import "../../Main/Content/ts/knockout.custom";
import "../../Main/Content/ts/knockout.custom.userDisplayName";
import "../../Crm/Content/ts/knockout.custom.fileResource";
import "../Content/ts/helper/Helper.Order";
import "../Content/ts/BaseOrderDetailsViewModel";
import "../Content/ts/BaseOrderPdfModalViewModel";
import "../Content/ts/OrderPdfModalViewModel";
import "../Content/ts/OfferPdfModalViewModel";
import {HelperOrder} from "@Crm.Order/helper/Helper.Order";

window.Helper.Order ||= HelperOrder;
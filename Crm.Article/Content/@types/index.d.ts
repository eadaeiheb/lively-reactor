import { ArticleCompanyRelationshipEditModalViewModel as ArticleCompanyRelationshipEditModalViewModelType } from "../ts/ArticleCompanyRelationshipEditModalViewModel";
import { ArticleDetailsViewModel as ArticleDetailsViewModelType } from "../ts/ArticleDetailsViewModel";
import { ArticleDetailsRelationshipsTabViewModel as ArticleDetailsRelationshipsTabViewModelType } from "../ts/ArticleDetailsRelationshipsTabViewModel";
import { ArticleDetailsDocumentsTabViewModel as ArticleDetailsDocumentsTabViewModelType } from "../ts/ArticleDetailsDocumentsTabViewModel";
import { ArticleRelationshipEditModalViewModel as ArticleRelationshipEditModalViewModelType } from "../ts/ArticleRelationshipEditModalViewModel";
import { ProductFamilyCreateViewModel as ProductFamilyCreateViewModelType } from "../ts/ProductFamilyCreateViewModel";
import { ProductFamilyDetailsViewModel as ProductFamilyDetailsViewModelType } from "../ts/ProductFamilyDetailsViewModel";
import { ArticleDetailsStockTabViewModel as ArticleDetailsStockTabViewModelType } from "../ts/ArticleDetailsStockTabViewModel";
import { StoreDetailsViewModel as StoreDetailsViewModelType } from "../ts/StoreDetailsViewModel";
import {HelperProductFamily} from "../ts/helper/Helper.ProductFamiliy";
import {HelperArticle} from "../ts/helper/Helper.Article";
import {HelperQuantityUnit} from "../ts/helper/Helper.QuantityUnit";
import {ArticleCompanyRelationshipListViewModel as ArticleCompanyRelationshipListViewModelType} from "../ts/ArticleCompanyRelationshipListViewModel";
import {ArticleCreateViewModel as ArticleCreateViewModelType} from "../ts/ArticleCreateViewModel";
import {ArticleListIndexViewModel as ArticleListIndexViewModelType} from "../ts/ArticleListIndexViewModel";
import {ArticleRelationshipListViewModel as ArticleRelationshipListViewModelType} from "../ts/ArticleRelationshipListViewModel";
import {ProductFamilyListIndexViewModel as ProductFamilyListIndexViewModelType} from "../ts/ProductFamilyListIndexViewModel";
import {PriceSelectorViewModel as PriceSelectorViewModelType} from "../ts/PriceSelectorViewModel";
import {StorageAreaEditModalViewModel  as StorageAreaEditModalViewModelType } from "../ts/StorageAreaEditModalViewModel";
import {StoreDetailsStorageAreasTabViewModel  as StoreDetailsStorageAreasTabViewModelType } from "../ts/StoreDetailsStorageAreasTabViewModel";
import {HelperStore} from "../ts/helper/Helper.Store";
import {HelperSerial} from "@Crm.Article/helper/Helper.Serial";

declare global {
	namespace Helper {
		let Article: typeof HelperArticle;
		let ProductFamily: typeof HelperProductFamily;
		let QuantityUnit: typeof HelperQuantityUnit;
		let Store: typeof HelperStore;
		let Serial: typeof HelperSerial;
	}
	namespace Crm {
		namespace Article {
			namespace ViewModels {
				let ArticleCompanyRelationshipEditModalViewModel: typeof ArticleCompanyRelationshipEditModalViewModelType;
				let ArticleCompanyRelationshipListViewModel: typeof ArticleCompanyRelationshipListViewModelType;
				let ArticleCreateViewModel: typeof ArticleCreateViewModelType;
				let ArticleDetailsDocumentsTabViewModel: typeof ArticleDetailsDocumentsTabViewModelType;
				let ArticleDetailsRelationshipsTabViewModel: typeof ArticleDetailsRelationshipsTabViewModelType;
				let ArticleDetailsStockTabViewModel: typeof ArticleDetailsStockTabViewModelType;
				let ArticleDetailsViewModel: typeof ArticleDetailsViewModelType;
				let ArticleListIndexViewModel: typeof ArticleListIndexViewModelType;
				let ArticleRelationshipEditModalViewModel: typeof ArticleRelationshipEditModalViewModelType;
				let ArticleRelationshipListViewModel: typeof ArticleRelationshipListViewModelType;
				let ProductFamilyCreateViewModel: typeof ProductFamilyCreateViewModelType;
				let ProductFamilyDetailsViewModel: typeof ProductFamilyDetailsViewModelType;
				let ProductFamilyListIndexViewModel: typeof ProductFamilyListIndexViewModelType;
				let PriceSelectorViewModel: typeof PriceSelectorViewModelType;
				let StoreDetailsViewModel: typeof StoreDetailsViewModelType;
				let StorageAreaEditModalViewModel: typeof StorageAreaEditModalViewModelType;
				let StoreDetailsStorageAreasTabViewModel: typeof StoreDetailsStorageAreasTabViewModelType;
			}
		}
	}
}

import {namespace} from "@Main/namespace";
import type {ArticleDetailsViewModel} from "./ArticleDetailsViewModel";

export class ArticleDetailsDocumentsTabViewModel extends window.Crm.ViewModels.ContactDetailsDocumentsTabViewModel {
	constructor(parentViewModel: ArticleDetailsViewModel) {
		super(parentViewModel);
		this.contactId(parentViewModel.article().Id());
		this.items.subscribe((items) => parentViewModel.refreshThumbnailDocumentAttribute(items));
	}
}

namespace("Crm.Article.ViewModels").ArticleDetailsDocumentsTabViewModel = ArticleDetailsDocumentsTabViewModel;

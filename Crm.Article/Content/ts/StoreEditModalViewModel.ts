import { namespace } from "@Main/namespace";

export class StoreEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	store = ko.observable<Crm.Article.Rest.Model.ObservableCrmArticle_Store>(null);
	isNew = ko.observable<boolean>(true);
	errors = ko.validation.group(this.store, { deep: true });

	constructor() {
		super();
	}

	async init(id?: string, params?: {[key:string]:string}): Promise<void> {
		await super.init(id, params);
		let targetStore;
		if (id) {
			targetStore = await window.database.CrmArticle_Store.find(id);
			window.database.attachOrGet(targetStore);
			this.isNew(false);
		} else {
			targetStore = window.database.CrmArticle_Store.defaultType.create();
			window.database.add(targetStore);
		}
		this.store(targetStore.asKoObservable());
	}

	cancel(): void {
		window.database.detach(this.store().innerInstance);
		$(".modal:visible").modal("hide");
	}

	async save(): Promise<void> {
		try {
			this.loading(true);
			if (this.errors().length > 0) {
				this.loading(false);
				this.errors.showAllMessages();
				this.errors.scrollToError();
				return;
			}
			await window.database.saveChanges();
			if (this.isNew) {
				window.location.hash = "/Crm.Article/Store/DetailsTemplate/" + this.store().Id();
			} else {
				$(".modal:visible").modal("hide");
				this.loading(false);
			}
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}

}
namespace("Crm.Article.ViewModels").StoreEditModalViewModel = StoreEditModalViewModel;


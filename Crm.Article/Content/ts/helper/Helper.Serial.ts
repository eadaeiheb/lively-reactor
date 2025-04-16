
export class HelperSerial {
	static getAutocompleteOptionsShorthand(viewModel, withoutKey: boolean, articleIdObservable: KnockoutObservable<string>, storeIdObservable: KnockoutObservable<string>, storageAreaIdObservable: KnockoutObservable<string>, locationIdObservable: KnockoutObservable<string>): Select2AutoCompleterOptions {
		const options: Select2AutoCompleterOptions = {
			table: "CrmArticle_Serial",
			orderBy: ["SerialNo"],
			joins: ["Store", "StorageArea", "Location"],
			mapDisplayObject: function (serial) {
				return {
					id: serial.Id,
					text: ko.unwrap(serial.SerialNo),
					item: serial.asKoObservable()
				};
			}
		};
		if (withoutKey !== true) {
			options.key = "Id";
		}
		if (viewModel) {
			if (viewModel.onSerialSelect) {
				options.onSelect = viewModel.onSerialSelect.bind(viewModel);
			}
		}
		const baseFilter = options.customFilter;
		options.customFilter = function (query, filter) {
			let articleKey = window.ko.unwrap(articleIdObservable);
			let storeKey = window.ko.unwrap(storeIdObservable);
			let storageAreaKey = window.ko.unwrap(storageAreaIdObservable);
			let locationKey = window.ko.unwrap(locationIdObservable);
			query = query.filter(function (serial) {return serial.IsAvailable === true});
			if(baseFilter)
				query = baseFilter(query, filter)
			if (articleKey)
				query = query.filter(function (serial) {return serial.ArticleKey === this.articleKey}, {articleKey: articleKey });

			if (storeKey) {
				query = query.filter(function (serial) {return serial.StoreKey === this.storeKey}, { storeKey: storeKey });
				if(storageAreaKey)
					query = query.filter(function (serial) {return serial.StorageAreaKey === this.storageAreaKey}, { storageAreaKey: storageAreaKey });
				if(locationKey)
					query = query.filter(function (serial) {return serial.LocationKey === this.locationKey}, { locationKey: locationKey });
			}
			return query
		}
		return options;
	}
}
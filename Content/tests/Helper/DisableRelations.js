(function () {
	//stop OfflineModel.js registering any relations
	const registerTable = window.Helper.Database.registerTable;
	window.Helper.Database.registerTable = function (storageKey, columns, indices) {
		const hasKeyProperty = Object.getOwnPropertyNames(columns).some(function (column) {
			return columns[column].key === true;
		});
		if (hasKeyProperty) {
			registerTable.apply(null, arguments);
		}
	};
})();

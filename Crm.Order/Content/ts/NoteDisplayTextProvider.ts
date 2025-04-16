window.Crm.ViewModels.NoteViewModel.registerDisplayTextProvider("BaseOrderCreatedNote", function (note) {
	var text = window.Helper.String.getTranslatedString(note.Text);
	return Promise.resolve(text);
});
window.Crm.ViewModels.NoteViewModel.registerDisplayTextProvider("BaseOrderStatusChangedNote", function (note) {
	var key = note.Text;
	if (!key) {
		var set = window.Helper.String.getTranslatedString(note.Meta + "StatusSet");
		return Promise.resolve(set);
	}
	if (key === "Closed") {
		var closed = window.Helper.String.getTranslatedString(note.Meta + "Closed");
		return Promise.resolve(closed);
	}
	return window.Helper.Lookup.getLocalizedArrayMap("CrmOrder_OrderStatus").then(function (map) {
		if (map && map[key]) {
			return window.Helper.String.getTranslatedString(note.Meta + "StatusSetTo").replace("{0}", map[key].Value);
		}
		return key;
	});
});
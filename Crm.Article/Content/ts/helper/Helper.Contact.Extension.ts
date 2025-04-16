;
(function () {
	const getLink = window.Helper.Contact.getLink;
	window.Helper.Contact.getLink = function (contactId, contactType) {
		if (contactType === "Article" && window.AuthorizationManager.isAuthorizedForAction("Article", "Read")) {
			return "#/Crm.Article/Article/DetailsTemplate/" + contactId;
		}
		return getLink.call(this, contactId, contactType);
	};
})();
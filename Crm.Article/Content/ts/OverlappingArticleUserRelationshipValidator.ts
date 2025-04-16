export class OverlappingArticleUserRelationshipValidator {

	static getValidationFunction(articleUserRelationship) {
		return function (val, params, callback) {
			articleUserRelationship = window.ko.unwrap(articleUserRelationship);
			OverlappingArticleUserRelationshipValidator.getOverlappingArticleUserRelationship(articleUserRelationship.Id(),
				articleUserRelationship.ArticleKey(),
				articleUserRelationship.From(),
				articleUserRelationship.To(),
				function (overlappingArticleUserRelationship) {
					if (!overlappingArticleUserRelationship) {
						callback(true);
					} else {
						var message = window.Helper.String.getTranslatedString("OverlappingByArticleUserRelationship")
							.replace("{0}", overlappingArticleUserRelationship.Article.ArticleTypeKey)
							.replace("{1}", window.Globalize.formatDate(overlappingArticleUserRelationship.From, { date: "short" }))
							.replace("{2}", window.Globalize.formatDate(overlappingArticleUserRelationship.To, { date: "short" }))
							.replace("{3}", overlappingArticleUserRelationship.UserKey);
						callback({ isValid: false, message: message });
					}
				});
		}
	}

	static getOverlappingArticleUserRelationship(id: string, articleKey: string, from, to, callback) {
		if (!articleKey || !from || !to || from > to || !window.database.CrmArticle_ArticleUserRelationship) {
			callback(null);
			return;
		}
		window.database.CrmArticle_ArticleUserRelationship
			.include("Article")
			.first(function (articleUserRelationship) {
				return articleUserRelationship.ArticleKey === this.articleKey &&
					articleUserRelationship.From < this.to &&
					articleUserRelationship.To > this.from &&
					articleUserRelationship.Id !== this.id;
			},
				{ id: id, articleKey: articleKey, from: from, to: to })
			.then(function (result) {
				callback(result);
			}).catch(function () {
				callback(null);
			});
	}

}

window.ko.validationRules.add("CrmArticle_Article",
	function (entity: Crm.Article.Rest.Model.ObservableCrmArticle_Article) {
		entity.ArticleTypeKey.extend({
			required: {
				params: true,
				message: window.Helper.String
					.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("ArticleType"))
			}
		});
		entity.ItemNo.extend({
			validation: {
				async: true,
				validator: async (itemNo, params, callback) => {
					if (!itemNo) {
						callback(true);
						return;
					}
					const articles = await window.database.CrmArticle_Article
						.filter(function (article) {
							return article.ItemNo === this.itemNo;
						}, {itemNo: itemNo})
						.toArray();
					callback(articles.length === 0 || articles[0].Id === entity.Id());
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Unique").replace("{0}", window.Helper.String.getTranslatedString("ItemNo"))
			}
		});
		entity.QuantityUnitKey.extend({
			required: {
				params: true,
				message: window.Helper.String
					.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("QuantityUnit")),
				onlyIf: function () {
					return entity.ArticleTypeKey() === "Material" || entity.ArticleTypeKey() === "Cost";
				},
			}
		});
		entity.BarCode.extend({
			maxLength: {
				params: 50,
				message: window.Helper.String
					.getTranslatedString("RuleViolation.MaxLength")
					.replace("{0}", window.Helper.String.getTranslatedString("Value")),
			}
		});
		entity.ValidTo.extend({
			validation: {
				validator: function (val) {
					if (val && ko.unwrap(entity.ValidFrom)) {
						return val > ko.unwrap(entity.ValidFrom)
					}
					return true;
				},
				message: window.Helper.String
					.getTranslatedString("RuleViolation.Greater")
					.replace("{0}", window.Helper.String.getTranslatedString("ValidTo"))
					.replace("{1}", window.Helper.String.getTranslatedString("ValidFrom"))
			}
		});
		entity.LicensePlate.extend({
			unique: {
				params: [window.database.CrmArticle_Article, 'LicensePlate', entity.Id],
				message: window.Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", window.Helper.String.getTranslatedString("LicensePlate"))
			}
		});
	});
window.ko.validationRules.add("CrmArticle_ArticleUserRelationship",
	function (entity: Crm.Article.Rest.Model.ObservableCrmArticle_ArticleUserRelationship) {
		entity.To.extend({
			validation: {
				async: true,
				validator: window.Helper.Article.OverlappingArticleUserRelationshipValidator.getValidationFunction(entity)
			}
		});
	});
	
window.ko.validationRules.add("CrmArticle_Store",
	function (entity: Crm.Article.Rest.Model.ObservableCrmArticle_Store) {
		entity.StoreNo.extend({
			unique: {
				params: [window.database.CrmArticle_Store, 'StoreNo', entity.Id],
				onlyIf: function () {
					return entity.innerInstance.entityState === $data.EntityState.Added;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", window.Helper.String.getTranslatedString("StoreNo"))
			},
		});
	});
window.ko.validationRules.add("CrmArticle_Location",
	function (entity: Crm.Article.Rest.Model.ObservableCrmArticle_Location) {
		entity.LocationNo.extend({
			unique: {
				params: [window.database.CrmArticle_Location, 'LocationNo', entity.Id],
				onlyIf: function () {
					return entity.innerInstance.entityState === $data.EntityState.Added;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", window.Helper.String.getTranslatedString("LocationNo"))
			},
		});
	});
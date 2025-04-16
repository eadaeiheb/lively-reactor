window.Helper.Database.addIndex("CrmArticle_Article", ["ArticleTypeKey", "ItemNo", "Description"]);
window.Helper.Database.addIndex("CrmArticle_ArticleCompanyRelationship", ["ChildId"]);

window.Helper.Database.setTransactionId("CrmArticle_ProductFamily",
	async function (productFamily: Crm.Article.Rest.Model.CrmArticle_ProductFamily) {
		return [productFamily.Id, productFamily.ParentId];
	});

window.Helper.Database.setTransactionId("CrmArticle_ArticleCompanyRelationship",
	async function (relationship: Crm.Article.Rest.Model.CrmArticle_ArticleCompanyRelationship) {
		return [relationship.ParentId, relationship.ChildId];
	});

window.Helper.Database.registerTable("CrmArticle_ArticleUserRelationship", 
	async function(articleUserRelationship: Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship) {
		return [articleUserRelationship.ArticleKey, articleUserRelationship.UserKey];
});
window.Helper.Database.setTransactionId("CrmArticle_ArticleDowntime",
	async function (articleDowntime: Crm.Article.Rest.Model.CrmArticle_ArticleDowntime) {
		return articleDowntime.ArticleKey;
	});
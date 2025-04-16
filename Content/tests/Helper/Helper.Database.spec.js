require("../testbase");
require("../JaydataDbModel");

describe("Helper.Database", () => {
	test("createClone", async () => {
		expect.assertions(2);
		$.connection = $.connection || {};
		await window.Helper.Database.initialize();
		const initData = {
			Id: $data.Guid.NewGuid(),
			ItemNo: "abc",
			Price: 2
		};
		const article = new window.database.CrmArticle_Article.CrmArticle_Article();
		window.Helper.Database.transferData(Object.keys(initData), initData, article);
		const clone = window.Helper.Database.createClone(article.asKoObservable());
		let key;
		let v1;
		let v2;
		const compare = function (k) {
			key = k;
			v1 = article[key];
			v2 = clone[key];
			if (key === "ExtensionValues" || v1 instanceof $data.Entity || v1 instanceof Array) {
				return true;
			}
			return v1 === v2;
		};
		const isClonedCorrectly = Object.keys(article.initData).every(compare);
		expect(isClonedCorrectly).toBe(true);
		const isClonedCorrectlyEx = Object.keys(article.initData.ExtensionValues.initData).every(compare);
		expect(isClonedCorrectlyEx).toBe(true);
	});
});

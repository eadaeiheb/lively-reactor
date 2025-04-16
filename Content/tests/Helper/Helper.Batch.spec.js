window.jQuery = window.$ = require("jquery");
const {HelperBatch} = require("../../../Plugins/Main/Content/ts/helper/Helper.Batch");

describe("Helper.Batch", () => {
	test("returns $.Deferred.promise", () => {
		expect.assertions(1);
		const result = HelperBatch.Execute([]);
		const keys = Object.keys($.Deferred().promise());
		const handler = jest.fn();
		keys.forEach(() => handler());
		result.then(() => expect(handler).toBeCalledTimes(8));
	});
	test("simpleBatch", async () => {
		expect.assertions(1);
		const handler = jest.fn();
		window.database = {
			batchExecuteQuery: function (queries) {
				return new $.Deferred().resolve(queries.map(() => [])).promise();
			}
		};
		await HelperBatch.Execute([{
			handler: function () {
				handler();
			}
		}, {}, {}, {}]).then(() => handler());
		expect(handler).toBeCalledTimes(2);
	});
	test("batchingBatch", async () => {
		expect.assertions(1);
		let counter = 0;
		const handler = jest.fn();
		window.database = {
			batchExecuteQuery: queries => {
				const deferred = $.Deferred();
				setTimeout(() => void deferred.resolve(queries.map(x => x.content)),
					counter === 0 ? 100 : counter === 1 ? 500 : 100);
				//make sure 2nd batch finishes after last to test if results are correctly matched to handlers
				counter++;
				return deferred.promise();
			}
		};

		const getArray = (count, content) => Array(count).fill({content, handler: () => handler()});
		const queries = getArray(100, 1);
		queries.push(...getArray(100, 2));
		queries.push(...getArray(33, 3));
		await HelperBatch.Execute(queries);
		expect(handler).toBeCalledTimes(233);
	});

});


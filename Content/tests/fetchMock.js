const fetchMockData = new Map();

const addFetchMockData = (url, response) => {
	fetchMockData.set(url, response);
};

global.fetch = jest.fn((url, options) => {
	if (fetchMockData.has(url)) {
		return Promise.resolve({
			json: () => Promise.resolve(fetchMockData.get(url))
		});
	} else {
		throw Error("Missing fetch mock for " + url);
	}
});

exports.addFetchMockData = addFetchMockData;
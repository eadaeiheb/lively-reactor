require("../../Plugins/Main/Content/js/jaydata/jaydataproviders/InMemoryProvider");
const {readFileSync} = require("fs");
const XHRMock = require("./xhr-mock-2.4.1");
(function() {
	let metadata = readFileSync("./Content/tests/metadata.xml");
	const mock = XHRMock.setup();
	mock.get("/api/$metadata", {
		status: 200,
		headers: {
			"Content-Type": "application/xml",
			"OData-Version": "4.0"
		},
		body: metadata
	});
	
	window.Helper.Database.registerConverter = function() { };
	window.Helper.Database.addIndex = function() { };
})();

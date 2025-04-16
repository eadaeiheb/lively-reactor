require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");

describe("JayData oData in operator empty array", () => {

	test("in with empty array must work",  async () => {
		expect.assertions(1);
		const mock = XHRMock.setup();
		mock.get("/api/$metadata", {
			status: 200,
			headers: {
				"Content-Type": "application/xml",
				"OData-Version": "4.0"
			},
			body: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
				+ "<edmx:Edmx Version=\"4.0\" xmlns:edmx=\"http://docs.oasis-open.org/odata/ns/edmx\">"
				+ "	<edmx:DataServices>"
				+ "		<Schema Namespace=\"Lmobile\" xmlns=\"http://docs.oasis-open.org/odata/ns/edm\">"
				+ "			<EntityType Name=\"EntityA\">"
				+ "				<Key>"
				+ "					<PropertyRef Name=\"Id\"/>"
				+ "				</Key>"
				+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\"/>"
				+ "				<Property Name=\"Text\" Type=\"Edm.String\"/>"
				+ "			</EntityType>"
				+ "		</Schema>"
				+ "		<Schema Namespace=\"Default\" xmlns=\"http://docs.oasis-open.org/odata/ns/edm\">"
				+ "			<EntityContainer>"
				+ "				<EntitySet Name=\"SetA\" EntityType=\"Lmobile.EntityA\"></EntitySet>"
				+ "			</EntityContainer>"
				+ "		</Schema>"
				+ "	</edmx:DataServices>"
				+ "</edmx:Edmx>"
		});
		mock.get("/api/SetA?%24filter=(false)", (request, response) => {
			expect(true).toBe(true);
			return response.status(200).headers({
				"Content-Type": "application/json; odata.metadata=minimal",
				"OData-Version": "4.0"
			}).body({
				"@odata.context": "http://localhost/api/$metadata#SetA",
				"value": []
			});
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => x.Text in []).toArray();
		mock.teardown();
	});
});

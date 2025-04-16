require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");
describe("JayData oData default value annotation", () => {
	test("default value must be set when creating the entity", async () => {
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
				+ "				<Property Name=\"Text\" Type=\"Edm.String\">"
				+ "					<Annotation Term=\"Lmobile.DefaultValue\" String=\"123\"/>"
				+ "				</Property>"
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
		await $data.initService("/api");
		const entity = new Lmobile.EntityA();
		expect(entity.Text).toEqual("123");
		mock.teardown();
	});
});

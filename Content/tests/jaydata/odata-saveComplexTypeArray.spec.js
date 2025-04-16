require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");

describe("JayData oData save complex type array", () => {
	test("arrays of complex types must be serialized correctly when saving", async () => {
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
				+ "				<Property Name=\"Id\" Type=\"Edm.Guid\" Nullable=\"false\"/>"
				+ "				<Property Name=\"Bs\" Type=\"Collection(Lmobile.ComplexB)\"/>"
				+ "			</EntityType>"
				+ "			<ComplexType Name=\"ComplexB\">"
				+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\"/>"
				+ "			</ComplexType>"
				+ "		</Schema>"
				+ "		<Schema Namespace=\"Default\" xmlns=\"http://docs.oasis-open.org/odata/ns/edm\">"
				+ "			<EntityContainer>"
				+ "				<EntitySet Name=\"SetA\" EntityType=\"Lmobile.EntityA\"></EntitySet>"
				+ "			</EntityContainer>"
				+ "		</Schema>"
				+ "	</edmx:DataServices>"
				+ "</edmx:Edmx>"
		});
		mock.post("/api/SetA", (request, response) => {
			const data = JSON.parse(request.body());
			if (data.Bs && data.Bs.length === 3) {
				return response
					.status(200)
					.headers({
						"Content-Type": "application/json; odata.metadata=minimal",
						"OData-Version": "4.0"
					}).body({
						"@odata.context": "http://localhost/api/$metadata#SetA",
						"value": [data]
					});
			}
			return response.status(400).reason("expecting complete entity to be sent");
		});
		const db = await $data.initService("/api");
		const entity = new Lmobile.EntityA({
			Id: $data.Guid.NewGuid().value,
			Bs: [new Lmobile.ComplexB(), new Lmobile.ComplexB(), new Lmobile.ComplexB()]
		});
		db.add(entity);
		await db.saveChanges();
		expect(true).toBe(true);
		mock.teardown();
	});
});

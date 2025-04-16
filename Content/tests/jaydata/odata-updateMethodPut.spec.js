require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");

describe("JayData oData PUT", () => {
	test("PUT must be support, including the complete entity", async () => {
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
				+ "				<Property Name=\"Text1\" Type=\"Edm.String\"/>"
				+ "				<Property Name=\"Text2\" Type=\"Edm.String\"/>"
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
		mock.get("/api/SetA", {
			status: 200,
			headers: {
				"Content-Type": "application/json; odata.metadata=minimal",
				"OData-Version": "4.0"
			},
			body: {
				"@odata.context": "http://localhost/api/$metadata#SetA",
				"value": [{
					"Id": "1",
					"Text1": "hello",
					"Text2": "business"
				}, {
					"Id": "2",
					"Text1": "hello",
					"Text2": "business"
				}]
			}
		});
		mock.put("/api/SetA(1)", (request, response) => response.status(400).reason("expecting no request when there where no changes"));
		mock.put("/api/SetA(2)", (request, response) => {
			const data = JSON.parse(request.body());
			if (data.Text2) {
				return response.status(200)
					.headers({
						"Content-Type": "application/json; odata.metadata=minimal",
						"OData-Version": "4.0"
					}).body({
						"@odata.context": "http://localhost/api/$metadata#SetA",
						"value": [data]
					});
			}
			return response.status(400).reason("expecting complete entity to be sent for PUT");
		});
		const db = await $data.initService("/api");
		db.storageProvider.providerConfiguration.UpdateMethod = "PUT";
		db.storageProvider.providerConfiguration.sendAllPropertiesOnChange = true;
		const x = await db.SetA.toArray();
		db.attach(x[0]);
		await db.saveChanges();
		db.attach(x[1]);
		x[1].Text1 = "olleh";
		await db.saveChanges();
		expect(true).toBe(true);
		mock.teardown();
	});
});

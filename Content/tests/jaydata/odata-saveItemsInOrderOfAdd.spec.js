require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");

describe("JayData oData saving order", () => {
	test("save order", async () => {
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
				+ "				<NavigationProperty Name=\"Bs\" Type=\"Collection(Lmobile.EntityB)\"/>"
				+ "			</EntityType>"
				+ "			<EntityType Name=\"EntityB\">"
				+ "				<Key>"
				+ "					<PropertyRef Name=\"Id\"/>"
				+ "				</Key>"
				+ "				<Property Name=\"Id\" Type=\"Edm.Guid\" Nullable=\"false\"/>"
				+ "			</EntityType>"
				+ "		</Schema>"
				+ "		<Schema Namespace=\"Default\" xmlns=\"http://docs.oasis-open.org/odata/ns/edm\">"
				+ "			<EntityContainer>"
				+ "				<EntitySet Name=\"SetA\" EntityType=\"Lmobile.EntityA\"></EntitySet>"
				+ "				<EntitySet Name=\"SetB\" EntityType=\"Lmobile.EntityB\"></EntitySet>"
				+ "			</EntityContainer>"
				+ "		</Schema>"
				+ "	</edmx:DataServices>"
				+ "</edmx:Edmx>"
		});
		mock.post("/api/$batch", (request, response) => {
			const body = request.body();
			expect(body.indexOf("/api/SetA") < body.indexOf("/api/SetB")).toBe(true);
			return response.status(200).headers({
				"Content-Type": "application/xml",
				"OData-Version": "4.0"
			}).body({});
		});
		const mockPrepare = $data.storageProviders.oData.oDataProvider.prototype.prepareRequest;
		$data.storageProviders.oData.oDataProvider.prototype.prepareRequest = function (data) {
			data[1] = function () {
			}; //replace the default handler which will fail as we dont' respond with a well formed $batch response
			mockPrepare.apply(this, arguments);
		};
		const db = await $data.initService("/api");
		const a = Lmobile.EntityA.create({Id: $data.Guid.NewGuid().value});
		const b = Lmobile.EntityB.create({Id: $data.Guid.NewGuid().value});
		a.Bs = [b];
		db.add(a);
		db.add(b);
		try {
			db.saveChanges();
		} catch (e) {
		}
		mock.teardown();
	});
});

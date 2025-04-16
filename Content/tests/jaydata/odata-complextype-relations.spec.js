require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");
function setup() {
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
			+ "			<EntityType Name=\"Country\">"
			+ "				<Key>"
			+ "					<PropertyRef Name=\"Id\"/>"
			+ "				</Key>"
			+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\" />"
			+ "				<Property Name=\"Name\" Type=\"Edm.String\" />"
			+ "			</EntityType>"
			+ "			<ComplexType Name=\"Location\">"
			+ "				<Property Name=\"City\" Type=\"Edm.String\" Nullable=\"false\"/>"
			+ "				<Property Name=\"CountryId\" Type=\"Edm.Int32\" Nullable=\"false\"/>"
			+ "				<NavigationProperty Name=\"Country\" Type=\"Lmobile.Country\">"
			+ "					<ReferentialConstraint Property=\"CountryId\" ReferencedProperty=\"Id\"/>"
			+ "				</NavigationProperty>"
			+ "			</ComplexType>"
			+ "			<EntityType Name=\"Todo\">"
			+ "				<Key>"
			+ "					<PropertyRef Name=\"Id\"/>"
			+ "				</Key>"
			+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\" />"
			+ "				<Property Name=\"Task\" Type=\"Edm.String\" />"
			+ "				<Property Name=\"Location\" Type=\"Lmobile.Location\"/>"
			+ "			</EntityType>"
			+ "		</Schema>"
			+ "		<Schema Namespace=\"Default\" xmlns=\"http://docs.oasis-open.org/odata/ns/edm\">"
			+ "			<EntityContainer>"
			+ "				<EntitySet Name=\"TodoSet\" EntityType=\"Lmobile.Todo\"></EntitySet>"
			+ "			</EntityContainer>"
			+ "		</Schema>"
			+ "	</edmx:DataServices>"
			+ "</edmx:Edmx>"
	});
	mock.get(/\/api\/TodoSet.*/, function(request, response) {
		const url = decodeURIComponent(request.url().toString());
		if (url.indexOf("Location/Country/Name") !== -1) {
			return response.status(200).headers({
				"Content-Type": "application/json; odata.metadata=minimal",
				"OData-Version": "4.0"
			}).body({
				"@odata.context": "http://localhost/api/$metadata#TodoSet",
				"value": []
			});
		} else {
			return response.status(400).reason("wrong path: " + request.url().query.$filter);
		}
	});
	return mock;
}

describe("JayData oData complex types with relations", () => {

	test("filter complex types containing relations", async () => {
		expect.assertions(1);
		const mock = setup();
		const db = await $data.initService("/api");
		await db.TodoSet.filter("it.Location.Country.Name.contains('1')").toArray();
		expect(true).toBe(true);
		mock.teardown();
	});

	test("order by complex types containing relations", async () => {
		expect.assertions(1);
		const mock = setup();
		const db = await $data.initService("/api");
		await db.TodoSet.orderBy("it.Location.Country.Name").toArray();
		expect(true).toBe(true);
		mock.teardown();
	});
});

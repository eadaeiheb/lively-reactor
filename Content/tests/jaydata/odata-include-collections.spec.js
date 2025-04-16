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
			+ "			<EntityType Name=\"Person\">"
			+ "				<Key>"
			+ "					<PropertyRef Name=\"Id\"/>"
			+ "				</Key>"
			+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\" />"
			+ "				<Property Name=\"Name\" Type=\"Edm.String\" />"
			+ "				<Property Name=\"Emails\" Type=\"Collection(Lmobile.Email)\"/>"
			+ "			</EntityType>"
			+ "			<EntityType Name=\"Todo\">"
			+ "				<Key>"
			+ "					<PropertyRef Name=\"Id\"/>"
			+ "				</Key>"
			+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\" />"
			+ "				<Property Name=\"Completed\" Type=\"Edm.Boolean\" />"
			+ "				<Property Name=\"Task\" Type=\"Edm.String\" />"
			+ "				<Property Name=\"PersonId\" Type=\"Edm.Int32\"/>"
			+ "				<NavigationProperty Name=\"Person\" Type=\"Lmobile.Person\">"
			+ "					<ReferentialConstraint Property=\"PersonId\" ReferencedProperty=\"Id\"/>"
			+ "				</NavigationProperty>"
			+ "			</EntityType>"
			+ "			<EntityType Name=\"Email\">"
			+ "				<Key>"
			+ "					<PropertyRef Name=\"Id\"/>"
			+ "				</Key>"
			+ "				<Property Name=\"Id\" Type=\"Edm.Int32\" Nullable=\"false\" />"
			+ "				<Property Name=\"Data\" Type=\"Edm.String\" />"
			+ "				<Property Name=\"PersonId\" Type=\"Edm.Int32\"/>"
			+ "				<NavigationProperty Name=\"Person\" Type=\"Lmobile.Person\">"
			+ "					<ReferentialConstraint Property=\"PersonId\" ReferencedProperty=\"Id\"/>"
			+ "				</NavigationProperty>"
			+ "			</EntityType>"
			+ "		</Schema>"
			+ "		<Schema Namespace=\"Default\" xmlns=\"http://docs.oasis-open.org/odata/ns/edm\">"
			+ "			<EntityContainer>"
			+ "				<EntitySet Name=\"Todos\" EntityType=\"Lmobile.Todo\"></EntitySet>"
			+ "				<EntitySet Name=\"Emails\" EntityType=\"Lmobile.Email\"></EntitySet>"
			+ "				<EntitySet Name=\"Persons\" EntityType=\"Lmobile.Person\"></EntitySet>"
			+ "			</EntityContainer>"
			+ "		</Schema>"
			+ "	</edmx:DataServices>"
			+ "</edmx:Edmx>"
	});
	mock.get(/\/api\/Todos.*/, function(request, response) {
		return response.status(200).headers({
			"Content-Type": "application/json; odata.metadata=minimal",
			"OData-Version": "4.0"
		}).body({
			"@odata.context": "http://localhost/api/$metadata#TodoSet",
			"value": [{
				Id: 1,
				Task: "Task 1 for Peter",
				Completed: true,
				PersonId: 1,
				Person: {
					Id: 1,
					Name: "Peter",
					Emails: [
						{
							Id: 1,
							Data: "peter@example.com"
						}				
					]
				}
			},{
				Id: 2,
				Task: "Task 2 for Peter",
				Completed: false,
				PersonId: 1,
				Person: {
					Id: 1,
					Name: "Peter",
					Emails: [
						{
							Id: 1,
							Data: "peter@example.com"
						}				
					]
				}
			},{
				Id: 3,
				Task: "Task 1 for Alice",
				Completed: false,
				PersonId: 2,
				Person: {
					Id: 2,
					Name: "Alice",
					Emails: [
						{
							Id: 2,
							Data: "alice@example.com"
						}				
					]
				}
			}
			]
		});
	});
	return mock;
}

describe("JayData oData includes navigation properties with collections", () => {

	test("includes navigation properties with collections", async () => {
		expect.assertions(4);
		const mock = setup();
		const db = await $data.initService("/api");

		const results = await db.Todos.include("Person").include("Person.Emails").toArray();
		
		expect(results.length).toBe(3);
		expect(results[0].Person.Emails.length).toBe(1);
		expect(results[1].Person.Emails.length).toBe(1);
		expect(results[2].Person.Emails.length).toBe(1);
		
		mock.teardown();
	});
});

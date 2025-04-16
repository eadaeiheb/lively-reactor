require("./testbase");
const XHRMock = require("../xhr-mock-2.4.1");

function getMock() {
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
	return mock;
}

function getResponse(response) {
	return response.status(200).headers({
		"Content-Type": "application/json; odata.metadata=minimal",
		"OData-Version": "4.0"
	}).body({
		"@odata.context": "http://localhost/api/$metadata#SetA",
		"value": []
	});
}

describe("JayData oData transforms true to string", () => {

	test("contains", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(contains(Text%2C'x')%20eq%20true)", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => x.Text.contains("x") === true).toArray();
		mock.teardown();
	});

	test("startsWith", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(startswith(Text%2C'x')%20eq%20true)", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => x.Text.startsWith("x") === true).toArray();
		mock.teardown();
	});

	test("endsWith", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(endswith(Text%2C'x')%20eq%20true)", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => x.Text.endsWith("x") === true).toArray();
		mock.teardown();
	});

	test("length", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=true", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => this.p.length === 0, {p: ""}).toArray();
		mock.teardown();
	});

	test("length or startsWith", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(true%20or%20(startswith(Text%2C'')%20eq%20true))", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => this.p.length === 0 || x.Text.startsWith("") === true, {p: ""}).toArray();
		mock.teardown();
	});

	test("equal or starsWith", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(true%20or%20startswith(Text%2C''))", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => this.p === "" || x.Text.startsWith(""), {p: ""}).toArray();
		mock.teardown();
	});

	test("equal", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(Text%20eq%20'true')", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		const db = await $data.initService("/api");
		await db.SetA.filter(x => x.Text === true).toArray();
		mock.teardown();
	});

	test("concat", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(concat(Text%2C'123')%20eq%20'true')", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		await $data.initService("/api").then(db => db.SetA.filter(x => x.Text.concat("123") === true).toArray())
		mock.teardown();
	});

	test("substring", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=(substring(Text%2C1%2C2)%20eq%20'true')", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		await $data.initService("/api").then(db => db.SetA.filter(x => x.Text.substr(1, 2) === true).toArray());
		mock.teardown();
	});

	test("indexOf", async () => {
		expect.assertions(1);
		const mock = getMock();
		mock.get("/api/SetA?%24filter=((indexof(Text%2C'123')%20eq%200)%20eq%20true)", (request, response) => {
			expect(true).toBe(true);
			return getResponse(response);
		});
		await $data.initService("/api").then(db => db.SetA.filter(x => (x.Text.indexOf("123") === 0) === true).toArray());
		mock.teardown();
	});
});

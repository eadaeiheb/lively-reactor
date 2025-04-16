require("./testbase");
describe("JayData relation tests", () => {
	test("1:n array without back reference", done => {
		expect.assertions(2);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			DueDate: {type: Date},
			Completed: {type: Boolean},
			PersonId: {type: "int"}
		});
		const Person = $data.Entity.extend("Person", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			Todos: {type: Array, elementType: Todo, inverseProperty: "$$unbound", keys: ["PersonId"]}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo},
			People: {type: $data.EntitySet, elementType: Person}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(async () => {
			todoDB.People.addMany([
				{Name: "Peter", Id: 1},
				{Name: "Alice", Id: 2},
				{Name: "Bob", Id: 3},
				{Name: "Paul", Id: 4}
			]);
			await todoDB.saveChanges();
			todoDB.Todos.addMany([
				{Task: "Task 1 for Peter", Completed: true, PersonId: 1},
				{Task: "Task 2 for Peter", PersonId: 1},
				{Task: "Task 3 for Peter", PersonId: 1},
				{Task: "Task 1 for Alice", Completed: true, PersonId: 2},
				{Task: "Task 2 for Alice", PersonId: 2},
				{Task: "Task 1 for Bob", Completed: true, PersonId: 3},
				{Task: "Task 2 for Bob", PersonId: 3},
				{Task: "Task 1 for Paul", Completed: true, PersonId: 4},
				{Task: "Task 2 for Paul", PersonId: 4}
			]);
			await todoDB.saveChanges();
			const results = await todoDB.People.include("Todos").skip(2).take(2).toArray()
			expect(results).toHaveLength(2);
			expect(results[0].Todos).toHaveLength(2);
			done();
		});
	});
	test("1:n relations with same entity type", done => {
		expect.assertions(6);
		const Person = $data.Entity.extend("Person", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			MotherId: {type: "int"},
			Children: {type: Array, elementType: "Child", inverseProperty: "Mother", keys: ["MotherId"]},
			Mother: {type: "Mother", inverseProperty: "Children", keys: ["MotherId"]}
		});
		const Child = Person.extend("Child", {});
		$data.Container.registerConverter(Child, Person, function (value) {
			return value;
		}, function (value) {
			return value;
		});
		const Mother = Person.extend("Mother", {});
		$data.Container.registerConverter(Mother, Person, function (value) {
			return value;
		}, function (value) {
			return value;
		});

		const TestDatabase = $data.EntityContext.extend("TestDatabase", {
			People: {type: $data.EntitySet, elementType: Person, tableName: "People"},
			Children: {type: $data.EntitySet, elementType: Child, tableName: "People"},
			Mothers: {type: $data.EntitySet, elementType: Mother, tableName: "People"}
		});

		const testDB = new TestDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		testDB.onReady(async () => {
			testDB.People.addMany([
				{Name: "Alice"},
				{Name: "Bob", MotherId: 1}
			]);
			await testDB.saveChanges();
			let results = await testDB.People
				.include("Children")
				.filter(function (x) {
					return x.Name === "Alice";
				})
				.toArray();
			expect(results).toHaveLength(1);
			expect(results[0].Children).toHaveLength(1);
			expect(results[0].Children[0].Name).toBe("Bob");
			results = await testDB.People
				.include("Mother")
				.filter(x => x.Name === "Bob")
				.toArray();
			expect(results).toHaveLength(1);
			expect(results[0].Mother).not.toBeFalsy();
			expect(results[0].Mother.Name).toBe("Alice");
			done();
		});
	});
	test("1:n without back reference", done => {
		expect.assertions(2);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			DueDate: {type: Date},
			Completed: {type: Boolean},
			PersonId: {type: "int"},
			Person: {
				type: "Person",
				defaultValue: null,
				required: false,
				inverseProperty: "$$unbound",
				keys: ["PersonId"]
			}
		});
		const Person = $data.Entity.extend("Person", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String, required: true, maxLength: 200},
			Status: {type: String}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo},
			People: {type: $data.EntitySet, elementType: Person}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(async () => {
			todoDB.People.addMany([
				{Name: "Peter", Id: 1},
				{Name: "Alice", Id: 2},
				{Name: "Bob", Id: 3},
				{Name: "Paul", Id: 4}
			]);
			await todoDB.saveChanges();
			todoDB.Todos.addMany([
				{Task: "Task 1 for Peter", Completed: true, PersonId: 1},
				{Task: "Task 2 for Peter", PersonId: 1},
				{Task: "Task 3 for Peter", PersonId: 1},
				{Task: "Task 1 for Alice", Completed: true, PersonId: 2},
				{Task: "Task 2 for Alice", PersonId: 2},
				{Task: "Task 1 for Bob", Completed: true, PersonId: 3},
				{Task: "Task 2 for Bob", PersonId: 3},
				{Task: "Task 1 for Paul", Completed: true, PersonId: 4},
				{Task: "Task 2 for Paul", PersonId: 4}
			]);
			await todoDB.saveChanges();
			const results = await todoDB.Todos.include("Person").skip(2).take(2).toArray();
			expect(results).toHaveLength(2);
			expect(results[0].Person).not.toBeFalsy();
			done();
		});
	});
});

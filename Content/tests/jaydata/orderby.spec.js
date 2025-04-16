require("./testbase");

describe("JayData order by tests", () => {

	test("orderBy with aggregate function", done => {
		expect.assertions(2);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			DueDate: {type: Date},
			Completed: {type: Boolean},
			PersonId: {type: "int"},
			Person: {type: "Person", defaultValue: null, required: false, inverseProperty: "Todos", keys: ["PersonId"]}
		});
		const Person = $data.Entity.extend("Person", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			Todos: {type: Array, elementType: "Todo", inverseProperty: "Person", keys: ["PersonId"]}
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
				{Task: "Task 2 for Paul", Completed: true, PersonId: 4}
			]);
			await todoDB.saveChanges();
			const results = await todoDB.People
				.filter("it.Todos.Completed === true")
				.groupBy("it.Id")
				.map(it => ({Person: it, CompletedTasks: it.Todos.Id.count()}))
				.orderByDescending(it => it.Todos.Id.count())
				.toArray();
			expect(results).toHaveLength(4);
			expect(results[0].CompletedTasks).toBe(2);
			done();
		});
	});
	test("orderBy with computed values", done => {
		expect.assertions(5);

		const Item = $data.Entity.extend("Item", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String},
			Status: {type: String},
			Quantity: {type: "int"},
			Price: {type: "int"}
		});

		const TestDatabase = $data.EntityContext.extend("TestDatabase", {
			Items: {type: $data.EntitySet, elementType: Item}
		});

		const testDB = new TestDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		testDB.onReady(async () => {
			testDB.Items.addMany([
				{Name: "X001", Quantity: 4, Price: 20, Id: 1},
				{Name: "X002", Quantity: 7, Price: 30, Id: 2},
				{Name: "X003", Quantity: 1, Price: 100, Id: 3},
				{Name: "X004", Quantity: 1, Price: 30, Id: 4}
			]);
			await testDB.saveChanges();
			const results = await testDB.Items
				.orderByDescending(it => it.Quantity * it.Price)
				.toArray();
			expect(results).toHaveLength(4);
			expect(results[0].Id).toBe(2);
			expect(results[1].Id).toBe(3);
			expect(results[2].Id).toBe(1);
			expect(results[3].Id).toBe(4);
			done();
		});
	});
	test("orderBy with computed values 2", done => {
		expect.assertions(3);

		const Item = $data.Entity.extend("Item", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String},
			Status: {type: String},
			Quantity: {type: "int"},
			Price: {type: "int"}
		});

		const TestDatabase = $data.EntityContext.extend("TestDatabase", {
			Items: {type: $data.EntitySet, elementType: Item}
		});

		const testDB = new TestDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		testDB.onReady(async () => {
			testDB.Items.addMany([
				{Name: "X001", Quantity: 4, Price: 20, Id: 1},
				{Name: "X002", Quantity: 7, Price: 30, Id: 2},
				{Name: "X003", Quantity: 1, Price: 100, Id: 3},
				{Name: "X004", Quantity: 1, Price: 30, Id: 4}
			]);
			await testDB.saveChanges();
			const results = await testDB.Items
				.orderByDescending(it => 100 - it.Price)
				.toArray();
			expect(results).toHaveLength(4);
			expect(results[0].Id).toBe(1);
			expect(results[3].Id).toBe(3);
			done();
		});
	});
});

require("./testbase");

describe("JayData distinct tests", () => {
	test("distinct", done => {
		expect.assertions(7);

		const KeyValue = $data.Entity.extend("KeyValue", {
			Id: {type: "int", key: true, computed: true},
			Value: {type: "int"},
			Type: {type: "string"}
		});

		const AggregationDatabase = $data.EntityContext.extend("AggregationDatabase", {
			Items: {type: $data.EntitySet, elementType: KeyValue}
		});

		const aggregationDB = new AggregationDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		aggregationDB.onReady(async () => {
			aggregationDB.Items.addMany([
				{Value: 0, Type: "A"},
				{Value: 1, Type: "A"},
				{Value: 0, Type: "A"},
				{Value: 1, Type: "B"},
				{Value: 1, Type: "B"}
			]);
			await aggregationDB.saveChanges();
			let r = await aggregationDB.Items.map(it => it.Type).distinct().toArray();
			expect(r).toHaveLength(2);
			expect(r[0]).toBe("A");
			expect(r[1]).toBe("B");
			r = await aggregationDB.Items.map(it => ({
				v: it.Value,
				t: it.Type
			})).distinct().toArray();
			expect(r).toHaveLength(3);
			expect(r[0].t).toBe("A");
			expect(r[1].t).toBe("A");
			expect(r[2].t).toBe("B");
			done();
		});
	});

	test("todo distinct", done => {
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
			Todos: {type: Array, elementType: Todo, inverseProperty: "Person", keys: ["PersonId"]}
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

		todoDB.onReady(async function () {
			todoDB.People.addMany([
				{Name: "Peter", Id: 1},
				{Name: "Alice", Id: 2},
				{Name: "Bob", Id: 3},
				{Name: "Paul", Id: 4}
			]);
			await todoDB.saveChanges();
			const now = new Date();
			todoDB.Todos.addMany([
				{Task: "Task 1 for Peter", Completed: true, PersonId: 1, DueDate: now},
				{Task: "Task 2 for Peter", PersonId: 1, DueDate: now},
				{Task: "Task 3 for Peter", PersonId: 1, DueDate: now},
				{Task: "Task 1 for Alice", Completed: true, PersonId: 2, DueDate: now},
				{Task: "Task 2 for Alice", PersonId: 2, DueDate: now},
				{Task: "Task 1 for Bob", Completed: true, PersonId: 3, DueDate: now},
				{Task: "Task 2 for Bob", PersonId: 3, DueDate: now},
				{Task: "Task 1 for Paul", Completed: true, PersonId: 4, DueDate: now},
				{Task: "Task 2 for Paul", PersonId: 4, DueDate: now}
			]);
			todoDB.saveChanges();
			let r = await todoDB.Todos
				.filter((todo) => todo.DueDate < this.minDate, {minDate: new Date()})
				.map(todo => todo.PersonId)
				.distinct()
				.toArray();
			expect(r).toHaveLength(4);
			r = await todoDB.Todos
				.include("Person")
				.filter((todo) => todo.DueDate < this.minDate, {minDate: new Date()})
				.map(todo => ({Id: todo.PersonId, Name: todo.Person.Name}))
				.distinct()
				.toArray();
			expect(r).toHaveLength(4);
			done();
		});
	});
});

require("./testbase");
describe("JayData inlinecount tests", function () {
	test("inlinecount", done => {
		expect.assertions(6);
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

		todoDB.onReady(async () => {
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
			await todoDB.saveChanges();
			let r = await todoDB.People.withInlineCount().include("Todos")
				.filter("it.Name.contains('P')")
				.filter("it.Todos.Task.contains('Task')").skip(1).take(2).toArray();
			expect(r).toHaveLength(1);
			expect(r.totalCount).toBe(2);
			r = await todoDB.Todos
				.include("Person")
				.filter(todo => todo.DueDate < this.minDate, {minDate: new Date()})
				.map(todo => ({Id: todo.PersonId, Name: todo.Person.Name}))
				.withInlineCount()
				.distinct()
				.toArray();
			expect(r).toHaveLength(4);
			expect(r.totalCount).toBe(4);
			r = await todoDB.Todos
				.include("Person")
				.filter(todo => todo.Person.Name === this.name, {name: "Viktor"})
				.map(todo => ({Id: todo.PersonId, Name: todo.Person.Name}))
				.withInlineCount()
				.distinct()
				.toArray();
			expect(r).toHaveLength(0);
			expect(r.totalCount).toBe(0);
			done();
		});
	});

	test("inlinecount with queryCache", done => {
		expect.assertions(4);
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

		todoDB.onReady(async () => {
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
			await todoDB.saveChanges();
			const r = await todoDB.People.withInlineCount().include("Todos").filter("it.Name.contains('P')")
				.filter("it.Todos.Task.contains('Task')").skip(1).take(2).toArray();
			expect(r).toHaveLength(1);
			expect(r.totalCount).toBe(2);
			const r2 = await todoDB.People.withInlineCount().include("Todos").filter("it.Name.contains('P')")
				.filter("it.Todos.Task.contains('Task')").skip(1).take(2).toArray();
			expect(r2).toHaveLength(1);
			expect(r2.totalCount).toBe(2);
			done();
		});
	});

	test("inline count with include", done => {
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

		todoDB.onReady(async () => {
			todoDB.People.addMany([
				{Name: "Peter"},
				{Name: "Alice"},
				{Name: "Bob"},
				{Name: "Paul"}
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
			todoDB.People
				.include("Todos")
				.orderBy(x => x.Name)
				.withInlineCount()
				.take(2)
				.toArray(function (results) {
					expect(results).toHaveLength(2);
					expect(results.totalCount).toBe(4);
					done();
				});
		});
	});

	test("inline count with include optimized", done => {
		expect.assertions(4);
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

		todoDB.onReady(async () => {
			todoDB.People.addMany([
				{Name: "Peter"},
				{Name: "Alice"},
				{Name: "Bob"},
				{Name: "Paul"}
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
			let results = await todoDB.Todos
				.orderBy(x => x.Person.Name)
				.withInlineCount()
				.take(2)
				.toArray();
			expect(results).toHaveLength(2);
			expect(results.totalCount).toBe(9);
			results = await todoDB.People
				.orderBy(x => x.Todos.Task)
				.withInlineCount()
				.take(2)
				.toArray();
			expect(results).toHaveLength(2);
			expect(results.totalCount).toBe(4);
			done();
		});
	});

});
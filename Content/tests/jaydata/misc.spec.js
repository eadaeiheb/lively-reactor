require("./testbase");
describe("JayData misc tests", () => {
	test("save copy of entity with changed property", done => {
		expect.assertions(1);
		const Location = $data.Entity.extend("Location", {
			City: {type: String},
			Country: {type: String}
		});
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			DueDate: {type: Date},
			Completed: {type: Boolean},
			Location: {type: Location}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		const now = new Date();
		todoDB.onReady(async () => {
			todoDB.Todos.addMany([
				{
					Id: 1,
					Task: "Task at Sulzbach",
					Completed: true,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Id: 2,
					Task: "Task at Budapest",
					Completed: false,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				},
				{
					Id: 3,
					Task: "Another task at Sulzbach",
					Completed: false,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Id: 4,
					Task: "Another task at Budapest",
					Completed: true,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				}
			]);
			await todoDB.saveChanges();
			const result = await todoDB.Todos.find(1);
			const newTodo = todoDB.Todos.Todo.create(result.initData);
			todoDB.attachOrGet(newTodo);
			newTodo.Task = "Changed task";
			await todoDB.saveChanges();
			const result2 = await todoDB.Todos.find(1);

			expect(result2.Task).toEqual("Changed task");
			done();
		});
	});

	test("===", done => {
		expect.assertions(4);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			DueDate: {type: Date},
			Completed: {type: Boolean}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(() => {
			todoDB.Todos.addMany([
				{Task: "Step0: Get this this list", Completed: true},
				{Task: "Step1: Define your data model"},
				{Task: "Step2: Initialize data storage"}
			]);
			todoDB.saveChanges(async () => {
				await todoDB.Todos.filter(x => x.Task == this.taskFilter, {taskFilter: null}).count();
				expect(true).toBe(true);
				await todoDB.Todos.filter(x => x.Task == this.taskFilter, {taskFilter: "Step1: Define your data model"}).count();
				expect(true).toBe(true);
				await todoDB.Todos.filter(x => x.Task === this.taskFilter, {taskFilter: null}).count();
				expect(true).toBe(true);
				await todoDB.Todos.filter(x => x.Task !== this.taskFilter, {taskFilter: "Step1: Define your data model"}).count();
				expect(true).toBe(true);
				done();
			});
		});
	});
	test("removeAll", done => {
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
			const c = await todoDB.Todos.count();
			expect(c).toEqual(9);
			await todoDB.Todos.removeAll();
			const c2 = await todoDB.Todos.count();
			expect(c2).toBe(0);
			done();
		});
	});
	test("escaping", done => {
		expect.assertions(3);
		const TimeEntry = $data.Entity.extend("TimeEntry", {
			Id: {type: "int", key: true, computed: true},
			Description: {type: String, maxLength: 200},
			From: {type: Date},
			To: {type: Boolean}
		});

		const TimeEntryDatabase = $data.EntityContext.extend("TimeEntryDatabase", {
			TimeEntries: {type: $data.EntitySet, elementType: TimeEntry}
		});

		const db = new TimeEntryDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables
		});

		db.onReady(async () => {
			db.TimeEntries.addMany([
				{Description: "Test 1", From: new Date(), To: new Date()},
				{Description: "Test 2", From: new Date(), To: new Date()},
				{Description: "Test 3", From: new Date(), To: new Date()}
			]);
			await db.saveChanges();
			let results = await db.TimeEntries.toArray();
			expect(results).toHaveLength(3);
			results = await db.TimeEntries.filter(x => x.From <= this.date, {date: new Date()}).toArray();
			expect(results).toHaveLength(3);
			results = await db.TimeEntries.orderBy(x => x.From, {date: new Date()}).toArray();
			expect(results).toHaveLength(3);
			done();
		});
	});
	test("entity context detach", done => {
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
			const peter = await todoDB.People.find(1);
			todoDB.attach(peter);
			expect(peter.entityState).toEqual($data.EntityState.Unchanged);
			peter.Name = "Peter Parker";
			expect(peter.changedProperties).toBeTruthy();
			expect(peter.changedProperties).toHaveLength(1);
			expect(peter.entityState).toEqual($data.EntityState.Modified);
			todoDB.detach(peter);
			expect(peter.entityState).toBe($data.EntityState.Detached);
			const c = await todoDB.saveChanges();
			expect(c).toBe(0);
			done();
		});
	});
	test("single as filter and toArray", done => {
		expect.assertions(1);
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

			try {
				const result = await todoDB.People.find(123);
				expect(result).toBe("This should not execute!");
			} catch (e) {
				expect(true).toBe(true);
			}
			done();
		});
	});
});


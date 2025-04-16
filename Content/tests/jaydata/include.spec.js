require("./testbase");
describe("JayData include tests", () => {
	test("deep include", done => {
		expect.assertions(3);

		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			DueDate: {type: Date},
			Completed: {type: Boolean},
			PersonId: {type: "int"},
			Status: {type: String},
			Comments: {type: Array, elementType: "Comment", inverseProperty: "Todo"}
		});
		const Person = $data.Entity.extend("Person", {
			Id: {type: "int", key: true, computed: true},
			Name: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			Todos: {type: Array, elementType: Todo, inverseProperty: "$$unbound", keys: ["PersonId"]}
		});
		const Comment = $data.Entity.extend("Comment", {
			Id: {type: "int", key: true, computed: true},
			Text: {type: String},
			Status: {type: String},
			Todo: {type: "Todo", required: true, inverseProperty: "Comments"}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo},
			People: {type: $data.EntitySet, elementType: Person},
			Comments: {type: $data.EntitySet, elementType: Comment}
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
				{
					Task: "Task 1 for Peter",
					Completed: true,
					PersonId: 1,
					LocationId: 1,
					Comments: [{Text: "Blablabla"}, {Text: "Lalalalala"}, {Text: "aeiou"}]
				},
				{Task: "Task 2 for Peter", PersonId: 1, LocationId: 1},
				{Task: "Task 3 for Peter", PersonId: 1, LocationId: 1},
				{Task: "Task 1 for Alice", Completed: true, PersonId: 2, LocationId: 1, Comments: [{Text: "..."}]},
				{Task: "Task 2 for Alice", PersonId: 2, LocationId: 1},
				{Task: "Task 1 for Bob", Completed: true, PersonId: 3, LocationId: 1},
				{Task: "Task 2 for Bob", PersonId: 3, LocationId: 1},
				{Task: "Task 1 for Paul", Completed: true, PersonId: 4, LocationId: 1},
				{Task: "Task 2 for Paul", PersonId: 4, LocationId: 1}
			]);
			await todoDB.saveChanges();
			const results = await todoDB.People.include("Todos")
				.include("Todos.Comments")
				.filter(x => x.Id === 1)
				.orderBy(x => x.Todos.Task)
				.toArray();

			expect(results).toHaveLength(1);
			expect(results[0].Todos).toHaveLength(3);
			expect(results[0].Todos[0].Comments).toHaveLength(3);
			done();
		});
	});

	test("a lot of includes", done => {
		expect.assertions(1);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Task: {type: String, required: true, maxLength: 200},
			Status: {type: String},
			T01: {type: Array, elementType: "T01", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T02: {type: Array, elementType: "T02", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T03: {type: Array, elementType: "T03", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T04: {type: Array, elementType: "T04", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T05: {type: Array, elementType: "T05", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T06: {type: Array, elementType: "T06", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T07: {type: Array, elementType: "T07", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T08: {type: Array, elementType: "T08", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T09: {type: Array, elementType: "T09", inverseProperty: "$$unbound", keys: ["TodoId"]},
			T10: {type: Array, elementType: "T10", inverseProperty: "$$unbound", keys: ["TodoId"]}
		});
		const T01 = $data.Entity.extend("T01", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T02 = $data.Entity.extend("T02", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T03 = $data.Entity.extend("T03", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T04 = $data.Entity.extend("T04", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T05 = $data.Entity.extend("T05", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T06 = $data.Entity.extend("T06", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T07 = $data.Entity.extend("T07", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T08 = $data.Entity.extend("T08", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T09 = $data.Entity.extend("T09", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});
		const T10 = $data.Entity.extend("T10", {
			Id: {type: "int", key: true, computed: true},
			TodoId: {type: "int"},
			Text: {type: String},
			Status: {type: String}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo},
			T01: {type: $data.EntitySet, elementType: T01},
			T02: {type: $data.EntitySet, elementType: T02},
			T03: {type: $data.EntitySet, elementType: T03},
			T04: {type: $data.EntitySet, elementType: T04},
			T05: {type: $data.EntitySet, elementType: T05},
			T06: {type: $data.EntitySet, elementType: T06},
			T07: {type: $data.EntitySet, elementType: T07},
			T08: {type: $data.EntitySet, elementType: T08},
			T09: {type: $data.EntitySet, elementType: T09},
			T10: {type: $data.EntitySet, elementType: T10}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(function () {
			todoDB.Todos.addMany([
				{Task: "Step0: Get this this list"},
				{Task: "Step1: Define your data model"},
				{Task: "Step2: Initialize data storage"}
			]);
			todoDB.saveChanges(async () => {
				const r = await todoDB.Todos
					.include("T01")
					.include("T02")
					.include("T03")
					.include("T04")
					.include("T05")
					.include("T06")
					.include("T07")
					.include("T08")
					.include("T09")
					.include("T10")
					.toArray();

				expect(Object.keys(r[0].initData)
					.filter(e => [...Array(10).keys()].map(k => `T${(k + 1).toString(10).padStart(2, "0")}`).includes(e))).toHaveLength(10);
				done();
			});
		});
	});

	test("deep include many-one before one-many", done => {
		expect.assertions(2);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Obj: {type: "Obj", inverseProperty: "Todo"},
			Status: {type: String}
		});

		const Obj = $data.Entity.extend("Obj", {
			Id: {type: "int", key: true, computed: true},
			Tasks: {type: Array, elementType: "Task", inverseProperty: "Obj"},
			Directory: {type: "Directory", inverseProperty: "Obj"},
			Todo: {type: "Todo", inverseProperty: "Obj", required: true},
			Status: {type: String}
		});

		const Task = $data.Entity.extend("Task", {
			Id: {type: "int", key: true, computed: true},
			Text: {type: String},
			File: {type: "File", inverseProperty: "Task"},
			Obj: {type: "Obj", inverseProperty: "Tasks"},
			Status: {type: String}
		});
		const File = $data.Entity.extend("File", {
			Id: {type: "int", key: true, computed: true},
			Text: {type: String},
			Task: {type: "Task", inverseProperty: "File", required: true},
			Directory: {type: "Directory", inverseProperty: "Files", required: true},
			Status: {type: String}
		});
		const Directory = $data.Entity.extend("Directory", {
			Id: {type: "int", key: true, computed: true},
			Text: {type: String},
			Files: {type: Array, elementType: "File", inverseProperty: "Directory"},
			Obj: {type: "Obj", inverseProperty: "Directory", required: true},
			Status: {type: String}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo},
			Task: {type: $data.EntitySet, elementType: Task},
			File: {type: $data.EntitySet, elementType: File},
			Directory: {type: $data.EntitySet, elementType: Directory},
			Obj: {type: $data.EntitySet, elementType: Obj}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(() => {
			todoDB.Todos.addMany([
				{Task: "Step0: Get this this list"},
				{Task: "Step1: Define your data model"},
				{Task: "Step2: Initialize data storage"}
			]);
			todoDB.saveChanges(async () => {
				await todoDB.Todos
					.include("Obj.Directory.Files")
					.include("Obj.Tasks.File")
					.toArray();
				expect(true).toBe(true);
				await todoDB.Todos
					.include("Obj.Tasks.File")
					.include("Obj.Directory.Files")
					.toArray();
				expect(true).toBe(true);
				done();
			});
		});
	});

	test("multiple includes with arrays", done => {
		expect.assertions(2);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "int", key: true, computed: true},
			Obj: {type: "Obj", inverseProperty: "Todo"},
			ObjId: {type: "int"},
			Status: {type: String}
		});

		const Obj = $data.Entity.extend("Obj", {
			Id: {type: "int", key: true, computed: true},
			Tasks: {type: Array, elementType: "Task", inverseProperty: "Obj"},
			Files: {type: Array, elementType: "File", inverseProperty: "Obj"},
			Todo: {type: "Todo", inverseProperty: "Obj", required: true},
			"Todo__Id": {type: "int"},
			Status: {type: String}
		});

		const Task = $data.Entity.extend("Task", {
			Id: {type: "int", key: true, computed: true},
			Text: {type: String},
			File: {type: "File", inverseProperty: "Task"},
			Obj: {type: "Obj", inverseProperty: "Tasks"},
			Status: {type: String}
		});
		const File = $data.Entity.extend("File", {
			Id: {type: "int", key: true, computed: true},
			Text: {type: String},
			Task: {type: "Task", inverseProperty: "File", required: true},
			Obj: {type: "Obj", inverseProperty: "Files", required: true},
			Status: {type: String}
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: {type: $data.EntitySet, elementType: Todo},
			Task: {type: $data.EntitySet, elementType: Task},
			File: {type: $data.EntitySet, elementType: File},
			Obj: {type: $data.EntitySet, elementType: Obj}
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(() => {
			todoDB.Todos.addMany([
				{Task: "Step0: Get this this list"},
				{Task: "Step1: Define your data model"},
				{Task: "Step2: Initialize data storage"}
			]);
			todoDB.Obj.addMany([
				{"Todo__Id": 1}
			]);
			todoDB.saveChanges(async () => {
				let x = await todoDB.Todos
					.include("Obj.Files")
					.toArray();
				expect(Array.isArray(x[0].Obj.Files)).toBe(true);
				x = await todoDB.Todos
					.include("Obj.Tasks.File")
					.include("Obj.Files")
					.toArray();
				expect(Array.isArray(x[0].Obj.Files)).toBe(true);
				done();
			});
		});
	});

	test("single first with include", done => {
		expect.assertions(12);

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
				inverseProperty: "Todos",
				keys: ["PersonId"]
			}
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
			const results = await todoDB.People.include("Todos").skip(2).take(1).toArray();
			expect(results).toHaveLength(1);
			await todoDB.People.first();
			expect(true).toBe(true);
			await todoDB.People.include("Todos").first();
			expect(true).toBe(true);
			await todoDB.People.include("Todos").first("it.Todos.Task.startsWith('Task 1') || it.Todos.Task.startsWith('Task 3')");
			expect(true).toBe(true);
			await todoDB.People.include("Todos").first("it.Todos.Task.startsWith('Task')");
			expect(true).toBe(true);
			await todoDB.People.include("Todos").skip(2).first();
			expect(true).toBe(true);
			try {
				await todoDB.People.include("Todos").single("it.Todos.Task.startsWith('Task')");
				expect(true).toBe(false);
			} catch (e) {
				expect(e.message).toBe("result count failed");
			}
			await todoDB.People.include("Todos").find(1);
			expect(true).toBe(true);
			await todoDB.People.include("Todos").toArray();
			expect(true).toBe(true);
			todoDB.People.include("Todos").filter("it.Name.contains('P')").skip(1).take(2).toArray();
			expect(true).toBe(true);
			todoDB.People.include("Todos").filter("it.Todos.Task.contains('Task')").skip(1).take(2).toArray();
			expect(true).toBe(true);
			todoDB.People.include("Todos").filter("it.Name.contains('P')")
				.filter("it.Todos.Task.contains('Task')").skip(1).take(2).toArray();
			expect(true).toBe(true);
			done();
		});
	});
});


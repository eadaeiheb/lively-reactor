require("./testbase");
describe("JayData date tests", () => {

	test("websql date functions", done => {
		expect.assertions(9);
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
			const results = await todoDB.Todos.filter("it.DueDate == this.d", {d: now}).map(it => ({
				now: strftime("%Y-%m", "now"),
				year2: strftime("%Y", it.DueDate / 1000, "unixepoch"),
				year: (it.DueDate / 1000).strftime("%Y", "unixepoch"),
				day: it.DueDate.day(),
				hour: it.DueDate.hour(),
				minute: it.DueDate.minute(),
				month: it.DueDate.month(),
				second: it.DueDate.second(),
				year3: it.DueDate.year()
			}))
				.groupBy("strftime('%Y', it.DueDate / 1000, 'unixepoch')")
				.groupBy("it.Task")
				.toArray();
			expect(results[0].now).toBe(now.getFullYear() + "-" + ("00" + (now.getMonth() + 1)).slice(-2));
			expect(results[0].year).toBe(now.getFullYear().toString());
			expect(results[0].year2).toBe(now.getFullYear().toString());
			expect(results[0].day).toBe(now.getUTCDate());
			expect(results[0].hour).toBe(now.getUTCHours());
			expect(results[0].minute).toBe(now.getUTCMinutes());
			expect(results[0].month).toBe(now.getUTCMonth() + 1);
			expect(results[0].second).toBe(now.getUTCSeconds());
			expect(results[0].year3).toBe(now.getUTCFullYear());
			done();
		});
	}, 10000);
});

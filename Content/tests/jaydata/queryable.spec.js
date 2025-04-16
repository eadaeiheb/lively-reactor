require("./testbase");
describe("JayData queryable tests", () => {
	test("queryable as filter parameter", done => {
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
				{Task: "Task 1 for Alice", Completed: true, PersonId: 2},
				{Task: "Task 2 for Alice", PersonId: 2},
				{Task: "Task 1 for Bob", Completed: true, PersonId: 3},
				{Task: "Task 2 for Bob", PersonId: 3},
				{Task: "Task 1 for Paul", Completed: true, PersonId: 4},
				{Task: "Task 2 for Paul", PersonId: 4}
			]);
			await todoDB.saveChanges();
			const personIds = todoDB.People.filter(x => x.Name.startsWith("P")).map(x => x.Id);
			let results = await todoDB.Todos
				.filter(x => x.PersonId in this.personIds && x.Completed === true, {personIds})
				.orderBy(x => x.DueDate)
				.take(10)
				.toArray();
			expect(results).toHaveLength(2);
			results = await todoDB.Todos
				.include("Person")
				.filter(x => x.PersonId in this.personIds && x.Completed === true, {personIds})
				.orderBy(x => x.DueDate)
				.take(10)
				.toArray();
			expect(results).toHaveLength(2);
			done();
		});
	});
});

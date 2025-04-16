require("./testbase");
describe("JayData knockout module tests", () => {
	test("knockout observable arrays", done => {
		expect.assertions(5);
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
			const result = await todoDB.People.include("Todos").find(1);
			const person = result.asKoObservable();
			expect(ko.isObservable(person.Name)).toBe(true);
			expect(ko.isObservable(person.Todos)).toBe(true);
			expect(person.Todos.destroyAll !== undefined).toBe(true);
			expect(ko.isObservable(person.Todos()[0].Task)).toBe(true);
			person.Name.extend({required: true});
			ko.components.register("test-component", {
				template: "<p>the observable: <span data-bind=\"text: receivedobservable\"></span></p>",
				viewModel: function (params) {
					this.receivedobservable = params.suppliedobservable;
					expect(!ko.isComputed(params.suppliedobservable)).toBe(true);
					this.dispose = function () {
						this.wasDisposed = true;
					};
				}
			});

			const testNode = document.createElement("div");
			testNode.innerHTML = "<test-component params=\"suppliedobservable: myobservable.Name\"></test-component>";
			ko.applyBindings({myobservable: person}, testNode);

			done();
		});
	});

	test("knockout observable arrays2", done => {
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
			todoDB.saveChanges();
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
			const result = await todoDB.People.include("Todos").find(1);
			const person = result.asKoObservable();
			expect(ko.isObservable(person.Name)).toBe(true);
			expect(ko.isObservable(person.Todos)).toBe(true);
			person.Todos.remove(todo => todo.Task().indexOf("Task 1") !== -1);
			person.Todos.push({Task: "Task 4 for Peter", Completed: false, PersonId: 1});
			person.Todos.valueHasMutated();
			// check if it has ko.observableArray.fn extender
			expect(person.Todos.destroyAll !== undefined).toBe(true);
			expect(ko.isObservable(person.Todos()[0].Task)).toBe(true);
			done();
		});
	});

	test("knockout observable arrays3", done => {
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
					Task: "Task at Sulzbach",
					Completed: true,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Task: "Task at Budapest",
					Completed: false,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				},
				{
					Task: "Another task at Sulzbach",
					Completed: false,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Task: "Another task at Budapest",
					Completed: true,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				}
			]);
			await todoDB.saveChanges();
			const results = ko.observableArray([]);
			results.subscribe(() => expect(true).toBe(true));
			await todoDB.Todos.toArray(results);
			done();
		});
	});
	test("knockout observable arrays4", done => {
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
			const result = await todoDB.People.include("Todos").find(1);
			const person = result.asKoObservable();
			expect(ko.isObservable(person.Name)).toBe(true);
			expect(ko.isObservable(person.Todos)).toBe(true);
			// check if it has ko.observableArray.fn extender
			expect(person.Todos.destroyAll !== undefined).toBe(true);
			expect(ko.isObservable(person.Todos()[0].Task)).toBe(true);
			done();
		});
	});
	test("knockout complex types are observables", done => {
		expect.assertions(3);

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
					Task: "Task at Sulzbach",
					Completed: true,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Task: "Task at Budapest",
					Completed: false,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				},
				{
					Task: "Another task at Sulzbach",
					Completed: false,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Task: "Another task at Budapest",
					Completed: true,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				}
			]);
			await todoDB.saveChanges();
			const results = ko.observableArray([]);
			await todoDB.Todos.toArray(results);
			expect(ko.isObservable(results()[0].Task)).toBe(true);
			expect(ko.isObservable(results()[0].Location)).toBe(true);
			expect(ko.isObservable(results()[0].Location().City)).toBe(true);
			done();
		});
	});
	test("knockout observable arrays5", done => {
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
					Task: "Task at Sulzbach",
					Completed: true,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Task: "Task at Budapest",
					Completed: false,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				},
				{
					Task: "Another task at Sulzbach",
					Completed: false,
					DueDate: now,
					Location: {City: "Sulzbach", Country: "Germany"}
				},
				{
					Task: "Another task at Budapest",
					Completed: true,
					DueDate: now,
					Location: {City: "Budapest", Country: "Hungary"}
				}
			]);
			await todoDB.saveChanges();
			const results = ko.observableArray([]);
			results.subscribe(() => {
				expect(true).toBe(true);
				done();
			});
			await todoDB.Todos.toArray(results);
		});
	});
	test("knockout complex type changes are not registered as changes", done => {
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
			todoDB.attachOrGet(result);
			const resultObservable = result.asKoObservable();
			resultObservable.Location().City("Sulzbach an der Murr");
			await todoDB.saveChanges();
			const result2 = await todoDB.Todos.find(1);
			expect(result2.Location.City).toBe("Sulzbach an der Murr");
			done();
		});
	});

	test("knockout date observable change fires subscriber exactly once", done => {
		expect.assertions(4);
		const Person = $data.Entity.extend("Person", {
			Id: { type: "int", key: true, computed: true },
			Name: { type: String, required: true, maxLength: 200 },
			BirthDate: { type: "Edm.DateTime" },
			CreateDate: { type: Date }
		});

		const PeopleDatabase = $data.EntityContext.extend("TodoDatabase", {
			People: { type: $data.EntitySet, elementType: Person }
		});

		const peopleDB = new PeopleDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		const now1 = new Date();
		const now2 = new Date(now1);

		peopleDB.onReady(async () => {
			peopleDB.People.addMany([
				{ Name: "Peter", Id: 1, BirthDate: Date.parse("1980-01-01T00:00:00.000Z"), CreateDate: Date.parse("2020-01-01") },
				{ Name: "Alice", Id: 2, BirthDate: Date.parse("1990-01-01T00:00:00.000Z"), CreateDate: Date.parse("2020-01-01") },
				{ Name: "Bob", Id: 3, BirthDate: Date.parse("2000-01-01T00:00:00.000Z"), CreateDate: Date.parse("2020-01-01") },
				{ Name: "Paul", Id: 4, BirthDate: Date.parse("2010-01-01T00:00:00.000Z"), CreateDate: Date.parse("2020-01-01") }
			]);
			await peopleDB.saveChanges();

			const result = await peopleDB.People.find(1);
			const person = result.asKoObservable();

			let subscriberCalls = 0;
			person.BirthDate.subscribe(v => subscriberCalls++);

			person.BirthDate(now1);
			expect(subscriberCalls).toBe(1);

			person.BirthDate(now1);
			person.BirthDate(now2);
			expect(subscriberCalls).toBe(1);

			subscriberCalls = 0;
			person.CreateDate.subscribe(v => subscriberCalls++);

			person.CreateDate(now1);
			expect(subscriberCalls).toBe(2);

			person.CreateDate(now2);
			expect(subscriberCalls).toBe(4);

			done();
		});
	});
});

require("./testbase");
describe("JayData aggregation tests", () => {
	test("group by with order by", done => {
		expect.assertions(9);
		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "$data.Guid", key: true, computed: true},
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
			queryCache: true,
		});

		todoDB.onReady(function () {
			todoDB.People.addMany([
				{Name: "Peter", Id: 1},
				{Name: "Alice", Id: 2},
				{Name: "Bob", Id: 3},
				{Name: "Paul", Id: 4}
			]);
			todoDB.saveChanges().then(function () {
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
				todoDB.saveChanges().then(function () {
					todoDB.People
						.orderByDescending("it.Name")
						.map(function (person) {
							return {Person: person, TaskCount: person.Todos.Id.count()};
						})
						.groupBy("it.Id")
						.withInlineCount()
						.skip(0)
						.take(3)
						.toArray().then(function (r) {
						expect(r).toHaveLength(3);
						expect(r.totalCount).toEqual(4);
						expect(r[0].Person.Name).toEqual("Peter");
						expect(r[0].TaskCount).toEqual(3);
						expect(r[1].Person.Name).toEqual("Paul");
						expect(r[1].TaskCount).toEqual(2);
						expect(r[2].Person.Name).toEqual("Bob");
						expect(r[2].TaskCount).toEqual(2);
						expect(true).toBe(true);
						done();
					});
				});
			});
		});
	});

	test("aggregation with group by", done => {
		expect.assertions(5);
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

		aggregationDB.onReady(async function () {
			aggregationDB.Items.addMany([
				{Value: 0, Type: "A"},
				{Value: 1, Type: "A"},
				{Value: 2, Type: "A"},
				{Value: 4, Type: "B"},
				{Value: 8, Type: "B"}
			]);
			await aggregationDB.saveChanges();
			let r = await aggregationDB.Items.map(it => it.Value.sum()).groupBy("it.Type").toArray();
			expect(Array.from(r)).toStrictEqual([3, 12]);
			r = await aggregationDB.Items.map(it => it.Value.avg()).groupBy("it.Type").toArray();
			expect(Array.from(r)).toEqual([1, 6]);
			r = await aggregationDB.Items.map(it => it.Value.min()).groupBy("it.Type").toArray();
			expect(Array.from(r)).toEqual([0, 4]);
			r = await aggregationDB.Items.map(it => it.Value.max()).groupBy("it.Type").toArray();
			expect(Array.from(r)).toEqual([2, 8]);
			r = await aggregationDB.Items.map(it => it.Value.count()).groupBy("it.Type").toArray();
			expect(Array.from(r)).toEqual([3, 2]);
			done();
		});
	});
	test("todo group by", done => {
		expect.assertions(6);

		const Todo = $data.Entity.extend("Todo", {
			Id: {type: "$data.Guid", key: true, computed: true},
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
			await todoDB.saveChanges();

			let r = await todoDB.Todos
				.include("Person")
				.filter("it.Task.contains('Task')")
				.orderByDescending("it.Person.Name")
				.map(function (todo) {
					return {Id: todo.PersonId, Name: todo.Person.Name, Tasks: todo.Id.count()};
				})
				.groupBy("it.Person.Id")
				.withInlineCount()
				.skip(0)
				.take(5)
				.toArray();
			expect(Array.from(r).map(e => e.Tasks)).toEqual([3, 2]);
			expect(r).toHaveLength(2);
			expect(r.totalCount).toEqual(9);
			r = await todoDB.Todos
				.include("Person")
				.filter("it.Task.contains('Task')")
				.orderByDescending("it.Person.Name")
				.map(function (todo) {
					return {Id: todo.PersonId, Name: todo.Person.Name, Tasks: todo.Id.count()};
				})
				.groupBy("it.Person.Id")
				.withInlineCount()
				.toArray();
			expect(Array.from(r).map(e => e.Tasks)).toEqual([3, 2, 2, 2]);
			expect(r).toHaveLength(4);
			expect(r.totalCount).toEqual(9);
			done();
		});
	});

	test("aggregation", done => {
		expect.assertions(5);

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

		aggregationDB.onReady(async function () {
			aggregationDB.Items.addMany([
				{Value: 0, Type: "A"},
				{Value: 1, Type: "A"},
				{Value: 2, Type: "A"},
				{Value: 4, Type: "B"},
				{Value: 8, Type: "B"}
			]);
			aggregationDB.saveChanges();
			let r = await aggregationDB.Items.map(it => it.Value.sum()).toArray();
			expect(r[0]).toEqual(15);
			r = await aggregationDB.Items.map(it => it.Value.avg()).toArray();
			expect(r[0]).toEqual(3);
			r = await aggregationDB.Items.map(it => it.Value.min()).toArray();
			expect(r[0]).toEqual(0);
			r = await aggregationDB.Items.map(it => it.Value.max()).toArray();
			expect(r[0]).toEqual(8);
			r = await aggregationDB.Items.map(it => it.Value.count()).toArray();
			expect(r[0]).toEqual(5);
			done();
		});
	});
});



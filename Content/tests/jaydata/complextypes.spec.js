require("./testbase");

describe("JayData complex type tests", () => {
	test("map with complex fields", done => {
		expect.assertions(2);
		const Location = $data.Entity.extend("Location", {
			City: { type: String },
			Country: { type: String }
		});
		const Todo = $data.Entity.extend("Todo", {
			Id: { type: "int", key: true, computed: true },
			Task: { type: String, required: true, maxLength: 200 },
			Status: { type: String },
			DueDate: { type: Date },
			Completed: { type: Boolean },
			Location: { type: Location }
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: { type: $data.EntitySet, elementType: Todo }
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(() => {
			todoDB.Todos.addMany([
				{ Task: "Task 1", Completed: true, Location: { City: "Budapest", Country: "Hungary" } },
				{ Task: "Task 2", Location: { City: "Debrecen", Country: "Hungary" } },
				{ Task: "Task 3", Completed: true, Location: { City: "Sulzbach", Country: "Germany" } },
				{ Task: "Task 4", Location: { City: "Stuttgart", Country: "Germany" } }
			]);
			todoDB.saveChanges(() => {
				todoDB.Todos
					.filter(x => x.Completed === true && x.Location.City.length > 0)
					.map(x => x.Location.City)
					.orderBy(x => x.Location.City)
					.toArray(results => {
						expect(results[0]).toBe("Budapest");
						expect(results[1]).toBe("Sulzbach");
						done();
					});
			});
		});
	}, 10000);

	test("delete after changed complex fields", done => {
		expect.assertions(2);
		const Location = $data.Entity.extend("Location", {
			City: { type: String },
			Country: { type: String }
		});
		const Todo = $data.Entity.extend("Todo", {
			Id: { type: "int", key: true, computed: true },
			Task: { type: String, required: true, maxLength: 200 },
			Status: { type: String },
			DueDate: { type: Date },
			Completed: { type: Boolean },
			Location: { type: Location }
		});

		const TodoDatabase = $data.EntityContext.extend("TodoDatabase", {
			Todos: { type: $data.EntitySet, elementType: Todo }
		});

		const todoDB = new TodoDatabase({
			provider: "webSql",
			dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables,
			queryCache: true
		});

		todoDB.onReady(() => {
			todoDB.Todos.addMany([
				{ Task: "Task 1", Completed: true, Location: { City: "Budapest", Country: "Hungary" } },
				{ Task: "Task 2", Location: { City: "Debrecen", Country: "Hungary" } },
				{ Task: "Task 3", Completed: true, Location: { City: "Sulzbach", Country: "Germany" } },
				{ Task: "Task 4", Location: { City: "Stuttgart", Country: "Germany" } }
			]);
			todoDB.saveChanges(() => {
				todoDB.Todos
					.orderBy(x => x.Task)
					.take(1)
					.toArray(results => {
						results[0].Location.City = "Berlin";
						todoDB.Todos.remove(results[0]);
						todoDB.saveChanges().then(() => {
							todoDB.Todos
								.orderBy(x => x.Task)
								.take(1)
								.toArray(results => {
									expect(results[0].Location.City).not.toBe("Berlin");
									expect(results[0].Location.City).toBe("Debrecen");
									done();
								});
						});
					});
			});
		});
	});

});


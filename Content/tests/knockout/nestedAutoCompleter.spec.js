require("./testbase");
require("../../../Plugins/Main/Content/ts/knockout.custom.select2");
let data = [
	{
		id: "1",
		item: {
			ParentId: null,
		},
	},
	{
		id: "2",
		item: {
			ParentId: null,
		}
	},
	{
		id: "3",
		item: {
			ParentId: "1",
		}
	},
	{
		id: "4",
		item: {
			ParentId: "3",
		}
	},
	{
		id: "5",
		item: {
			ParentId: "1",
		}
	},
	{
		id: "6",
		item: {
			ParentId: "4",
		}
	}
];
let ids;
const property = "ParentId";
const childsProperty = "childs";
const select2autocompleter = ko.bindingHandlers.select2autocompleter;

describe("select2autocompleter.addChildsToParent add children to parent", () => {
	beforeEach(() => {
		ids = select2autocompleter.getAllIds(data);
		select2autocompleter.addChildsToParent(data, ids, property);
		data = data.filter(obj => obj.item.ParentId === null);
		select2autocompleter.addDepthLevel(data);
	});

	test("Check if childs are added correctly", () => {
		expect(data[0].childs).toHaveLength(2);
		expect(data[0].childs[0].childs).toHaveLength(1);
		expect(data[0].childs[0].childs[0].childs).toHaveLength(1);
		expect(data[0].childs[1].hasOwnProperty(childsProperty)).toBe(false);
		expect(data[1].hasOwnProperty(childsProperty)).toBe(false);
	});

	test("ParentId match Id", () => {
		expect(data[0].id).toEqual(data[0].childs[0].item[property]);
		expect(data[0].id).toEqual(data[0].childs[1].item[property]);
		expect(data[0].childs[0].id).toEqual(data[0].childs[0].childs[0].item[property]);
		expect(data[0].childs[0].childs[0].id).toEqual(data[0].childs[0].childs[0].childs[0].item[property]);
	});

	test("Add depth property", () => {
		expect(data[0].depth).toBe(0);
		expect(data[0].childs[0].depth).toBe(1);
		expect(data[0].childs[1].depth).toBe(1);

		expect(data[0].childs[0].childs[0].depth).toBe(2);
		expect(data[0].childs[0].childs[0].childs[0].depth).toBe(3);

		expect(data[1].depth).toBe(0);
	});

	test("flatten the array", () => {
		expect(data).toHaveLength(2);
		const flatArray = select2autocompleter.treeToFlat(data);
		expect(flatArray).toHaveLength(6);
	});
});



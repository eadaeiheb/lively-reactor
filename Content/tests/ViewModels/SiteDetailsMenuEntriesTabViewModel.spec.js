require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/SiteDetailsMenuEntriesTabViewModel");

const createMenuEntryGroups = () => [
	{
		"id": "Dashboard",
		"title": "Dashboard",
		"priority": 2147483636,
		"iconClass": "zmdi zmdi-home",
		"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
			Category: null,
			CreateDate: "2024-04-12T08:42:25.480Z",
			CreateUser: "MenuEntryService",
			DomainId: "00000000-0000-0000-0000-000000000000",
			IconClass: "zmdi zmdi-home",
			Id: "53926d7a-6b22-4ceb-b668-b150008f7cf1",
			ModifyDate: "2024-04-16T07:41:01.203Z",
			ModifyUser: "default.1",
			Priority: 2147483636,
			Title: "Dashboard",
		}).asKoObservable()
	},
	{
		"id": "Notes",
		"title": "Notes",
		"priority": 2147483635,
		"iconClass": "zmdi zmdi-comment-text",
		"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
			Category: null,
			CreateDate: "2024-04-12T08:42:25.693Z",
			CreateUser: "MenuEntryService",
			DomainId: "00000000-0000-0000-0000-000000000000",
			IconClass: "zmdi zmdi-comment-text",
			Id: "ea1c7636-3b36-443d-ad79-b150008f7d3b",
			ModifyDate: "2024-04-16T07:35:23.470Z",
			ModifyUser: "default.1",
			Priority: 2147483635,
			Title: "Notes",
		}).asKoObservable()
	},
	{
		"id": "AdHocServiceOrder",
		"title": "Ad hoc service order",
		"priority": 2147483634,
		"iconClass": "zmdi zmdi-plus-circle",
		"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
			"Category": null,
			"CreateDate": "2024-04-12T08:42:26.200Z",
			"CreateUser": "MenuEntryService",
			"DomainId": "00000000-0000-0000-0000-000000000000",
			"IconClass": "zmdi zmdi-plus-circle",
			"Id": "45f72fe9-4507-4893-b136-b150008f7dd4",
			"ModifyDate": "2024-04-15T15:15:43.440Z",
			"ModifyUser": "default.1",
			"Priority": 2147483633,
			"Title": "AdHocServiceOrder"
		}).asKoObservable()
	},
	{
		"id": "ContactsTitle",
		"title": "Contacts",
		"priority": 2147483608,
		"iconClass": "zmdi zmdi-accounts-alt",
		"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
			"Category": null,
			"CreateDate": "2024-04-12T08:42:25.697Z",
			"CreateUser": "MenuEntryService",
			"DomainId": "00000000-0000-0000-0000-000000000000",
			"IconClass": "zmdi zmdi-accounts-alt",
			"Id": "e9ac0bee-cc40-46ae-b71b-b150008f7d3d",
			"ModifyDate": "2024-04-16T07:43:06.950Z",
			"ModifyUser": "default.1",
			"Priority": 2147483608,
			"Title": "ContactsTitle"
		}).asKoObservable()
	},
	{
		"id": "Administration",
		"title": "Administration",
		"priority": -98,
		"iconClass": "zmdi zmdi-settings",
		"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
			"Category": null,
			"CreateDate": "2024-04-12T08:42:25.513Z",
			"CreateUser": "MenuEntryService",
			"DomainId": "00000000-0000-0000-0000-000000000000",
			"IconClass": "zmdi zmdi-settings",
			"Id": "e618848c-8604-4f0f-8c6c-b150008f7d03",
			"ModifyDate": "2024-04-16T07:35:23.503Z",
			"ModifyUser": "default.1",
			"Priority": -98,
			"Title": "Administration"
		}).asKoObservable(),
		items: ko.observableArray([
			{
				"title": "Flow rules",
				"priority": 100,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.910Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": null,
					"Id": "4f6b55ce-21bc-4367-86e7-b150008f7d7d",
					"ModifyDate": "2024-04-12T08:42:25.910Z",
					"ModifyUser": "MenuEntryService",
					"Priority": 100,
					"Title": "FlowRule"
				}).asKoObservable()
			},
			{
				"title": "Flow processing",
				"priority": 91,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.907Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": null,
					"Id": "1c4e71ce-53ee-41af-a59c-b150008f7d7c",
					"ModifyDate": "2024-04-15T15:25:03.227Z",
					"ModifyUser": "default.1",
					"Priority": 91,
					"Title": "FlowProcessing"
				}).asKoObservable()
			},
			{
				"title": "User administration",
				"priority": 90,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.533Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": null,
					"Id": "8095d4c6-df5f-43e7-b983-b150008f7d0b",
					"ModifyDate": "2024-04-12T08:42:25.533Z",
					"ModifyUser": "MenuEntryService",
					"Priority": 90,
					"Title": "UserAdministrationTitle"
				}).asKoObservable()
			},
			{
				"title": "User groups",
				"priority": 85,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.557Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": "zmdi zmdi-alert-circle-o",
					"Id": "3437e1a7-a45e-4927-9bde-b150008f7d11",
					"ModifyDate": "2024-04-15T08:41:48.313Z",
					"ModifyUser": "default.1",
					"Priority": 85,
					"Title": "UserGroups"
				}).asKoObservable()
			},
			{
				"title": "Roles & permissions",
				"priority": 80,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.580Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": null,
					"Id": "2f2b2af8-ec21-446b-a3e4-b150008f7d18",
					"ModifyDate": "2024-04-12T08:42:25.580Z",
					"ModifyUser": "MenuEntryService",
					"Priority": 80,
					"Title": "RolesAndPermissionsTitle"
				}).asKoObservable()
			},
			{
				"title": "Background services",
				"priority": 53,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.607Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": "zmdi zmdi-alarm zmdi-hc-fw",
					"Id": "da1d5d5e-184f-48fb-b321-b150008f7d20",
					"ModifyDate": "2024-04-15T08:41:48.327Z",
					"ModifyUser": "default.1",
					"Priority": 53,
					"Title": "BackgroundServices"
				}).asKoObservable()
			},
			{
				"title": "Application logs",
				"priority": 52,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.633Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": "zmdi zmdi-alert-circle-o",
					"Id": "808a9952-ddab-4728-8a4c-b150008f7d28",
					"ModifyDate": "2024-04-15T08:41:48.333Z",
					"ModifyUser": "default.1",
					"Priority": 52,
					"Title": "Logs"
				}).asKoObservable()
			},
			{
				"title": "Transactions",
				"priority": 51,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.637Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": "zmdi zmdi-view-list",
					"Id": "b93da110-99e3-46ad-8cfb-b150008f7d2b",
					"ModifyDate": "2024-04-15T08:41:48.337Z",
					"ModifyUser": "default.1",
					"Priority": 51,
					"Title": "Transactions"
				}).asKoObservable()
			},
			{
				"title": "Scheduler administration",
				"priority": 50,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:31.300Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": null,
					"Id": "b137b305-85fb-452f-bfc9-b150008f7e1e",
					"ModifyDate": "2024-04-12T08:42:31.300Z",
					"ModifyUser": "MenuEntryService",
					"Priority": 50,
					"Title": "SchedulerAdministration"
				}).asKoObservable()
			},
			{
				"title": "E-mail queue",
				"priority": 40,
				"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
					"Category": "Administration",
					"CreateDate": "2024-04-12T08:42:25.647Z",
					"CreateUser": "MenuEntryService",
					"DomainId": "00000000-0000-0000-0000-000000000000",
					"IconClass": "zmdi zmdi-email",
					"Id": "bcadfdd7-87d5-4c68-adfc-b150008f7d2d",
					"ModifyDate": "2024-04-15T08:41:48.343Z",
					"ModifyUser": "default.1",
					"Priority": 40,
					"Title": "EmailMessages"
				}).asKoObservable()
			},
		])
	},
	{
		"id": "Help",
		"title": "Help",
		"priority": -110,
		"iconClass": "zmdi zmdi-help",
		"dbMenuEntry": window.database.Main_MenuEntry.Main_MenuEntry.create({
			"Category": "Help",
			"CreateDate": "2024-04-12T08:42:25.687Z",
			"CreateUser": "MenuEntryService",
			"DomainId": "00000000-0000-0000-0000-000000000000",
			"IconClass": null,
			"Id": "5dc44809-6614-4fe0-8274-b150008f7d3a",
			"ModifyDate": "2024-04-12T08:42:25.687Z",
			"ModifyUser": "MenuEntryService",
			"Priority": -2147483638,
			"Title": "ThirdPartySoftware"
		}).asKoObservable()
	}
]

it("sets priority correctly", async () => {
	await window.Helper.Database.initialize();
	const viewModel = new window.Main.ViewModels.SiteDetailsMenuEntriesTabViewModel();
	viewModel.menuEntryGroups(createMenuEntryGroups())
	{
		const firstElem = viewModel.menuEntryGroups()[0]

		viewModel.menuEntryGroups()[0] = viewModel.menuEntryGroups()[1];
		viewModel.menuEntryGroups()[1] = firstElem;

		viewModel.afterMenuEntryMove({
			item: firstElem,
			sourceIndex: 0,
			targetIndex: 1,
			sourceParent: undefined,
			targetParent: viewModel.menuEntryGroups
		});

		expect(viewModel.menuEntryGroups()[0].dbMenuEntry.Priority()).toEqual(2147483636)
		expect(viewModel.menuEntryGroups()[1].dbMenuEntry.Priority()).toEqual(2147483635)
	}

	viewModel.menuEntryGroups(createMenuEntryGroups())
	{
		const firstElem = viewModel.menuEntryGroups()[0]
		const secondElem = viewModel.menuEntryGroups()[1]
		const thirdElem = viewModel.menuEntryGroups()[2]
		const fourthElem = viewModel.menuEntryGroups()[3]
		viewModel.menuEntryGroups()[0] = firstElem;
		viewModel.menuEntryGroups()[1] = secondElem;
		viewModel.menuEntryGroups()[2] = fourthElem;
		viewModel.menuEntryGroups()[3] = thirdElem;

		viewModel.afterMenuEntryMove({
			item: thirdElem,
			sourceIndex: 2,
			targetIndex: 3,
			sourceParent: undefined,
			targetParent: viewModel.menuEntryGroups
		});

		expect(viewModel.menuEntryGroups()[2].dbMenuEntry.Priority()).toEqual(2147483608)
		expect(viewModel.menuEntryGroups()[3].dbMenuEntry.Priority()).toEqual(-97)
	}

	viewModel.menuEntryGroups(createMenuEntryGroups())
	{
		const firstElem = viewModel.menuEntryGroups()[4].items()[0];
		const secondElem = viewModel.menuEntryGroups()[4].items()[1];
		expect(firstElem.dbMenuEntry.Priority()).toEqual(100)
		expect(secondElem.dbMenuEntry.Priority()).toEqual(91)

		viewModel.menuEntryGroups()[4].items()[0] = secondElem
		viewModel.menuEntryGroups()[4].items()[1] = firstElem
		viewModel.afterMenuEntryMove({
			item: secondElem,
			sourceIndex: 1,
			targetIndex: 0,
			sourceParent: undefined,
			targetParent: viewModel.menuEntryGroups()[4].items
		});

		expect(viewModel.menuEntryGroups()[4].items()[0].dbMenuEntry.Priority()).toEqual(101)
		expect(viewModel.menuEntryGroups()[4].items()[1].dbMenuEntry.Priority()).toEqual(100)
	}

	viewModel.menuEntryGroups(createMenuEntryGroups())

	{
		expect(viewModel.menuEntryGroups()[4].items()[5].dbMenuEntry.Priority()).toEqual(53)
		expect(viewModel.menuEntryGroups()[4].items()[6].dbMenuEntry.Priority()).toEqual(52)
		expect(viewModel.menuEntryGroups()[4].items()[7].dbMenuEntry.Priority()).toEqual(51)
		expect(viewModel.menuEntryGroups()[4].items()[8].dbMenuEntry.Priority()).toEqual(50)
		let eighthElem = viewModel.menuEntryGroups()[4].items()[7];
		let ninthElem = viewModel.menuEntryGroups()[4].items()[8];
		let tenthElem = viewModel.menuEntryGroups()[4].items()[9];

		viewModel.menuEntryGroups()[4].items()[7] = ninthElem;
		viewModel.menuEntryGroups()[4].items()[8] = eighthElem;
		viewModel.menuEntryGroups()[4].items()[9] = tenthElem;
		viewModel.afterMenuEntryMove({
			item: ninthElem,
			sourceIndex: 8,
			targetIndex: 7,
			sourceParent: undefined,
			targetParent: viewModel.menuEntryGroups()[4].items
		});

		expect(viewModel.menuEntryGroups()[4].items()[5].dbMenuEntry.Priority()).toEqual(54)
		expect(viewModel.menuEntryGroups()[4].items()[6].dbMenuEntry.Priority()).toEqual(53)
		expect(viewModel.menuEntryGroups()[4].items()[7].dbMenuEntry.Priority()).toEqual(52)
		expect(viewModel.menuEntryGroups()[4].items()[8].dbMenuEntry.Priority()).toEqual(51)

		const seventhElem = viewModel.menuEntryGroups()[4].items()[6];
		eighthElem = viewModel.menuEntryGroups()[4].items()[7];
		ninthElem = viewModel.menuEntryGroups()[4].items()[8];
		tenthElem = viewModel.menuEntryGroups()[4].items()[9];
		viewModel.menuEntryGroups()[4].items()[6] = ninthElem;
		viewModel.menuEntryGroups()[4].items()[7] = seventhElem;
		viewModel.menuEntryGroups()[4].items()[8] = eighthElem;
		viewModel.menuEntryGroups()[4].items()[9] = tenthElem;
		viewModel.afterMenuEntryMove({
			item: ninthElem,
			sourceIndex: 7,
			targetIndex: 6,
			sourceParent: undefined,
			targetParent: viewModel.menuEntryGroups()[4].items
		});

		expect(viewModel.menuEntryGroups()[4].items()[5].dbMenuEntry.Priority()).toEqual(55)
		expect(viewModel.menuEntryGroups()[4].items()[6].dbMenuEntry.Priority()).toEqual(54)
		expect(viewModel.menuEntryGroups()[4].items()[7].dbMenuEntry.Priority()).toEqual(53)
		expect(viewModel.menuEntryGroups()[4].items()[8].dbMenuEntry.Priority()).toEqual(52)
	}

});
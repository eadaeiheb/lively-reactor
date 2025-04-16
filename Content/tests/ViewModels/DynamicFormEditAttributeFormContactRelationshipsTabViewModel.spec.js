require("../testbase");
require("../JaydataDbModel");
require("../../../Plugins/Crm.AttributeForms/Content/ts/OfflineModel");
require("../../../node_modules/knockout.validation/dist/knockout.validation");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../node_modules/knockout-punches/knockout.punches");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Main/Content/ts/knockout.custom.validation");
const DynamicFormEditViewModel = require("../../../Plugins/Crm.DynamicForms/Content/ts/DynamicFormEditViewModel").DynamicFormEditViewModel;
const DynamicFormEditAttributeFormContactRelationshipsTabViewModel = require("../../../Plugins/Crm.AttributeForms/Content/ts/DynamicFormEditAttributeFormContactRelationshipsTabViewModel").DynamicFormEditAttributeFormContactRelationshipsTabViewModel;
require("../../../Plugins/Main/Content/ts/helper/Helper.String");
require("../../../Plugins/Main/Content/ts/helper/Helper.User");

describe("DynamicFormEditAttributeFormContactRelationshipsTabViewModel", () => {

    beforeEach(async () => {
        await window.Helper.Database.initialize();
    });

    const initViewModel = (formContactType = "Company") => {
        const editViewModel = new DynamicFormEditViewModel()
        const form = window.database.CrmDynamicForms_DynamicForm.defaultType.create().asKoObservable();
        form.CategoryKey("AttributeForm");
        form.ExtensionValues().ContactType(formContactType)
        editViewModel.form = ko.observable(form);
        const relationshipsTabViewModel = new DynamicFormEditAttributeFormContactRelationshipsTabViewModel(editViewModel);
        relationshipsTabViewModel.contactTypeRelationshipGroups([
            {
                "contactType": "Installation",
                items: ko.observableArray([])
            },
            {
                "contactType": "Company",
                items: ko.observableArray([])
            },
            {
                "contactType": "ServiceObject",
                items: ko.observableArray([])
            }
        ]);
        relationshipsTabViewModel.createRelationship();
        return relationshipsTabViewModel;
    }
   
    describe("validation", () => {

        test("validates company assignment criteria", async () => {
            const relationshipsTabViewModel = initViewModel()
            window.database.add = jest.fn();

            relationshipsTabViewModel.contactTypeRelationship().CompanyTypeKey(null)
            relationshipsTabViewModel.contactTypeRelationship().CountryKey(null)
            relationshipsTabViewModel.contactTypeRelationship().RegionKey(null)
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).not.toHaveBeenCalled();

            relationshipsTabViewModel.contactTypeRelationship().CompanyTypeKey("some value")
            relationshipsTabViewModel.contactTypeRelationship().CountryKey(null)
            relationshipsTabViewModel.contactTypeRelationship().RegionKey(null)
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();

            relationshipsTabViewModel.contactTypeRelationship().CompanyTypeKey(null)
            relationshipsTabViewModel.contactTypeRelationship().CountryKey("some value")
            relationshipsTabViewModel.contactTypeRelationship().RegionKey(null)
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();

            relationshipsTabViewModel.contactTypeRelationship().CompanyTypeKey(null)
            relationshipsTabViewModel.contactTypeRelationship().CountryKey(null)
            relationshipsTabViewModel.contactTypeRelationship().RegionKey("some value")
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();
        });

        test("validates installation assignment criteria", async () => {
            const relationshipsTabViewModel = initViewModel("Installation")
            window.database.add = jest.fn();

            relationshipsTabViewModel.contactTypeRelationship().InstallationTypeKey(null)
            relationshipsTabViewModel.contactTypeRelationship().ManufacturerKey(null)
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).not.toHaveBeenCalled();


            relationshipsTabViewModel.contactTypeRelationship().InstallationTypeKey("some value")
            relationshipsTabViewModel.contactTypeRelationship().ManufacturerKey(null)
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();

            relationshipsTabViewModel.contactTypeRelationship().InstallationTypeKey(null)
            relationshipsTabViewModel.contactTypeRelationship().ManufacturerKey("some value")
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();

        });

        test("validates service object assignment criteria", async () => {
            const relationshipsTabViewModel = initViewModel("ServiceObject")
            window.database.add = jest.fn();

            relationshipsTabViewModel.contactTypeRelationship().ServiceObjectCategoryKey(null)
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).not.toHaveBeenCalled();

            relationshipsTabViewModel.contactTypeRelationship().ServiceObjectCategoryKey("some value")
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();

        });

        test("doesn't allow duplicate relationships", () => {
            const relationshipsTabViewModel = initViewModel("ServiceObject")
            window.database.add = jest.fn();
            relationshipsTabViewModel.contactTypeRelationship().ServiceObjectCategoryKey("some value")
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).toHaveBeenCalled();
            window.database.add.mockClear();
            relationshipsTabViewModel.contactTypeRelationship().ServiceObjectCategoryKey("some value")
            relationshipsTabViewModel.addRelationship();
            expect(window.database.add).not.toHaveBeenCalled();
        });

    });
});
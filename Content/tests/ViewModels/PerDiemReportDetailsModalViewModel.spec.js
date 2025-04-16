require("../testbase");
window.moment = require("moment");
require("../../../Plugins/Main/Content/ts/ViewModelBase");
require("../../../Plugins/Crm.PerDiem/Content/ts/PerDiemReportDetailsModalViewModel");

describe("PerDiemReportDetailsModalViewModelTests", () => {
	test("Report entries are grouped correctly", () => {
		if (!Object.entries) {
			Object.entries = function (obj) {
				const ownProps = Object.keys(obj);
				let i = ownProps.length;
				const resArray = new Array(i); // preallocate the Array
				while (i--)
					resArray[i] = [ownProps[i], obj[ownProps[i]]];

				return resArray;
			};
		}

		const viewModel = new window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel();
		viewModel.reportEntries = ko.wrap.fromJS([
			{
				Date: new Date(2021, 0, 1),
				ResponsibleUser: "default.1"
			},
			{
				Date: new Date(2021, 0, 1),
				ResponsibleUser: "default.1"
			},
			{
				Date: new Date(2021, 0, 2),
				ResponsibleUser: "default.1"
			},
			{
				Date: new Date(2021, 0, 2),
				ResponsibleUser: "default.1"
			}
		]);

		const result = viewModel.getGroupedReportEntries();

		expect(result).toHaveLength(2);
	});
});

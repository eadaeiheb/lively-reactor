(function() {
	window.Crm = window.Crm ?? {};
	window.Crm.Service = window.Crm.Service ?? {};
	window.Crm.Service.Settings = window.Crm.Service.Settings ?? {
		"AdHoc": {
			"AdHocNumberingSequenceName": "SMS.ServiceOrderHead.AdHoc"
		},
		"Email": {
			"ClosedByRecipientForReplenishmentReport": false,
			"DispatchReportRecipients": "",
			"ReplenishmentOrderRecipients": "default@example.com",
			"SendDispatchFollowUpOrderNotificationEmails": false,
			"SendDispatchNotificationEmails": false,
			"SendDispatchRejectNotificationEmails": false,
			"SendDispatchReportToDispatcher": false,
			"SendDispatchReportsOnCompletion": true,
			"SendServiceOrderReportToDispatchers": false,
			"SendServiceOrderReportsOnCompletion": false
		},
		"Export": {
			"ExportDispatchReportsControlFileContent": "\"Controlfile\"",
			"ExportDispatchReportsControlFileExtension": "ctl",
			"ExportDispatchReportsControlFilePattern": "{Date-yyyy}{Date-MM}{Date-dd}_{DispatchId}",
			"ExportDispatchReportsFilePattern": "{Date-yyyy}{Date-MM}{Date-dd}_{DispatchId}",
			"ExportDispatchReportsOnCompletion": false,
			"ExportDispatchReportsPath": "\\\\unc\\path\\{Date-yyyy}\\",
			"ExportServiceOrderReportsOnCompletion": false,
			"ExportServiceOrderReportsPath": "",
			"ExportServiceOrderReportsUncDomain": "",
			"ExportServiceOrderReportsUncPassword": "",
			"ExportServiceOrderReportsUncUser": ""
		},
		"PosNoGenerationMethod": "MixedMaterialAndTimes",
		"Service": {
			"Dispatch": {
				"Requires": {
					"CustomerSignature": true
				},
				"Show": {
					"EmptyTimesOrMaterialsWarning": "WARN",
					"PrivacyPolicy": true
				}
			},
			"Dispatches": {
				"Show": {
					"Closed": true
				}
			}
		},
		"ServiceCase": {
			"OnlyInstallationsOfReferencedCustomer": true,
			"Signature": {
				"Enable": {
					"Originator": true,
					"Technician": true
				}
			}
		},
		"ServiceContract": {
			"CreateMaintenanceOrderTimeSpanDays": "30",
			"MaintenanceOrderGenerationMode": "OrderPerInstallation",
			"MaintenancePlan": {
				"AvailableTimeUnits": "Year,Quarter,Month,Week,Day"
			},
			"OnlyInstallationsOfReferencedCustomer": true,
			"ReactionTime": {
				"AvailableTimeUnits": "Year,Quarter,Month,Week,Day,Hour"
			}
		},
		"ServiceOrder": {
			"DefaultDuration": "04:00",
			"OnlyInstallationsOfReferencedCustomer": true
		},
		"ServiceOrderDispatch": {
			"ReadGeolocationOnDispatchStart": false,
			"Report": {
				"FooterHeight": "2.5",
				"FooterSpacing": "0.5",
				"HeaderHeight": "4",
				"HeaderSpacing": "0.5"
			},
			"ToggleSingleJob": true
		},
		"ServiceOrderMaterial": {
			"CreateReplenishmentOrderItemsFromServiceOrderMaterial": true,
			"ShowPricesInMobileClient": true
		},
		"ServiceOrderTimePosting": {
			"ClosedTimePostingsHistorySyncPeriod": "7",
			"HiddenItemNos": "",
			"ItemNosWithKilometerSelection": "100017.1",
			"MaxDaysAgo": "7",
			"MinutesInterval": "5",
			"ShowTechnicianSelection": true,
			"ValidItemNosAfterCustomerSignature": "100017.1"
		},
		"ServiceOrderTimes": {
			"ShowPricesInMobileClient": true
		},
		"UserExtension": {
			"OnlyUnusedLocationNosSelectable": true
		}
	};
})();

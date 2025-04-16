namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(10000000000006)]
	public class CreateTables : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM [dbo].[SchemaInfo_Crm_Order]") > 0)
			{
				return;
			}

			Database.ExecuteNonQuery(@"
CREATE TABLE [CRM].[Order](
	[BusinessPartnerContactKeyOld] [int] NULL,
	[BusinessPartnerName] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[BusinessPartnerAddressKeyOld] [int] NULL,
	[BusinessPartnerStreet] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[BusinessPartnerZipCode] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[BusinessPartnerCity] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[DeliveryAddressKeyOld] [int] NULL,
	[DeliveryAddressName] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[DeliveryAddressStreet] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[DeliveryAddressZipCode] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[DeliveryAddressCity] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[BillAddressKeyOld] [int] NULL,
	[BillAddressName] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[BillAddressStreet] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[BillAddressZipCode] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[BillAddressCity] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[OrderDate] [datetime] NOT NULL,
	[DeliveryDate] [date] NULL,
	[ResponsibleUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL,
	[Price] [decimal] (19,4) NOT NULL CONSTRAINT [DF__Order__Price__4D1564AE] DEFAULT ((0)),
	[Discount] [decimal] (19,4) NOT NULL CONSTRAINT [DF__Order__Discount__4E0988E7] DEFAULT ((0)),
	[DiscountType] [int] NOT NULL CONSTRAINT [DF__Order__DiscountT__4EFDAD20] DEFAULT ((1)),
	[PrivateDescription] [nvarchar] (1020) COLLATE Latin1_General_CI_AS NULL,
	[PublicDescription] [nvarchar] (1020) COLLATE Latin1_General_CI_AS NULL,
	[Representative] [nvarchar] (256) COLLATE Latin1_General_CI_AS NULL,
	[Comission] [nvarchar] (256) COLLATE Latin1_General_CI_AS NULL,
	[CustomerOrderNumber] [nvarchar] (256) COLLATE Latin1_General_CI_AS NULL,
	[StatusKey] [nvarchar] (40) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF__Order__StatusKey__4FF1D159] DEFAULT ('Open'),
	[CurrencyKey] [nvarchar] (40) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF__Order__CurrencyK__50E5F592] DEFAULT ('Open'),
	[IsExported] [bit] NOT NULL CONSTRAINT [DF__Order__IsExporte__51DA19CB] DEFAULT ((0)),
	[OrderType] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF__Order__OrderType__53C2623D] DEFAULT ('Order'),
	[ExportDate] [datetime] NULL,
	[Signature] [nvarchar] (MAX) COLLATE Latin1_General_CI_AS NULL,
	[ContactPersonBackup] [nvarchar] (MAX) COLLATE Latin1_General_CI_AS NULL,
	[ContactPersonOld] [int] NULL,
	[CustomEmail] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[CustomFax] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[CommunicationType] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[OrderCategoryKey] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__Order__IsActive__78F3E6EC] DEFAULT ((1)),
	[Visibility] [smallint] NOT NULL CONSTRAINT [DF__Order__Visibilit__0EE3280B] DEFAULT ((2)),
	[DocumentNo] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[BusinessPartnerAddressKey] [uniqueidentifier] NULL,
	[BillAddressKey] [uniqueidentifier] NULL,
	[DeliveryAddressKey] [uniqueidentifier] NULL,
	[BusinessPartnerContactKey] [uniqueidentifier] NULL,
	[ContactPerson] [uniqueidentifier] NULL,
	[OrderIdOld] [int] NULL,
	[OrderId] [uniqueidentifier] NOT NULL CONSTRAINT [DF__Order__OrderId__27AED5D5] DEFAULT (newsequentialid()),
	[ProjectKeyOld] [int] NULL,
	[ProjectKey] [uniqueidentifier] NULL,
	[ConfigurationBaseId] [uniqueidentifier] NULL,
	[LegacyId] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[OrderEntryType] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[SignatureDate] [datetime] NULL,
	[SignatureName] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[OrderNo] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[SendConfirmation] [bit] NOT NULL CONSTRAINT [DF__Order__SendConfi__5CACADF9] DEFAULT ((0)),
	[ConfirmationSent] [bit] NOT NULL CONSTRAINT [DF__Order__Confirmat__5E94F66B] DEFAULT ((0)),
	[OfferId] [uniqueidentifier] NULL,
	[SignPrivacyPolicyAccepted] [bit] NOT NULL CONSTRAINT [DF__Order__SignPriva__18777F3D] DEFAULT ((0)),
	[ValidTo] [datetime] NULL,
	[ConfirmationSendingError] [nvarchar] (MAX) COLLATE Latin1_General_CI_AS NULL,
	[IsLocked] [bit] NOT NULL CONSTRAINT [DF__Order__IsLocked__47F18835] DEFAULT ((0)),
	[ReadyForExport] [bit] NOT NULL CONSTRAINT [DF__Order__ReadyForE__48E5AC6E] DEFAULT ((0)),
	[CancelReasonText] [nvarchar] (255) COLLATE Hungarian_CI_AS NULL CONSTRAINT [DF__Order__CancelRea__49D9D0A7] DEFAULT ((0)),
	[CancelReasonCategoryKey] [nvarchar] (20) COLLATE Hungarian_CI_AS NULL CONSTRAINT [DF__Order__CancelRea__4ACDF4E0] DEFAULT ((0))
) ON [PRIMARY]

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [PK_Order] PRIMARY KEY
	CLUSTERED
	(
		[OrderId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_BillAddress] FOREIGN KEY
	(
		[BillAddressKey]
	)
	REFERENCES [CRM].[Address]
	(
		[AddressId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_BusinessPartnerAddress] FOREIGN KEY
	(
		[BusinessPartnerAddressKey]
	)
	REFERENCES [CRM].[Address]
	(
		[AddressId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_BusinessPartnerContact] FOREIGN KEY
	(
		[BusinessPartnerContactKey]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_ConfigurationBaseId] FOREIGN KEY
	(
		[ConfigurationBaseId]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_Contact] FOREIGN KEY
	(
		[ProjectKey]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_ContactPerson] FOREIGN KEY
	(
		[ContactPerson]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_DeliveryAddress] FOREIGN KEY
	(
		[DeliveryAddressKey]
	)
	REFERENCES [CRM].[Address]
	(
		[AddressId]
	)

ALTER TABLE [CRM].[Order] ADD CONSTRAINT [FK_Order_User] FOREIGN KEY
	(
		[ResponsibleUser]
	)
	REFERENCES [CRM].[User]
	(
		[Username]
	)

CREATE TABLE [LU].[CalculationPositionType](
	[CalculationPositionTypeId] [int] NOT NULL IDENTITY (1,1),
	[Value] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[Name] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__Calculati__Favor__526429B0] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF__Calculati__SortO__53584DE9] DEFAULT ((0)),
	[HasPurchasePrice] [bit] NOT NULL CONSTRAINT [DF__Calculati__HasPu__544C7222] DEFAULT ((0)),
	[IsAbsolute] [bit] NOT NULL CONSTRAINT [DF__Calculati__IsAbs__5540965B] DEFAULT ((1)),
	[IsDefault] [bit] NOT NULL CONSTRAINT [DF__Calculati__IsDef__5634BA94] DEFAULT ((0)),
	[IsDiscount] [bit] NOT NULL CONSTRAINT [DF__Calculati__IsDis__5728DECD] DEFAULT ((0)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUCalculationPositionType_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUCalculationPositionType_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUCalculationPositionType_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUCalculationPositionType_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUCalculationPositionType_IsActive] DEFAULT ((1))
) ON [PRIMARY]

ALTER TABLE [LU].[CalculationPositionType] ADD CONSTRAINT [PK__Calculat__0DBAA9EDD82F6E3F] PRIMARY KEY
	CLUSTERED
	(
		[CalculationPositionTypeId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[OrderCategory](
	[OrderCategoryId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [nchar] (2) COLLATE Latin1_General_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__OrderCate__Favor__6B99EBCE] DEFAULT ((0)),
	[SortOrder] [smallint] NULL,
	[Value] [nvarchar] (30) COLLATE Latin1_General_CI_AS NOT NULL,
	[AllowedArticleTypeValues] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[Color] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[AllowedArticleGroupValues] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[CustomerFlags] [nvarchar] (120) COLLATE Latin1_General_CI_AS NULL,
	[AllowNegativeQuantities] [bit] NOT NULL CONSTRAINT [DF__OrderCate__Allow__3A5795F5] DEFAULT ((0)),
	[AllowPositiveQuantities] [bit] NOT NULL CONSTRAINT [DF__OrderCate__Allow__3B4BBA2E] DEFAULT ((1)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUOrderCategory_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUOrderCategory_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUOrderCategory_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUOrderCategory_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUOrderCategory_IsActive] DEFAULT ((1))
) ON [PRIMARY]

CREATE TABLE [LU].[OrderEntryType](
	[OrderEntryTypeId] [int] NOT NULL IDENTITY (1,1),
	[Value] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[Name] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__OrderEntr__Favor__42ECDBF6] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF__OrderEntr__SortO__43E1002F] DEFAULT ((0)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUOrderEntryType_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUOrderEntryType_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUOrderEntryType_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUOrderEntryType_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUOrderEntryType_IsActive] DEFAULT ((1))
) ON [PRIMARY]

ALTER TABLE [LU].[OrderEntryType] ADD CONSTRAINT [PK__OrderEnt__363098C2814CB239] PRIMARY KEY
	CLUSTERED
	(
		[OrderEntryTypeId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[OrderStatus](
	[StatusId] [int] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (64) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NOT NULL,
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL,
	[SortOrder] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUOrderStatus_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUOrderStatus_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUOrderStatus_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUOrderStatus_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUOrderStatus_IsActive] DEFAULT ((1)),
	[Color] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF__OrderStat__Color__522F1F86] DEFAULT ('#9E9E9E')
) ON [PRIMARY]

ALTER TABLE [LU].[OrderStatus] ADD CONSTRAINT [StatusId] PRIMARY KEY
	CLUSTERED
	(
		[StatusId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]


CREATE TABLE [CRM].[OrderItem](
	[Position] [nvarchar] (10) COLLATE Latin1_General_CI_AS NULL,
	[ArticleKeyOld] [int] NULL,
	[ArticleNo] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
	[ArticleDescription] [nvarchar] (150) COLLATE Latin1_General_CI_AS NOT NULL,
	[QuantityValue] [decimal] (21,2) NOT NULL,
	[QuantityUnitKey] [nvarchar] (10) COLLATE Latin1_General_CI_AS NOT NULL,
	[IsCarDump] [bit] NOT NULL,
	[IsSample] [bit] NOT NULL,
	[Price] [decimal] (19,4) NOT NULL CONSTRAINT [DF__OrderItem__Price__4A38F803] DEFAULT ((0)),
	[Discount] [decimal] (19,4) NOT NULL CONSTRAINT [DF__OrderItem__Disco__4B2D1C3C] DEFAULT ((0)),
	[DiscountType] [int] NOT NULL CONSTRAINT [DF__OrderItem__Disco__4C214075] DEFAULT ((1)),
	[IsRemoval] [bit] NOT NULL CONSTRAINT [DF__OrderItem__IsRem__52CE3E04] DEFAULT ((0)),
	[CustomDescription] [nvarchar] (150) COLLATE Latin1_General_CI_AS NULL,
	[IsSerial] [bit] NULL,
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__OrderItem__IsAct__77FFC2B3] DEFAULT ((1)),
	[DeliveryDate] [datetime] NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_OrderItem_CreateDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_OrderItem_CreateUser] DEFAULT (''),
	[ModifyUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_OrderItem_ModifyUser] DEFAULT (''),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_OrderItem_ModifyDate] DEFAULT (getutcdate()),
	[ParentOrderItemKeyOld] [bigint] NULL,
	[ArticleKey] [uniqueidentifier] NULL,
	[OrderItemIdOld] [int] NULL,
	[OrderItemId] [uniqueidentifier] NOT NULL CONSTRAINT [DF__OrderItem__Order__38D961D7] DEFAULT (newsequentialid()),
	[OrderKeyOld] [int] NULL,
	[OrderKey] [uniqueidentifier] NOT NULL,
	[ParentOrderItemKey] [uniqueidentifier] NULL,
	[VariableId] [uniqueidentifier] NULL,
	[IsOption] [bit] NOT NULL CONSTRAINT [DF__OrderItem__IsOpt__3C74E891] DEFAULT ((0)),
	[IsAlternative] [bit] NOT NULL CONSTRAINT [DF__OrderItem__IsAlt__3D690CCA] DEFAULT ((0)),
	[LegacyId] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[IsExported] [bit] NOT NULL CONSTRAINT [DF__OrderItem__IsExp__638EB5B2] DEFAULT ((0)),
	[PurchasePrice] [decimal] (19,5) NULL,
	[IsAccessory] [bit] NOT NULL CONSTRAINT [DF__OrderItem__IsAcc__675F4696] DEFAULT ((0)),
	[CustomArticleNo] [nvarchar] (255) COLLATE Hungarian_CI_AS NULL,
	[AdditionalInformation] [nvarchar] (255) COLLATE Hungarian_CI_AS NULL
) ON [PRIMARY]

ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [PK_OrderItem] PRIMARY KEY
	CLUSTERED
	(
		[OrderItemId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_OrderItem_OrderKey_IsActive] ON [CRM].[OrderItem]
(
	[OrderKey] ASC,
	[IsActive] ASC
)ON [PRIMARY]

ALTER TABLE [CRM].[OrderItem] WITH NOCHECK ADD CONSTRAINT [FK_OrderItem_Article] FOREIGN KEY
	(
		[ArticleKey]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	) 

ALTER TABLE [CRM].[OrderItem] WITH NOCHECK ADD CONSTRAINT [FK_OrderItem_Order] FOREIGN KEY
	(
		[OrderKey]
	)
	REFERENCES [CRM].[Order]
	(
		[OrderId]
	) 

ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [FK_OrderItem_VariableId] FOREIGN KEY
	(
		[VariableId]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	) 


CREATE TABLE [CRM].[OrderUser](
	[OrderKeyOld] [int] NULL,
	[OrderKey] [uniqueidentifier] NOT NULL CONSTRAINT [DF__OrderUser__Order__3D9E16F4] DEFAULT (newsequentialid()),
	[Username] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL
) ON [PRIMARY]

ALTER TABLE [CRM].[OrderUser] ADD CONSTRAINT [PK_OrderUser] PRIMARY KEY
	CLUSTERED
	(
		[OrderKey] ASC
		,[Username] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

ALTER TABLE [CRM].[OrderUser] ADD CONSTRAINT [FK_OrderUser_Order] FOREIGN KEY
	(
		[OrderKey]
	)
	REFERENCES [CRM].[Order]
	(
		[OrderId]
	) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE [CRM].[OrderUser] ADD CONSTRAINT [FK_OrderUser_User] FOREIGN KEY
	(
		[Username]
	)
	REFERENCES [CRM].[User]
	(
		[Username]
	) ON DELETE CASCADE ON UPDATE CASCADE


CREATE TABLE [CRM].[OrderUsergroup](
	[UsergroupKeyOld] [int] NULL,
	[OrderKeyOld] [int] NULL,
	[OrderKey] [uniqueidentifier] NOT NULL,
	[UsergroupKey] [uniqueidentifier] NOT NULL
) ON [PRIMARY]

ALTER TABLE [CRM].[OrderUsergroup] ADD CONSTRAINT [PK_OrderUsergroup] PRIMARY KEY
	CLUSTERED
	(
		[OrderKey] ASC
		,[UsergroupKey] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

ALTER TABLE [CRM].[OrderUsergroup] ADD CONSTRAINT [FK_OrderUsergroup_Order] FOREIGN KEY
	(
		[OrderKey]
	)
	REFERENCES [CRM].[Order]
	(
		[OrderId]
	) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE [CRM].[OrderUsergroup] ADD CONSTRAINT [FK_OrderUsergroup_Usergroup] FOREIGN KEY
	(
		[UsergroupKey]
	)
	REFERENCES [CRM].[Usergroup]
	(
		[UsergroupId]
	) ON DELETE CASCADE ON UPDATE CASCADE

CREATE TABLE [CRM].[CalculationPosition](
	[CalculationPositionId] [uniqueidentifier] NOT NULL CONSTRAINT [DF__Calculati__Calcu__72D0F942] DEFAULT (newsequentialid()),
	[OrderKey] [uniqueidentifier] NOT NULL,
	[CalculationPositionTypeKey] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[PurchasePrice] [decimal] (19,5) NOT NULL CONSTRAINT [DF__Calculati__Purch__73C51D7B] DEFAULT ((0)),
	[Remark] [nvarchar] (4000) COLLATE Latin1_General_CI_AS NULL,
	[SalesPrice] [decimal] (19,5) NOT NULL CONSTRAINT [DF__Calculati__Sales__74B941B4] DEFAULT ((0)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF__Calculati__Creat__75AD65ED] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF__Calculati__Modif__76A18A26] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL,
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL,
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__Calculati__IsAct__7795AE5F] DEFAULT ((1)),
	[LegacyId] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[IsExported] [bit] NOT NULL CONSTRAINT [DF__Calculati__IsExp__797DF6D1] DEFAULT ((0)),
	[IsPercentage] [bit] NOT NULL
) ON [PRIMARY]

ALTER TABLE [CRM].[CalculationPosition] ADD CONSTRAINT [PK__Calculat__C834082B01BAA255] PRIMARY KEY
	CLUSTERED
	(
		[CalculationPositionId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

ALTER TABLE [CRM].[CalculationPosition] ADD CONSTRAINT [FK_CalculationPosition_Order] FOREIGN KEY
	(
		[OrderKey]
	)
	REFERENCES [CRM].[Order]
	(
		[OrderId]
	) ON DELETE CASCADE ON UPDATE CASCADE

CREATE TABLE [LU].[OrderCancelReasonCategory](
	[OrderCancelReasonCategoryId] [int] NOT NULL IDENTITY (1,1),
	[Value] [nvarchar] (20) COLLATE Hungarian_CI_AS NOT NULL,
	[Name] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL,
	[Language] [nvarchar] (2) COLLATE Hungarian_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__OrderCanc__Favor__4DAA618B] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF__OrderCanc__SortO__4E9E85C4] DEFAULT ((0)),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__OrderCanc__IsAct__4F92A9FD] DEFAULT ((1)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF__OrderCanc__Creat__5086CE36] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF__OrderCanc__Modif__517AF26F] DEFAULT (getutcdate()),
	[ModifyUser] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__OrderCanc__Modif__526F16A8] DEFAULT ('Setup'),
	[CreateUser] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__OrderCanc__Creat__53633AE1] DEFAULT ('Setup')
) ON [PRIMARY]

ALTER TABLE [LU].[OrderCancelReasonCategory] ADD CONSTRAINT [PK__OrderCan__259942B5247C1A09] PRIMARY KEY
	CLUSTERED
	(
		[OrderCancelReasonCategoryId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]
");
			
			Database.ExecuteNonQuery(@"INSERT INTO [dbo].[SchemaInfo_Crm_Order] ([Version]) VALUES 
(20120101010000),
(20120101020000),
(20120602205105),
(20120602222444),
(20120602234412),
(20120602234742),
(20120607203014),
(20130408153515),
(20130425145355),
(20130425154955),
(20130426140211),
(20130426154111),
(20130430133945),
(20130507115655),
(20130513094751),
(20130517155315),
(20130517174545),
(20130607113451),
(20130628091951),
(20130702114800),
(20130702171699),
(20130709084600),
(20130724135792),
(20130730161523),
(20130816124000),
(20130819135793),
(20130826134000),
(20130829105800),
(20130902112500),
(20130927135790),
(20131017292875),
(20131203143999),
(20140204174899),
(20140205164399),
(20140205164899),
(20140219101599),
(20140220163499),
(20140220163999),
(20140225101010),
(20140422122425),
(20140422122426),
(20140505173921),
(20140506114800),
(20140516010203),
(20140821100203),
(20140825101103),
(20140826134600),
(20141104122425),
(20141113160800),
(20141119131700),
(20141119131701),
(20141119131702),
(20141119131703),
(20150128104700),
(20150128121100),
(20150201131000),
(20150211101100),
(20150413133900),
(20150413133901),
(20150413134700),
(20150413134701),
(20150413134702),
(20150414154100),
(20150421154000),
(20150421154400),
(20150421161400),
(20150421161900),
(20150421170500),
(20151209105900),
(20151210144800),
(20151215142600),
(20151215142601),
(20151217113700),
(20151217113701),
(20151217113702),
(20160107115400),
(20160126105400),
(20160205115200),
(20160205115201),
(20160205115600),
(20160302150600),
(20160503100100),
(20160613121800),
(20160623174700),
(20160624120000),
(20160624120001),
(20160624120002),
(20160715095000),
(20160715103500),
(20160802133900),
(20160802133901),
(20160802133902),
(20160808160100),
(20160920170000),
(20160920170100),
(20160921111200),
(20161230112500),
(20161230112501),
(20170102115200),
(20170105103300),
(20170105120800),
(20170208181000),
(20170331150000),
(20170724120003),
(20180411190001),
(20180511114900),
(20180517091700),
(20190426113800),
(20210422112800),
(20211019142000),
(20211118150000),
(20211213114000),
(20211217105000),
(20220110150100),
(20220113061600),
(20220113112800),
(20220117095000),
(20220117101000),
(20220117102000),
(20220301114500),
(20221109092700)
");
			Database.ExecuteNonQuery(@"

SET IDENTITY_INSERT [LU].[CalculationPositionType] ON
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(1,'2017-02-02T16:46:29',N'Setup',0,1,1,1,0,1,N'de','2019-02-06T21:40:56.243',N'Setup',N'Gutschrift',0,N'CreditItem')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(2,'2017-02-02T16:46:47',N'Setup',0,1,1,1,0,1,N'en','2019-02-06T21:40:56.243',N'Setup',N'Credit item',0,N'CreditItem')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(3,'2017-02-02T16:47:05',N'Setup',0,1,1,1,0,1,N'de','2019-11-18T15:57:02.847',N'default.1',N'Skonto',0,N'Discount')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(4,'2017-02-02T16:47:24',N'Setup',0,1,1,1,0,1,N'en','2019-11-18T15:57:02.847',N'default.1',N'Discount',0,N'Discount')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(5,'2017-02-02T16:49:00',N'Setup',0,1,1,1,0,0,N'de','2019-11-18T15:57:04.993',N'default.1',N'Sonstige Kosten',0,N'Costs')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(6,'2017-02-02T16:49:26',N'Setup',0,1,1,1,0,0,N'en','2019-11-18T15:57:04.993',N'default.1',N'Miscellaneous costs',0,N'Costs')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(8,'2017-03-20T15:54:16',N'LookupManager',0,1,1,1,0,1,N'hu','2019-11-18T15:57:02.847',N'default.1',N'készpénz kedvezmény',0,N'Discount')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(9,'2017-03-20T15:54:16',N'LookupManager',0,1,1,1,0,0,N'hu','2019-11-18T15:57:04.993',N'default.1',N'Egyéb költségek',0,N'Costs')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(10,'2019-02-06T21:40:39.307',N'Setup',0,1,1,1,0,0,N'fr','2019-11-18T15:57:04.993',N'default.1',N'Frais divers',0,N'Costs')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(11,'2019-02-06T21:40:56.020',N'Setup',0,1,1,1,0,1,N'fr','2019-02-06T21:40:56.020',N'Setup',N'Élément de crédit',0,N'CreditItem')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(12,'2019-02-06T21:41:10.713',N'Setup',0,1,1,1,0,1,N'fr','2019-11-18T15:57:02.847',N'default.1',N'Remise',0,N'Discount')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(13,'2021-07-13T08:43:50.573',N'Creater',0,0,1,1,0,0,N'es','2021-07-13T08:43:50.573',N'Modifier',N'Costes varios',0,N'Costs')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(14,'2021-07-13T08:43:50.573',N'Creater',0,0,1,1,0,1,N'es','2021-07-13T08:43:50.573',N'Modifier',N'Descuento',0,N'Discount')
INSERT [LU].[CalculationPositionType]([CalculationPositionTypeId],[CreateDate],[CreateUser],[Favorite],[HasPurchasePrice],[IsAbsolute],[IsActive],[IsDefault],[IsDiscount],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(15,'2021-07-13T08:43:50.573',N'Creater',0,0,1,1,0,1,N'es','2021-07-13T08:43:50.573',N'Modifier',N'Elemento de crédito',0,N'CreditItem')
SET IDENTITY_INSERT [LU].[CalculationPositionType] OFF


SET IDENTITY_INSERT [LU].[OrderCategory] ON
INSERT [LU].[OrderCategory]([AllowedArticleGroupValues],[AllowedArticleTypeValues],[AllowNegativeQuantities],[AllowPositiveQuantities],[Color],[CreateDate],[CreateUser],[CustomerFlags],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderCategoryId],[SortOrder],[Value])
VALUES(null,null,0,1,N'#aaaaaa','2016-12-29T10:14:02',N'Setup',null,1,1,N'de','2019-02-07T09:02:33.917',N'Setup',N'Standard',1,0,N'Standard')
INSERT [LU].[OrderCategory]([AllowedArticleGroupValues],[AllowedArticleTypeValues],[AllowNegativeQuantities],[AllowPositiveQuantities],[Color],[CreateDate],[CreateUser],[CustomerFlags],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderCategoryId],[SortOrder],[Value])
VALUES(null,null,0,1,N'#aaaaaa','2016-12-29T10:14:21',N'Setup',null,1,1,N'en','2019-02-07T09:02:33.920',N'Setup',N'Standard',2,0,N'Standard')
INSERT [LU].[OrderCategory]([AllowedArticleGroupValues],[AllowedArticleTypeValues],[AllowNegativeQuantities],[AllowPositiveQuantities],[Color],[CreateDate],[CreateUser],[CustomerFlags],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderCategoryId],[SortOrder],[Value])
VALUES(null,null,0,1,N'#aaaaaa','2019-02-07T09:02:33.687',N'Setup',null,1,1,N'fr','2019-02-07T09:02:33.687',N'Setup',N'Standard',4,0,N'Standard')
INSERT [LU].[OrderCategory]([AllowedArticleGroupValues],[AllowedArticleTypeValues],[AllowNegativeQuantities],[AllowPositiveQuantities],[Color],[CreateDate],[CreateUser],[CustomerFlags],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderCategoryId],[SortOrder],[Value])
VALUES(null,null,0,1,null,'2021-07-13T08:43:50.580',N'Creater',null,1,1,N'es','2021-07-13T08:43:50.580',N'Modifier',N'Estándar',5,0,N'Standard')
SET IDENTITY_INSERT [LU].[OrderCategory] OFF


SET IDENTITY_INSERT [LU].[OrderEntryType] ON
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.890',N'Setup',0,1,N'de','2016-12-29T08:41:17.890',N'Setup',N'Einzellieferung',1,0,N'SingleDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.890',N'Setup',0,1,N'en','2016-12-29T08:41:17.890',N'Setup',N'Single delivery',2,0,N'SingleDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.890',N'Setup',0,1,N'de','2016-12-29T08:41:17.890',N'Setup',N'Mehrfachlieferung',3,0,N'MultiDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.890',N'Setup',0,1,N'en','2016-12-29T08:41:17.890',N'Setup',N'Multiple deliveries',4,0,N'MultiDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.890',N'Setup',0,1,N'fr','2016-12-29T08:41:17.890',N'Setup',N'Livraisons multiples',10,0,N'MultiDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.933',N'Setup',0,1,N'fr','2016-12-29T08:41:17.933',N'Setup',N'Configuration',11,0,N'Configuration')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2016-12-29T08:41:17.933',N'Setup',0,1,N'fr','2016-12-29T08:41:17.933',N'Setup',N'Une seule livraison',12,0,N'SingleDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2021-07-13T08:43:50.583',N'Creater',0,1,N'es','2021-07-13T08:43:50.583',N'Modifier',N'Configuración',13,0,N'Configuration')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2021-07-13T08:43:50.583',N'Creater',0,1,N'es','2021-07-13T08:43:50.583',N'Modifier',N'Múltiples entregas',14,0,N'MultiDelivery')
INSERT [LU].[OrderEntryType]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[OrderEntryTypeId],[SortOrder],[Value])
VALUES('2021-07-13T08:43:50.583',N'Creater',0,1,N'es','2021-07-13T08:43:50.583',N'Modifier',N'Entrega única',15,0,N'SingleDelivery')
SET IDENTITY_INSERT [LU].[OrderEntryType] OFF


SET IDENTITY_INSERT [LU].[OrderStatus] ON
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#4CAF50','2017-01-23T14:37:54.260',N'Setup',0,1,N'de','2017-01-23T14:37:54.287',N'Setup',N'Offen',0,1,N'Open')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#F44336','2017-01-23T14:37:54.260',N'Setup',0,1,N'de','2017-01-23T14:37:54.287',N'Setup',N'Geschlossen',1,2,N'Closed')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#4CAF50','2017-01-23T14:37:54.260',N'Setup',0,1,N'en','2017-01-23T14:37:54.287',N'Setup',N'Open',0,3,N'Open')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#F44336','2017-01-23T14:37:54.260',N'Setup',0,1,N'en','2017-01-23T14:37:54.287',N'Setup',N'Closed',1,4,N'Closed')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#4CAF50','2017-03-20T15:54:16',N'LookupManager',0,1,N'hu','2017-03-20T15:54:16',N'LookupManager',N'Nyitott',0,5,N'Open')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#F44336','2017-03-20T15:54:16',N'LookupManager',0,1,N'hu','2017-03-20T15:54:16',N'LookupManager',N'Lezárt',1,6,N'Closed')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#4CAF50','2018-05-24T15:25:41.240',N'LookupManager',0,1,N'fr','2018-05-24T15:25:41.240',N'LookupManager',N'Ouvert',0,7,N'Open')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#F44336','2018-05-24T15:25:41.243',N'LookupManager',0,1,N'fr','2018-05-24T15:25:41.243',N'LookupManager',N'Fermé',1,8,N'Closed')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#4CAF50','2021-07-13T08:43:50.590',N'Creater',0,1,N'es','2021-07-13T08:43:50.590',N'Modifier',N'Abierto',0,9,N'Open')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#F44336','2021-07-13T08:43:50.590',N'Creater',0,1,N'es','2021-07-13T08:43:50.590',N'Modifier',N'Cerrado',1,10,N'Closed')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ffe312','2023-03-06T10:53:59.967',N'Creater',0,1,N'de','2023-03-06T10:53:59.967',N'Modifier',N'Abgebrochen',0,11,N'Canceled')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ffe312','2023-03-06T10:53:59.967',N'Creater',0,1,N'en','2023-03-06T10:53:59.967',N'Modifier',N'Canceled',0,12,N'Canceled')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ffe312','2023-03-06T10:53:59.967',N'Creater',0,1,N'fr','2023-03-06T10:53:59.967',N'Modifier',N'Annulé',0,13,N'Canceled')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ffe312','2023-03-06T10:53:59.967',N'Creater',0,1,N'hu','2023-03-06T10:53:59.967',N'Modifier',N'Törölve',0,14,N'Canceled')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ffe312','2023-03-06T10:53:59.970',N'Creater',0,1,N'es','2023-03-06T10:53:59.970',N'Modifier',N'Cancelado',0,15,N'Canceled')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ff9d00','2023-03-06T10:53:59.970',N'Creater',0,1,N'de','2023-03-06T10:53:59.970',N'Modifier',N'Abgelaufen',0,16,N'Expired')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ff9d00','2023-03-06T10:53:59.970',N'Creater',0,1,N'en','2023-03-06T10:53:59.970',N'Modifier',N'Expired',0,17,N'Expired')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ff9d00','2023-03-06T10:53:59.970',N'Creater',0,1,N'fr','2023-03-06T10:53:59.970',N'Modifier',N'Expiré',0,18,N'Expired')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ff9d00','2023-03-06T10:53:59.970',N'Creater',0,1,N'hu','2023-03-06T10:53:59.970',N'Modifier',N'Lejárt',0,19,N'Expired')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#ff9d00','2023-03-06T10:53:59.970',N'Creater',0,1,N'es','2023-03-06T10:53:59.970',N'Modifier',N'Caducado',0,20,N'Expired')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#00ffff','2023-03-06T10:53:59.970',N'Creater',0,1,N'de','2023-03-06T10:53:59.970',N'Modifier',N'Auftrag erstellt',0,21,N'OrderCreated')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#00ffff','2023-03-06T10:53:59.970',N'Creater',0,1,N'en','2023-03-06T10:53:59.970',N'Modifier',N'Order created',0,22,N'OrderCreated')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#00ffff','2023-03-06T10:53:59.970',N'Creater',0,1,N'fr','2023-03-06T10:53:59.970',N'Modifier',N'Commande créée',0,23,N'OrderCreated')
INSERT [LU].[OrderStatus]([Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[StatusId],[Value])
VALUES(N'#00ffff','2023-03-06T10:53:59.970',N'Creater',0,1,N'es','2023-03-06T10:53:59.970',N'Modifier',N'Pedido creado',0,24,N'OrderCreated')
SET IDENTITY_INSERT [LU].[OrderStatus] OFF
");
		}
	}
}

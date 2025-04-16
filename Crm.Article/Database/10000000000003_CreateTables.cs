namespace Crm.Article.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(10000000000003)]
	public class CreateTables : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM [dbo].[SchemaInfo_Crm_Article]") > 0)
			{
				return;
			}

			Database.ExecuteNonQuery(@"

CREATE TABLE [LU].[ArticleDescription](
	[ArticleDescriptionId] [int] NOT NULL IDENTITY (1,1) NOT FOR REPLICATION,
	[Name] [nvarchar] (450) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [char] (2) COLLATE Latin1_General_CI_AS NULL CONSTRAINT [DF_ArticleDescription_Language] DEFAULT ('en'),
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_ArticleDescription_Value] DEFAULT ((0)),
	[Favorite] [bit] NOT NULL CONSTRAINT [DF_ArticleDescription_Favorite] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF_ArticleDescription_SortOrder] DEFAULT ((0)),
	[Remark] [nvarchar] (250) COLLATE Latin1_General_CI_AS NULL,
	[CreateUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleDescription_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleDescription_ModifyUser] DEFAULT ('Modifier'),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleDescription_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleDescription_ModifyDate] DEFAULT (getutcdate()),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleDescription_IsActive] DEFAULT ((1))
) ON [PRIMARY]

ALTER TABLE [LU].[ArticleDescription] ADD CONSTRAINT [PK_ArticleDescription] PRIMARY KEY
	CLUSTERED
	(
		[ArticleDescriptionId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[ArticleGroup](
	[ArticleGroupId] [int] NOT NULL IDENTITY (1,1) NOT FOR REPLICATION,
	[Name] [nvarchar] (150) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [char] (2) COLLATE Latin1_General_CI_AS NULL CONSTRAINT [DF_ArticleGroup_Language] DEFAULT ('en'),
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_ArticleGroup_Value] DEFAULT ((0)),
	[Favorite] [bit] NOT NULL CONSTRAINT [DF_ArticleGroup_Favorite] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF_ArticleGroup_SortOrder] DEFAULT ((0)),
	[Remark] [nvarchar] (250) COLLATE Latin1_General_CI_AS NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleGroup_IsActive] DEFAULT ((1)),
	[ShowInConfigurator] [bit] NOT NULL CONSTRAINT [DF__ArticleGr__ShowI__4E9398CC] DEFAULT ((0)),
	[Image] [varbinary] (MAX) NULL
) ON [PRIMARY]

ALTER TABLE [LU].[ArticleGroup] ADD CONSTRAINT [PK_ArticleGroup] PRIMARY KEY
	CLUSTERED
	(
		[ArticleGroupId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[ArticleGroup2](
	[ArticleGroupId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (150) COLLATE Latin1_General_CI_AS NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NULL,
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Favorite] [tinyint] NULL,
	[SortOrder] [tinyint] NULL,
	[Remark] [nvarchar] (250) COLLATE Latin1_General_CI_AS NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup2_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup2_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup2_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup2_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleGroup2_IsActive] DEFAULT ((1)),
	[ParentArticleGroup] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Image] [varbinary] (MAX) NULL
) ON [PRIMARY]

CREATE TABLE [LU].[ArticleGroup3](
	[ArticleGroupId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (150) COLLATE Latin1_General_CI_AS NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NULL,
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Favorite] [tinyint] NULL,
	[SortOrder] [tinyint] NULL,
	[Remark] [nvarchar] (250) COLLATE Latin1_General_CI_AS NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup3_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup3_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup3_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup3_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleGroup3_IsActive] DEFAULT ((1)),
	[ParentArticleGroup] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Image] [varbinary] (MAX) NULL
) ON [PRIMARY]

CREATE TABLE [LU].[ArticleGroup4](
	[ArticleGroupId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (150) COLLATE Latin1_General_CI_AS NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NULL,
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Favorite] [tinyint] NULL,
	[SortOrder] [tinyint] NULL,
	[Remark] [nvarchar] (250) COLLATE Latin1_General_CI_AS NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup4_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup4_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup4_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup4_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleGroup4_IsActive] DEFAULT ((1)),
	[ParentArticleGroup] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Image] [varbinary] (MAX) NULL
) ON [PRIMARY]

CREATE TABLE [LU].[ArticleGroup5](
	[ArticleGroupId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (150) COLLATE Latin1_General_CI_AS NULL,
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NULL,
	[Value] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Favorite] [tinyint] NULL,
	[SortOrder] [tinyint] NULL,
	[Remark] [nvarchar] (250) COLLATE Latin1_General_CI_AS NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup5_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleGroup5_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup5_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleGroup5_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleGroup5_IsActive] DEFAULT ((1)),
	[ParentArticleGroup] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[Image] [varbinary] (MAX) NULL
) ON [PRIMARY]

CREATE TABLE [LU].[ArticleRelationshipType](
	[ArticleRelationshipTypeId] [int] NOT NULL IDENTITY (1,1),
	[Value] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[Name] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL,
	[InverseName] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL,
	[ArticleTypes] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL,
	[HasQuantity] [bit] NOT NULL CONSTRAINT [DF__ArticleRe__HasQu__0559BDD1] DEFAULT ((0)),
	[Language] [nvarchar] (2) COLLATE Latin1_General_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__ArticleRe__Favor__064DE20A] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleRelationshipType_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleRelationshipType_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleRelationshipType_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleRelationshipType_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleRelationshipType_IsActive] DEFAULT ((1))
) ON [PRIMARY]

ALTER TABLE [LU].[ArticleRelationshipType] ADD CONSTRAINT [PK__ArticleR__3DF519B9612B4A80] PRIMARY KEY
	CLUSTERED
	(
		[ArticleRelationshipTypeId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[ArticleType](
	[ArticleTypeId] [int] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [char] (2) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_ArticleType_Language] DEFAULT ('en'),
	[Value] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_ArticleType_Value] DEFAULT ((0)),
	[Favorite] [bit] NOT NULL CONSTRAINT [DF_ArticleType_Favorite] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF_ArticleType_SortOrder] DEFAULT ((0)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleType_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUArticleType_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleType_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUArticleType_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUArticleType_IsActive] DEFAULT ((1)),
	[Color] [nvarchar] (20) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__ArticleTy__Color__5FC911C6] DEFAULT ('#AAAAAA')
) ON [PRIMARY]

ALTER TABLE [LU].[ArticleType] ADD CONSTRAINT [PK_ArticleType] PRIMARY KEY
	CLUSTERED
	(
		[ArticleTypeId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[QuantityUnit](
	[QuantityUnitId] [int] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [char] (2) COLLATE Latin1_General_CI_AS NULL CONSTRAINT [DF_QuantityUnit_Language] DEFAULT ('en'),
	[Value] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_QuantityUnit_Value] DEFAULT ((0)),
	[Favorite] [bit] NOT NULL CONSTRAINT [DF_QuantityUnit_Favorite] DEFAULT ((0)),
	[SortOrder] [int] NOT NULL CONSTRAINT [DF_QuantityUnit_SortOrder] DEFAULT ((0)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUQuantityUnit_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUQuantityUnit_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUQuantityUnit_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUQuantityUnit_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUQuantityUnit_IsActive] DEFAULT ((1))
) ON [PRIMARY]

ALTER TABLE [LU].[QuantityUnit] ADD CONSTRAINT [PK_QuantityUnit] PRIMARY KEY
	CLUSTERED
	(
		[QuantityUnitId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE TABLE [LU].[VATLevel](
	[VATLevelId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (256) COLLATE Latin1_General_CI_AS NOT NULL,
	[Language] [nchar] (2) COLLATE Latin1_General_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__VATLevel__Favori__742F31CF] DEFAULT ((0)),
	[SortOrder] [smallint] NULL,
	[Value] [nvarchar] (30) COLLATE Latin1_General_CI_AS NOT NULL,
	[PercentageValue] [decimal] (10,5) NOT NULL CONSTRAINT [DF_PercentageValue] DEFAULT ((0)),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF_LUVATLevel_CreateDate] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF_LUVATLevel_ModifyDate] DEFAULT (getutcdate()),
	[CreateUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUVATLevel_CreateUser] DEFAULT ('Creater'),
	[ModifyUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL CONSTRAINT [DF_LUVATLevel_ModifyUser] DEFAULT ('Modifier'),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF_LUVATLevel_IsActive] DEFAULT ((1)),
	[CountryKey] [nvarchar] (255) COLLATE Hungarian_CI_AS NULL
) ON [PRIMARY]

CREATE TABLE [CRM].[Article](
	[ArticleIdOld] [int] NULL,
	[ItemNo] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
	[Description] [nvarchar] (450) COLLATE Latin1_General_CI_AS NOT NULL,
	[ArticleType] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[SalesPrice] [money] NULL,
	[QuantityUnit] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[IsSerial] [bit] NOT NULL,
	[Weight] [real] NULL,
	[WeightNet] [real] NULL,
	[Length] [real] NULL,
	[Width] [real] NULL,
	[Height] [real] NULL,
	[MatchCode] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[ArticleGroup01] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[ArticleGroup02] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[ArticleGroup03] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[IsBatch] [bit] NOT NULL,
	[Remark] [nvarchar] (100) COLLATE Latin1_General_CI_AS NULL,
	[MaintenanceIntervalMonths] [int] NULL,
	[DangerousGoodsFlag] [bit] NOT NULL,
	[MinimumStock] [real] NULL,
	[Barcode] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
	[IsSparePart] [bit] NOT NULL CONSTRAINT [DF__Article__IsSpare__46735417] DEFAULT ((0)),
	[PurchasePrice] [money] NULL,
	[SerialRequired] [bit] NOT NULL CONSTRAINT [DF__Article__SerialR__2136E270] DEFAULT ((0)),
	[VATLevelKey] [nvarchar] (30) COLLATE Latin1_General_CI_AS NULL CONSTRAINT [DF__Article__VATLeve__32F66B4F] DEFAULT ('A'),
	[ArticleGroup04] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[ArticleGroup05] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[QuantityStep] [decimal] (19,5) NOT NULL CONSTRAINT [DF__Article__Quantit__7FA0E47B] DEFAULT ((1)),
	[ArticleId] [uniqueidentifier] NOT NULL,
	[CurrencyKey] [nvarchar] (20) COLLATE Latin1_General_CI_AS NULL,
	[IsWarehouseManaged] [bit] NOT NULL CONSTRAINT [DF__Article__IsWareh__28ADE706] DEFAULT ((1)),
	[CanBeAddedAfterCustomerSignature] [bit] NOT NULL CONSTRAINT [DF__Article__CanBeAd__259C7031] DEFAULT ((0)),
	[ShowDistanceInput] [bit] NOT NULL CONSTRAINT [DF__Article__ShowDis__2690946A] DEFAULT ((0)),
	[IsHidden] [bit] NOT NULL CONSTRAINT [DF__Article__IsHidde__2784B8A3] DEFAULT ((0)),
	[IsEnabled] [bit] NOT NULL CONSTRAINT [DF__Article__IsEnabl__33EA8F88] DEFAULT ((1)),
	[ValidTo] [datetime] NULL,
	[ValidFrom] [datetime] NULL,
	[ManufacturerItemNo] [nvarchar] (50) COLLATE Hungarian_CI_AS NULL,
	[GuaranteeInMonths] [int] NULL,
	[WarrantyInMonths] [int] NULL,
	[LeadTimeInDays] [decimal] (19,5) NULL,
	[ExportToScheduler] [bit] NOT NULL CONSTRAINT [DF__Article__ExportT__04FA9675] DEFAULT ((0)),
	[IsDefaultForServiceOrderTimes] [bit] NOT NULL CONSTRAINT [DF__Article__IsDefau__0E8400AF] DEFAULT ((0))
) ON [PRIMARY]

ALTER TABLE [CRM].[Article] ADD CONSTRAINT [PK_Article] PRIMARY KEY
	CLUSTERED
	(
		[ArticleId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_Article_ItemNo_Description] ON [CRM].[Article]
(
	[ItemNo] ASC
)
INCLUDE
(
	[Description]
)ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_ArticleType] ON [CRM].[Article]
(
	[ArticleType] ASC
)
INCLUDE
(
	[ArticleId]
)ON [PRIMARY]

ALTER TABLE [CRM].[Article] ADD CONSTRAINT [FK_Article_Contact] FOREIGN KEY
	(
		[ArticleId]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	) 

CREATE TABLE [CRM].[ArticleRelationship](
	[ArticleRelationshipIdOld] [int] NOT NULL IDENTITY (1,1),
	[ParentArticleKeyOld] [int] NULL,
	[ChildArticleKeyOld] [int] NULL,
	[RelationshipType] [nvarchar] (20) COLLATE Latin1_General_CI_AS NOT NULL,
	[QuantityValue] [decimal] (19,5) NULL,
	[QuantityUnit] [nvarchar] (10) COLLATE Latin1_General_CI_AS NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL,
	[ModifyDate] [datetime] NOT NULL,
	[ModifyUser] [nvarchar] (255) COLLATE Latin1_General_CI_AS NOT NULL,
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__ArticleRe__IsAct__027D5126] DEFAULT ((1)),
	[ParentArticleKey] [uniqueidentifier] NOT NULL,
	[ChildArticleKey] [uniqueidentifier] NOT NULL,
	[IsDefault] [bit] NULL,
	[IsRequired] [bit] NULL,
	[PurchasePrice] [money] NULL,
	[SalesPrice] [money] NULL,
	[ArticleRelationshipId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ArticleRelationship_ArticleRelationshipId] DEFAULT (newsequentialid()),
	[Information] [nvarchar] (255) COLLATE Latin1_General_CI_AS NULL
) ON [PRIMARY]

ALTER TABLE [CRM].[ArticleRelationship] ADD CONSTRAINT [PK_ArticleRelationship] PRIMARY KEY
	CLUSTERED
	(
		[ArticleRelationshipId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

ALTER TABLE [CRM].[ArticleRelationship] ADD CONSTRAINT [FK_ArticleRelationship_ChildArticle] FOREIGN KEY
	(
		[ChildArticleKey]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	) 

ALTER TABLE [CRM].[ArticleRelationship] ADD CONSTRAINT [FK_ArticleRelationship_ParentArticle] FOREIGN KEY
	(
		[ParentArticleKey]
	)
	REFERENCES [CRM].[Contact]
	(
		[ContactId]
	) 

CREATE TABLE [CRM].[ArticleCompanyRelationship](
	[RelationshipType] [nvarchar] (50) COLLATE Hungarian_CI_AS NOT NULL,
	[Information] [nvarchar] (150) COLLATE Hungarian_CI_AS NULL,
	[CreateUser] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__ArticleCo__Creat__36C6FC33] DEFAULT ('Setup'),
	[ModifyUser] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__ArticleCo__Modif__37BB206C] DEFAULT ('Setup'),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF__ArticleCo__Creat__38AF44A5] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF__ArticleCo__Modif__39A368DE] DEFAULT (getutcdate()),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__ArticleCo__IsAct__3A978D17] DEFAULT ((1)),
	[ArticleKey] [uniqueidentifier] NOT NULL,
	[CompanyKey] [uniqueidentifier] NOT NULL,
	[ArticleCompanyRelationshipId] [uniqueidentifier] NOT NULL,
	[AuthDataId] [uniqueidentifier] NULL
) ON [PRIMARY]

ALTER TABLE [CRM].[ArticleCompanyRelationship] ADD CONSTRAINT [PK__ArticleC__2A5F7E4CB7177C7B] PRIMARY KEY
	CLUSTERED
	(
		[ArticleCompanyRelationshipId] ASC
	)	WITH
	(
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
	) ON [PRIMARY]

ALTER TABLE [CRM].[ArticleCompanyRelationship] ADD CONSTRAINT [FK__ArticleCo__Artic__3B8BB150] FOREIGN KEY
	(
		[ArticleKey]
	)
	REFERENCES [CRM].[Article]
	(
		[ArticleId]
	) 

ALTER TABLE [CRM].[ArticleCompanyRelationship] ADD CONSTRAINT [FK__ArticleCo__Compa__3C7FD589] FOREIGN KEY
	(
		[CompanyKey]
	)
	REFERENCES [CRM].[Company]
	(
		[ContactKey]
	) 

ALTER TABLE [CRM].[ArticleCompanyRelationship] ADD CONSTRAINT [FK_ArticleCompanyRelationship_EntityAuthData] FOREIGN KEY
	(
		[AuthDataId]
	)
	REFERENCES [dbo].[EntityAuthData]
	(
		[UId]
	) 

CREATE TABLE [LU].[ArticleCompanyRelationshipType](
	[ArticleCompanyRelationshipTypeId] [smallint] NOT NULL IDENTITY (1,1),
	[Name] [nvarchar] (20) COLLATE Hungarian_CI_AS NOT NULL,
	[Language] [nchar] (2) COLLATE Hungarian_CI_AS NOT NULL,
	[Favorite] [bit] NOT NULL CONSTRAINT [DF__ArticleCo__Favor__3E681DFB] DEFAULT ((0)),
	[SortOrder] [smallint] NULL,
	[Value] [nvarchar] (30) COLLATE Hungarian_CI_AS NOT NULL,
	[CreateUser] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__ArticleCo__Creat__3F5C4234] DEFAULT ('Setup'),
	[ModifyUser] [nvarchar] (255) COLLATE Hungarian_CI_AS NOT NULL CONSTRAINT [DF__ArticleCo__Modif__4050666D] DEFAULT ('Setup'),
	[CreateDate] [datetime] NOT NULL CONSTRAINT [DF__ArticleCo__Creat__41448AA6] DEFAULT (getutcdate()),
	[ModifyDate] [datetime] NOT NULL CONSTRAINT [DF__ArticleCo__Modif__4238AEDF] DEFAULT (getutcdate()),
	[IsActive] [bit] NOT NULL CONSTRAINT [DF__ArticleCo__IsAct__432CD318] DEFAULT ((1))
) ON [PRIMARY]
");
			Database.ExecuteNonQuery(@"INSERT INTO [dbo].[SchemaInfo_Crm_Article] ([Version]) VALUES 
(20120101010000),
(20120101020000),
(20120101030000),
(20120101040000),
(20120101050000),
(20120101060000),
(20120505192741),
(20120509141530),
(20120509144602),
(20120521194029),
(20120521200154),
(20120521214128),
(20120521214406),
(20121114121544),
(20130131114628),
(20130618170620),
(20130628194700),
(20130702114800),
(20130816123700),
(20131101155456),
(20140115150706),
(20140311222399),
(20140311223444),
(20140611154000),
(20140612223476),
(20141021000099),
(20141021134800),
(20150413113900),
(20150413113901),
(20151207100600),
(20151207105100),
(20151221104900),
(20160404162700),
(20160421110000),
(20160629120000),
(20160706165600),
(20170120113700),
(20170309183000),
(20170523103500),
(20170724120001),
(20170822153900),
(20180220174500),
(20180801120000),
(20180815140900),
(20181129113500),
(20190221190000),
(20200514150000),
(20200518210000),
(20200608124500),
(20210115123900),
(20210422104700),
(20210930100000),
(20211217105000),
(20220218090000),
(20220222101500),
(20220317152700),
(20220629144910),
(20220629145111)
");

			Database.ExecuteNonQuery(@"

SET IDENTITY_INSERT [LU].[ArticleRelationshipType] ON
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(1,null,'2015-11-13T11:47:06.983',N'Setup',0,0,N'Zubehör von',1,N'de','2019-11-18T15:51:51.723',N'default.1',N'Zubehör',0,N'Accessory')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(2,null,'2015-11-13T11:47:06.987',N'Setup',0,0,N'Accessory of',1,N'en','2019-11-18T15:51:51.723',N'default.1',N'Accessory',0,N'Accessory')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(3,N'Set','2015-11-13T11:47:06.987',N'Setup',0,1,N'Verwendet in Set',1,N'de','2019-11-18T15:51:50.480',N'default.1',N'Set',0,N'Set')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(4,N'Set','2015-11-13T11:47:06.990',N'Setup',0,1,N'Used in set',1,N'en','2019-11-18T15:51:50.480',N'default.1',N'Set',0,N'Set')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(5,N'Variable','2016-12-29T08:41:18.150',N'Setup',0,0,N'Option von Variable',1,N'de','2019-11-18T15:51:49.210',N'default.1',N'Variablenoption',0,N'VariableValue')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(6,N'Variable','2016-12-29T08:41:18.150',N'Setup',0,0,N'Option of variable',1,N'en','2019-11-18T15:51:49.213',N'default.1',N'Variable value',0,N'VariableValue')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(7,null,'2017-03-20T15:54:16',N'LookupManager',0,0,N'Accessory: Zubehör von',1,N'hu','2019-11-18T15:51:51.727',N'default.1',N'tartozékok',0,N'Accessory')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(8,N'Set','2017-03-20T15:54:16',N'LookupManager',0,1,N'Set: Verwendet in Set',1,N'hu','2019-11-18T15:51:50.480',N'default.1',N'készlet',0,N'Set')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(9,N'Variable','2017-03-20T15:54:16',N'LookupManager',0,0,N'VariableValue: Option von Variable',1,N'hu','2019-11-18T15:51:49.213',N'default.1',N'változók lehetőség',0,N'VariableValue')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(10,null,'2019-02-08T07:33:18.260',N'Setup',0,0,N'Accessory: Zubehör von',1,N'fr','2019-11-18T15:51:51.727',N'default.1',N'Accessoire',0,N'Accessory')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(11,N'Set','2019-02-08T07:33:21.640',N'Setup',0,1,N'Set: Verwendet in Set',1,N'fr','2019-11-18T15:51:50.480',N'default.1',N'Set',0,N'Set')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(12,N'Variable','2019-02-08T07:33:31.863',N'Setup',0,0,N'VariableValue: Option von Variable',1,N'fr','2019-11-18T15:51:49.213',N'default.1',N'Valeur variable',0,N'VariableValue')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(13,null,'2021-07-13T08:43:50.523',N'Creater',0,0,N'Accesorio de',1,N'es','2021-07-13T08:43:50.523',N'Modifier',N'Accesorio',0,N'Accessory')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(14,N'Set','2021-07-13T08:43:50.523',N'Creater',0,1,N'Utilizado en el set',1,N'es','2021-07-13T08:43:50.523',N'Modifier',N'Set',0,N'Set')
INSERT [LU].[ArticleRelationshipType]([ArticleRelationshipTypeId],[ArticleTypes],[CreateDate],[CreateUser],[Favorite],[HasQuantity],[InverseName],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(15,null,'2021-07-13T08:43:50.523',N'Creater',0,0,N'Opción de la variable',1,N'es','2021-07-13T08:43:50.523',N'Modifier',N'Valor variable',0,N'VariableValue')
SET IDENTITY_INSERT [LU].[ArticleRelationshipType] OFF

SET IDENTITY_INSERT [LU].[ArticleType] ON
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(1,N'#2196F3','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:28.870',N'default.1',N'Material',0,N'Material')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(2,N'#2196F3','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:28.870',N'default.1',N'Material',0,N'Material')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(3,N'#4CAF50','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:27.467',N'default.1',N'Service',0,N'Service')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(4,N'#4CAF50','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:27.467',N'default.1',N'Dienstleistung',0,N'Service')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(5,N'#795548','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:24.330',N'default.1',N'Tool',0,N'Tool')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(6,N'#795548','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:24.330',N'default.1',N'Werkzeug',0,N'Tool')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(7,N'#2196F3','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'fr','2019-11-18T15:54:28.870',N'default.1',N'Matériel',0,N'Material')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(8,N'#4CAF50','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'fr','2019-11-18T15:54:27.467',N'default.1',N'Service',0,N'Service')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(9,N'#795548','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'fr','2019-11-18T15:54:24.330',N'default.1',N'Outil',0,N'Tool')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(10,N'#F44336','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:30.570',N'default.1',N'Kosten',0,N'Cost')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(11,N'#F44336','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:30.570',N'default.1',N'Cost',0,N'Cost')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(12,N'#673AB7','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:26.267',N'default.1',N'Setartikel',0,N'Set')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(13,N'#673AB7','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:26.267',N'default.1',N'Set item',0,N'Set')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(14,N'#FF9800','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:23.450',N'default.1',N'Variable',0,N'Variable')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(15,N'#FF9800','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:23.450',N'default.1',N'Variable',0,N'Variable')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(16,N'#9C27B0','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'de','2019-11-18T15:54:32.073',N'default.1',N'Konfigurationsbasis',0,N'ConfigurationBase')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(17,N'#9C27B0','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'en','2019-11-18T15:54:32.073',N'default.1',N'Configuration base',0,N'ConfigurationBase')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(18,N'#2196F3','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:28.870',N'default.1',N'anyag',0,N'Material')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(19,N'#4CAF50','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:27.467',N'default.1',N'szolgáltatás',0,N'Service')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(20,N'#795548','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:24.330',N'default.1',N'szerszám',0,N'Tool')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(21,N'#F44336','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:30.570',N'default.1',N'kiadások',0,N'Cost')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(22,N'#673AB7','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:26.267',N'default.1',N'Állítsa be az elemeket',0,N'Set')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(23,N'#FF9800','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:23.450',N'default.1',N'változó',0,N'Variable')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(24,N'#9C27B0','2018-05-24T15:17:45.973',N'Migration_20170523103500',0,1,'hu','2019-11-18T15:54:32.073',N'default.1',N'Konfigurációs alap',0,N'ConfigurationBase')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(25,N'#9C27B0','2019-02-06T16:03:57.887',N'Setup',0,1,'fr','2019-11-18T15:54:32.073',N'default.1',N'Configuration de base',0,N'ConfigurationBase')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(26,N'#F44336','2019-02-06T16:04:18.003',N'Setup',0,1,'fr','2019-11-18T15:54:30.570',N'default.1',N'Coût',0,N'Cost')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(27,N'#673AB7','2019-02-06T16:05:14.363',N'Setup',0,1,'fr','2019-11-18T15:54:26.267',N'default.1',N'Insérer un article',0,N'Set')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(28,N'#FF9800','2019-02-06T16:05:23.150',N'Setup',0,1,'fr','2019-11-18T15:54:23.450',N'default.1',N'Variable',0,N'Variable')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(29,N'#FF9800','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Variable',0,N'Variable')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(30,N'#2196F3','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Material',0,N'Material')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(31,N'#673AB7','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Elemento del set',0,N'Set')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(32,N'#F44336','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Coste',0,N'Cost')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(33,N'#9C27B0','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Base de configuración',0,N'ConfigurationBase')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(34,N'#795548','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Herramienta',0,N'Tool')
INSERT [LU].[ArticleType]([ArticleTypeId],[Color],[CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[SortOrder],[Value])
VALUES(35,N'#4CAF50','2021-07-13T08:43:50.530',N'Creater',0,1,'es','2021-07-13T08:43:50.530',N'Modifier',N'Servicio',0,N'Service')
SET IDENTITY_INSERT [LU].[ArticleType] OFF

SET IDENTITY_INSERT [LU].[QuantityUnit] ON
INSERT [LU].[QuantityUnit]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[QuantityUnitId],[SortOrder],[Value])
VALUES('2014-06-24T11:34:05.067',N'Setup',0,1,'en','2019-02-07T08:57:12.710',N'Setup',N'Pieces',1,0,N'Stk')
INSERT [LU].[QuantityUnit]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[QuantityUnitId],[SortOrder],[Value])
VALUES('2014-06-24T11:34:05.067',N'Setup',0,1,'de','2019-02-07T08:57:12.710',N'Setup',N'Stk',2,0,N'Stk')
INSERT [LU].[QuantityUnit]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[QuantityUnitId],[SortOrder],[Value])
VALUES('2019-02-07T08:57:12.480',N'Setup',0,1,'fr','2019-02-07T08:57:12.480',N'Setup',N'Pièces',4,0,N'Stk')
INSERT [LU].[QuantityUnit]([CreateDate],[CreateUser],[Favorite],[IsActive],[Language],[ModifyDate],[ModifyUser],[Name],[QuantityUnitId],[SortOrder],[Value])
VALUES('2021-07-13T08:43:50.533',N'Creater',0,1,'es','2021-07-13T08:43:50.533',N'Modifier',N'Piezas',5,0,N'Stk')
SET IDENTITY_INSERT [LU].[QuantityUnit] OFF
");
		}
	}
}

namespace Crm.Article.Model.Lookups
{
	using System;

	using Crm.Library.BaseModel.Attributes;
	using Crm.Library.Globalization.Lookup;

	public abstract class ArticleGroup : EntityLookup<string>, ILookupWithImage
	{
		[Database(Ignore = true)]
		[LookupProperty(Shared = true)]
		[UI(UIignore = true)]
		public virtual string Base64Image
		{
			get { return Image != null ? Convert.ToBase64String(Image) : null; }
			set { Image = value != null ? Convert.FromBase64String(value) : null; }
		}
		[LookupProperty(Shared = true)]
		[UI(UIignore = true)]
		public virtual byte[] Image { get; set; }
	}

	[Lookup("[LU].[ArticleGroup]", "ArticleGroupId")]
	public class ArticleGroup01 : ArticleGroup
	{
	}

	[Lookup("[LU].[ArticleGroup2]", "ArticleGroupId")]
	public class ArticleGroup02 : ArticleGroup
	{
		[LookupProperty(Shared = true)]
		public virtual string ParentArticleGroup { get; set; }
	}

	[Lookup("[LU].[ArticleGroup3]", "ArticleGroupId")]
	public class ArticleGroup03 : ArticleGroup
	{
		[LookupProperty(Shared = true)]
		public virtual string ParentArticleGroup { get; set; }
	}

	[Lookup("[LU].[ArticleGroup4]", "ArticleGroupId")]
	public class ArticleGroup04 : ArticleGroup
	{
		[LookupProperty(Shared = true)]
		public virtual string ParentArticleGroup { get; set; }
	}

	[Lookup("[LU].[ArticleGroup5]", "ArticleGroupId")]
	public class ArticleGroup05 : ArticleGroup
	{
		[LookupProperty(Shared = true)]
		public virtual string ParentArticleGroup { get; set; }
	}
}

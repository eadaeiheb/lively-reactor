namespace Crm.Order.BackgroundServices
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Globalization;
	using System.Net.Mime;
	using System.Security.Principal;
	using System.Threading;

	using Crm.Library.AutoFac;
	using Crm.Library.BackgroundServices;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Library.Extensions;
	using Crm.Library.Extensions.IIdentity;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;
	using Crm.Services.Interfaces;

	using log4net;

	using Main.Model;

	using Microsoft.Extensions.Hosting;

	using MimeKit;

	using Quartz;

	[DisallowConcurrentExecution]
	public class BaseOrderPdfSenderAgent : JobBase, IDocumentGeneratorService
	{
		private readonly IUserService userService;
		private readonly IBaseOrderPdfSenderConfiguration baseOrderPdfSenderConfiguration;
		private readonly IRepositoryWithTypedId<BaseOrder, Guid> baseOrderRepository;
		private readonly IBaseOrderService baseOrderService;
		private readonly ILog logger;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly Func<Message> messageFactory;
		private readonly IRepositoryWithTypedId<Message, Guid> messageRepository;
		private readonly IFileService fileService;
		private readonly IClientSideGlobalizationService clientSideGlobalizationService;

		public BaseOrderPdfSenderAgent(ISessionProvider sessionProvider, IUserService userService, IBaseOrderPdfSenderConfiguration baseOrderPdfSenderConfiguration, IRepositoryWithTypedId<BaseOrder, Guid> baseOrderRepository, IBaseOrderService baseOrderService, ILog logger, IAppSettingsProvider appSettingsProvider, IHostApplicationLifetime hostApplicationLifetime, IRepositoryWithTypedId<Message, Guid> messageRepository, Func<Message> messageFactory, IFileService fileService, IClientSideGlobalizationService clientSideGlobalizationService)
			: base(sessionProvider, logger, hostApplicationLifetime)
		{
			this.userService = userService;
			this.baseOrderPdfSenderConfiguration = baseOrderPdfSenderConfiguration;
			this.baseOrderRepository = baseOrderRepository;
			this.baseOrderService = baseOrderService;
			this.logger = logger;
			this.appSettingsProvider = appSettingsProvider;
			this.messageFactory = messageFactory;
			this.messageRepository = messageRepository;
			this.fileService = fileService;
			this.clientSideGlobalizationService = clientSideGlobalizationService;
		}
		protected override void Run(IJobExecutionContext context)
		{
			var baseOrderIds = GetPendingDocuments().Cast<BaseOrder>().ToList().Select(x => x.Id);

			foreach (var baseOrderId in baseOrderIds)
			{
				if (receivedShutdownSignal)
				{
					break;
				}
				try
				{
					BeginRequest();
					var baseOrder = baseOrderRepository.Get(baseOrderId);
					var user = userService.GetUser(baseOrder.ResponsibleUser);
					if (user != null)
					{
						Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(user.GetIdentityString()), new string[0]);
						Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(clientSideGlobalizationService.GetCurrentLanguageCultureNameOrDefault());
						Thread.CurrentThread.CurrentCulture = CultureInfo.GetCultureInfo(clientSideGlobalizationService.GetCurrentCultureNameOrDefault());
					}
					else
					{
						logger.Warn($"could not set user '{baseOrder.ResponsibleUser}' for localization");
					}
					SendPdf(baseOrder);
					logger.Info($"PDF sent for BaseOrder {baseOrder.Id}");
					baseOrder.ConfirmationSent = true;
					baseOrderRepository.SaveOrUpdate(baseOrder);
				}
				catch (Exception ex)
				{
					EndRequest();
					BeginRequest();
					var baseOrder = baseOrderRepository.Get(baseOrderId);
					baseOrder.ConfirmationSendingError = ex.ToString();
					baseOrder.ConfirmationSent = false;
					baseOrderRepository.SaveOrUpdate(baseOrder);
					logger.Error("Error sending BaseOrder PDF", ex);

				}
				finally
				{
					EndRequest();
				}
			}
		}

		protected virtual void SendPdf(BaseOrder baseOrder)
		{
			var attachment = fileService.CreateAndSaveFileResource(baseOrder, baseOrderService.CreatePdf(baseOrder), MediaTypeNames.Application.Pdf, baseOrderPdfSenderConfiguration.GetPdfFileName(baseOrder).AppendIfMissing(".pdf"));
			var attachments = new List<FileResource> { attachment };
			var recipients = new List<OrderRecipient>(baseOrder.OrderRecipients);

			SendPdf(baseOrder, attachments.ToArray(), recipients);
		}
		protected virtual void SendPdf(BaseOrder baseOrder, IEnumerable<FileResource> attachments, IEnumerable<OrderRecipient> recipients)
		{
			foreach (var recipient in recipients)
			{
				if (!recipient.Email.IsValidEmailAddress())
				{
					logger.WarnFormat($"Pdf sending skipped for BaseOrder {baseOrder.Id} because recipient {recipient} is not a valid email address");
					return;
				}

				var message = messageFactory();
				var responsibleUser = userService.GetUser(baseOrder.ResponsibleUser);
				if (responsibleUser != null)
				{
					message.From = new MailboxAddress(responsibleUser.DisplayName, responsibleUser.Email).ToString();
				}
				message.Subject = baseOrderPdfSenderConfiguration.GetSubject(baseOrder);
				message.Body = baseOrderPdfSenderConfiguration.GetEmailText(baseOrder);
				message.Recipients.Add(recipient.Email);
				message.AttachmentIds.AddItemsNotContained(attachments.Select(x => x.Id));
			message.LanguageKey = System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;
				messageRepository.SaveOrUpdate(message);
			}
		}
		public virtual IQueryable GetFailedDocuments()
		{
			return baseOrderRepository
				.GetAll()
				.Where(x => x.SendConfirmation && !x.ConfirmationSent && x.ConfirmationSendingError != null);
		}
		public virtual IQueryable GetPendingDocuments()
		{
			return baseOrderRepository
				.GetAll()
				.Where(x => x.SendConfirmation && !x.ConfirmationSent && x.ConfirmationSendingError == null);
		}
		public virtual void Retry(Guid id)
		{
			var baseOrder = baseOrderRepository.Get(id);
			baseOrder.ConfirmationSendingError = null;
			baseOrderRepository.SaveOrUpdate(baseOrder);
		}
	}

	public class BaseOrderPdfSenderConfiguration : IBaseOrderPdfSenderConfiguration
	{
		private readonly IResourceManager resourceManager;
		public BaseOrderPdfSenderConfiguration(IResourceManager resourceManager)
		{
			this.resourceManager = resourceManager;
		}
		public virtual string GetSubject(BaseOrder baseOrder)
		{
			return $"{resourceManager.GetTranslation(baseOrder.GetType().Name)} {baseOrder.OrderNo}";
		}
		public virtual string GetEmailText(BaseOrder baseOrder)
		{
			if (baseOrder is Order)
			{
				return resourceManager.GetTranslation("OrderEmailText");
			}
			if (baseOrder is Offer)
			{
				return resourceManager.GetTranslation("OfferEmailText");
			}
			throw new ArgumentException($"Unknown BaseOrder type {baseOrder.GetType().FullName}");
		}
		public virtual string GetPdfFileName(BaseOrder baseOrder)
		{
			return $"{resourceManager.GetTranslation(baseOrder.OrderType)}-{baseOrder.OrderNo}";
		}
	}

	public interface IBaseOrderPdfSenderConfiguration : IDependency
	{
		string GetSubject(BaseOrder baseOrder);
		string GetEmailText(BaseOrder baseOrder);
		string GetPdfFileName(BaseOrder baseOrder);
	}
}

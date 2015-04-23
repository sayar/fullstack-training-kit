<a name="HOLTitle"></a>
# Going Live with Microsoft Azure Websites #

---
<a name="Overview"></a>
## Overview ##

When you create a web site, Microsoft Azure provides a friendly subdomain on the azurewebsites.net domain so your users can access your web site using a URL like http://\<mysite\>.azurewebsites.net. However, if you configure your Websites for shared or standard mode, you can map your web site to your own domain name.

Secure Socket Layer (SSL) encryption is the most commonly used method of securing data sent across the internet, and assures visitors to your site that their transactions with your site are secure. This common task discusses how to enable SSL for a Microsoft Azure Web Site.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Configure a custom domain in Microsoft Azure Websites
- Configure a SSL in Microsoft Azure Websites
- Create a web application and redirecting request to HTTPS

<a name="Prerequisites"></a>
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Microsoft Visual Studio 2012 Express for Web][1]
- A Microsoft Azure subscription - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

[1]: http://msdn.microsoft.com/vstudio/products/

<a name="Setup"/>
### Setup ###

In order to execute the exercises in this hands-on lab you need to set up your environment.

1. Open a Windows Explorer window and browse to the lab’s **Source** folder.

1. Execute the **Setup.cmd** file with Administrator privileges to launch the setup process that will configure your environment.

1. If the User Account Control dialog is shown, confirm the action to proceed.

> **Note:** When you first start Visual Studio, you must select one of the predefined settings collections. Every predefined collection is designed to match a particular development style and determines window layouts, editor behavior, IntelliSense code snippets, and dialog box options. The procedures in this lab describe the actions necessary to accomplish a given task in Visual Studio when using the **General Development Settings** collection. If you choose a different settings collection for your development environment, there may be differences in these procedures that you need to take into account.

> Make sure you have checked all the dependencies for this lab before running the setup.


---
<a name="Exercises"/>
## Exercises ##

This hands-on lab includes the following exercises:

1. [Exercise 1: Configuring a custom domain name for a Microsoft Azure web site](#configuring-a-custom-domain-name-for-a-window)
1. [Exercise 2: Configuring an SSL certificate for a Microsoft Azure web site](#configuring-an-ssl-certificate-for-a-windows)
1. [Exercise 3: Creating a web application and redirecting request to HTTPS](#creating-a-web-application-and-red)

Estimated time to complete this lab: **40** minutes.

<a name="getting-started" />
### Getting Started: Creating a New Web Site from the Microsoft Azure Portal###

1. Go to the [Microsoft Azure Management Portal](https://manage.windowsazure.com/) and sign in using the Microsoft credentials associated with your subscription.

	![Log on to Microsoft Azure portal](Images/login.png?raw=true "Log on to the Microsoft Azure portal")

	_Log on to the Microsoft Azure Management Portal_

1. Click **New** on the command bar.

	![Creating a new Web Site](Images/new-website.png?raw=true "Creating a new Web Site")

	_Creating a new Web Site_

1. Click **Compute**, **Web Site** and then **Quick Create**. Provide an available URL for the new web site and click **Create Web Site**.

	> **Note:** A Microsoft Azure Web Site is the host for a web application running in the cloud that you can control and manage. The Quick Create option allows you to deploy a completed web application to the Microsoft Azure Web Site from outside the portal. It does not include steps for setting up a database.

	![Creating a new Web Site using Quick Create](Images/quick-create.png?raw=true "Creating a new Web Site using Quick Create")

	_Creating a new Web Site using Quick Create_

1. Wait until the new **Web Site** is created.
	
	> **Note:** By default, Microsoft Azure provides domains at _azurewebsites.net_, but also gives you the possibility to set custom domains using the Microsoft Azure Management Portal. However, you can only manage custom domains if you are using certain Web Site modes.
	
	> Microsoft Azure offers 3 modes for users to run their Websites - Free, Shared, and Standard. In Free and Shared mode, all Websites run in a multi-tenant environment and have quotas for CPU, Memory, and Network usage. You can mix and match which sites are Free (strict quotas) vs. Shared (more relaxed quotas). The maximum number of free sites may vary with your plan. The Standard mode applies to ALL of your sites and makes them run on dedicated virtual machines that correspond to the standard Azure compute resources. You can find the Websites Mode configuration in the **Scale** menu of your Web Site.

	> ![Web Site Modes](Images/web-site-modes.png?raw=true "Web Site Modes")

1. Once the Web Site is created, click the link under the **URL** column. Check that the new Web Site is working.

	![Browsing to the new web site](Images/browse-to-new-web-site.png?raw=true "Browsing to the new web site")

	_Browsing to the new web site_

	![Web site running](Images/website-working.png?raw=true "Web site running")

	_Web site running_

---

<a name="configuring-a-custom-domain-name-for-a-window" />
### Exercise 1: Configuring a custom domain name for a Microsoft Azure web site ###

The steps in this exercise require you to configure your Websites for shared or standard mode. Because the Websites feature is in preview and we are adding capacity on a measured basis, you may receive a "_Not enough available reserved instance servers to satisfy this request_" error. If you receive this error, you will need to try again later to perform this task.

You can use a CNAME record to point your domain name to your Microsoft Azure web site. You can also configure an A record to point the domain name to Microsoft Azure web site. The process requires that you wait for the CNAME and A records propagate before you can finally set the domain name in the management portal.

There are two ways you can configure the Domain Name Server (DNS) settings on your domain registrar to point to your Microsoft Azure web site:

1.	**CNAME or Alias record**

	With a CNAME, you map a _specific_ domain, such as www.contoso.com or myblog.contoso.com, to the \<_mysite_\>.azurewebsites.net domain name of your Microsoft Azure web site.
	Using the Microsoft sample domain, contoso.com, as an example:
	
	o	You can typically map subdomains such as www.contoso.com or MySubSite.contoso.com.

	o	Typically you cannot map naked domains such as contoso.com or wildcard names such as *.contoso.com.

1.	**A record**

	With an A record, you map a domain (e.g., contoso.com or www.contoso.com) or a wildcard domain (e.g., *.contoso.com) to the single public IP address of a deployment within a Microsoft Azure web site.

	The main benefit of this approach over using CNAMEs is that you can map root domains (e.g., contoso.com) and wildcard domains (e.g., *.contoso.com), in addition to subdomains (e.g., www.contoso.com).

The task includes the following steps:

1. Configuring your Websites for shared mode.
1. Configuring the CNAME on your domain registrar.
1. Configuring an A record on your domain registrar.
1. Setting the domain name in management portal

You can also optionally [Configure an A record for the domain name](http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-web-site/).

<a name="configure-your-web-sites-for-shared-mode" />
#### Task 1 - Configuring your Websites for shared mode ####

Setting a CNAME record is the recommended way to map your domain name to your Microsoft Azure web site. Mapping a CNAME record insulates your web site from changes that could affect the underlying IP address of the site.

Setting a custom domain name on a web site is only available for the shared and standard modes for Microsoft Azure Websites. Before switching a web site from the free web site mode to the shared or standard web site mode, you must first remove spending caps in place for your web site subscription. For more information on shared and standard mode pricing, see [Pricing Details ](https://www.windowsazure.com/en-us/pricing/details/).

1.	In your browser, open the [Microsoft Azure Management Portal](http://manage.windowsazure.com/).

1.	In the **Websites** tab, click the name of your site.

	![Websites Tab](Images/web-sites-tab.png?raw=true "Websites Tab")

	_Websites Tab_

1.	Click the **Scale** tab.

	![Scale-tab-azure-websites](Images/scale-tab-azure-websites.png?raw=true "Scale-tab-azure-websites")

	_Scale Tab_

1.	In the **general** section, set the web site mode to **Shared**.

	![Shared Website Mode](Images/shared-wesite-mode.png?raw=true "Shared Website Mode")

	_Shared Website Mode_

1.	Click **Save** at the bottom toolbar.

	![Save Button](Images/save-button.png?raw=true "Save Button")

	_Save Button_

1.	On the **You are changing to a mode that may have a billing impact. Continue?** (If you select **STANDARD**, the confirmation message will be: **Are you sure you want to upgrade from Free to STANDARD web site mode?**), click **Yes**.

	>**Note**: If you receive a "Configuring scale for web site '\<site name\>' failed" error you can use the details button to get more information. You may receive a "Not enough available reserved instance servers to satisfy this request" error. The Websites feature is in preview and we are adding capacity on a measured basis. If you receive this error, you will need to try again later to upgrade your account.

<a name="configure-the-cname-on-your-domain-registrar" />
#### Task 2 - Configuring the CNAME on your domain registrar ####

To configure a custom domain name, you must create a CNAME record in your custom domain name's DNS table. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept is the same. Once you have configured the CNAME record, it will take some time to propagate.

1.	If not already open, browse to the [Microsoft Azure Management Portal ](http://manage.windowsazure.com/) and take note of your web site name.

1.	Log on to your DNS registrar's web site, and go to the page for managing DNS. You might find this in a section, such as Domain Name, DNS, or Name Server Management.

1.	Now find the section for managing CNAME's. You may have to go to an advanced settings page and look for the words CNAME, Alias, or Subdomains.

1.	Finally, you must provide a subdomain alias, such as www. Then, you must provide a hostname, which is your application's _azurewebsites.net_ domain composed by the name you took note in step one and the azurewebsites.net domain (e.g.: www.[YOUR-SITE-NAME].azurewebsites). To verify authorization, create a CNAME resource record with your DNS provider that points from awverify.www.[YOUR-CUSTOM-DOMAIN].com to awverify.[YOUR-SITE-NAME].azurewebsites.net. Your DNS configuration should be similar to the following:

	|**Alias** |**TTL** |**Type** |**Value** |
	|----------------|----------------|----------------|----------------|
	| awverify.www.[YOUR-CUSTOM-DOMAIN].com | 86400 | CNAME | awverify.[YOUR-SITE-NAME].azurewebsites.net |
	| www.[YOUR-CUSTOM-DOMAIN].com | 86400 | CNAME | [YOUR-SITE-NAME].azurewebsites.net |

	This way, using [YOUR-CUSTOM-DOMAIN].com, the previously configured CNAME records forward all traffic from _www.[YOUR-CUSTOM-DOMAIN].com_ to _[YOUR-SITE-NAME].azurewebsites.net_, which is the DNS name of your deployed application.

	> **Note**: It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. 

<a name="task-3---configuring-an-a-record" />
#### Task 3 - Configuring an A record for the domain name####

To configure an A record you must configure a CNAME record used to verify the domain name. This process is the same as the one used to configure a CNAME record to point to your web site, except that you configure the CNAME record domain names that will be used for verification purposes. For example, using [YOUR-CUSTOM-DOMAIN].com, the hostname will be awverify.www.[YOUR-CUSTOM-DOMAIN].com and the value will be awverify.[YOUR-SITE-NAME].azurewebsites.net. Once this is propagated, you can configure the A record.

1.	In your browser, open the [Microsoft Azure Management Portal](http://manage.windowsazure.com/).

1.	In the **Websites** tab, click the name of your site.

1.	Click the **Configure** tab.

	![Configure Tab](Images/configure-tab.png?raw=true "Configure Tab")

	_Configure Tab_

1.	Scroll down until the **domain Names** section and click **manage domains**

	![Domain Names section](Images/domain-names-section.png?raw=true "Domain Names section")

	_Domain Names section_

1.	On the **Manage custom domains** dialog locate **The IP Address to use when configuring A records** and copy the IP address.

	![Manage custom domains dialog box](Images/manage-custom-domains-dialog-box2.png?raw=true "Manage custom domains dialog box")

	_Manage custom domains dialog box_

1.	Log on to your DNS registrar's web site, and go to the page for managing DNS. You might find this in a section, such as Domain Name, DNS, or Name Server Management.

1.	Configure the domain name and the IP address you copied in step 5. Your DNS configuration should be similar to the following:

	| **Alias** | **TTL** | **Type** | **Value** |
	|----------------|----------------|----------------|----------------|
	| awverify.www.[YOUR-CUSTOM-DOMAIN].com | 86400 | CNAME | awverify.[YOUR-SITE-NAME].azurewebsites.net |
	| [YOUR-CUSTOM-DOMAIN].com	 | 7200 | A | [PUBLIC-IP] |

	This way, the previously configured A record forwards all traffic from _[YOUR-CUSTOM-DOMAIN].com_ to _[PUBLIC-IP]_.

<a name="set-the-domain-name-in-management-portal" />
#### Task 4 - Setting the Domain Name in the Management Portal ####

Once the CNAME or A record for domain name has propagated, you must associate it with your web site.

1.	In your browser, open the [Microsoft Azure Management Portal](http://manage.windowsazure.com/).

1.	In the **Websites** tab, click the name of your site.

1.	Click the **Configure** tab.

	![Configure Tab](Images/configure-tab.png?raw=true "Configure Tab")

	_Configure Tab_

1.	Scroll down until the **domain Names** section and click on **manage domains**

	![Domain Names section](Images/domain-names-section.png?raw=true "Domain Names section")

	_Domain Names section_

1.	In the **DOMAIN NAMES** text box type the domain name you have configured. Click the check mark to accept the domain name.

	![Manage custom domains dialog box](Images/manage-custom-domains-dialog-box.png?raw=true "Manage custom domains dialog box")

	_Manage custom domains dialog box_

	Microsoft Azure validates the existence of the hostname in the public DNS before it save changes and updates the internal Microsoft Azure DNS. There are few reasons we are validating the hostname before committing the save. One of the primary reasons is that by waiting until the CNAME change propagates, we can verify that the custom domain belongs to the site owner. Verification allows our router to set up the route for each hostname, and ensures that every hostname belongs to one and only one site.

1. Open internet explorer and browse to http://www.[YOUR-DOMAIN-NAME].com

	![Browse Custom Domain](Images/browse-custom-domain.png?raw=true "Browse Custom Domain")

	_Browse Custom Domain_

---

<a name="configuring-an-ssl-certificate-for-a-windows" />
### Exercise 2: Configuring an SSL certificate for a Microsoft Azure web site ###

The steps in this exercise require you to configure your Websites for standard mode, which may incur additional costs if you are currently using free or shared mode. 

<a name="get-a-certificate" />
#### Task 1 - Getting a Certificate ####

To configure SSL for an application, you first need to get an SSL certificate signed by a Certificate Authority (CA), a trusted third-party who issues certificates for this purpose. If you do not already have one, you will need to obtain one from a company that sells SSL certificates.

The certificate must meet the following requirements for SSL certificates in Microsoft Azure:

-	The certificate must contain a private key.
-	The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.
-	The certificate's subject name must match the domain used to access the web site.
	-	You cannot obtain an SSL certificate from a certificate authority (CA) for the azurewebsites.net domain. You must acquire a custom domain name to use when accessing your web site.
	-	For information on configuring a custom domain name for a Microsoft Azure Web Site, see [Configuring a custom domain name for a Microsoft Azure Web Site]( http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-web-site/).
-	The certificate must use a minimum of 2048-bit encryption.

To get an SSL certificate from a Certificate Authority you must generate a Certificate Signing Request (CSR), which is sent to the CA. The CA will then return a certificate that is used to complete the CSR. Two common ways to generate a CSR are by using the IIS Manager or [OpenSSL](http://www.openssl.org/). IIS Manager is only available on Windows, while OpenSSL is available for most platforms.

> **Note**: When following either series of steps, you will be prompted to enter a Common Name. If you will be obtaining a wildcard certificate to use with multiple domains (contoso.com, www.contoso.com, sales.contoso.com,) then this value should be *.domainname (_e.g.: *.contoso.com_). If you obtain a certificate for a single domain name, this value must be the exact value that users will enter in the browser to visit your web site.

For simplicity of the lab, you will use a script located in the asset folder that will create a certificate that will match Microsoft Azure requirements that is not from a Certified Authority. This is not recommended in production environments.

1. Open the **CreateCert.cmd** file with notepad located in **\Source\Assets\certificates**.

1. In the makecert.exe command, update [YOUR-CUSTOM-DOMAIN] to match the one you registered in exercise 1.

	![CreateCert.cmd file](Images/createcertcmd-file.png?raw=true "CreateCert.cmd file")

	_CreateCert.cmd file_

1. Save the file.

1. Open **Developer Command Prompt**.

	>**Note**: Developer Command Prompt is included in Visual Studio Express for Desktop, Professional and Ultimate. You will use Developer Commnand Prompt to run MakeCert command to create an X.509 certificate. For more information on MakeCert [click here](http://msdn.microsoft.com/en-us/library/windows/desktop/aa386968\(v=vs.85\).aspx)

1. Browse to **Source/Assets/certificates** and execute the **CreateCert** script in the **Developer Command Prompt**.

1. Add the **Private Key** password in the **Create Private Key Password** window and click **OK**.

	![Create Private Key Password](Images/create-private-key-password.png?raw=true "Create Private Key Password")

	_Create Private Key Password_

1. Add the same password in the **Enter Private Key Password** window and click **OK**.

	![Enter Private Key Password](Images/enter-private-key-password.png?raw=true "Enter Private Key Password")

	_Enter Private Key Password_

1. When the script finishes, you will get a **Succeeded** message and the certificates will be created in the **cert** folder.

	![Developer Command Prompt succeeded](Images/developer-command-prompt-succedded.png?raw=true "Developer Command Prompt succeeded")

	_Developer Command Prompt succeeded message_
	
	![Output certificates](Images/output-certificates.png?raw=true "Output certificates")	

	_Output certificates_

<a name="configure-standard-mode" />
#### Task 2 - Configuring standard mode in Microsoft Azure Websites####

Enabling SSL on a web site is only available for the standard mode of Microsoft Azure Websites. Before switching a web site from the free web site mode to the standard web site mode, you must first remove spending caps in place for your Web Site subscription. For more information on shared and standard mode pricing, see [Pricing Details](https://www.windowsazure.com/en-us/pricing/details/).

1.	In your browser, open the [Microsoft Azure Management Portal](https://manage.windowsazure.com/).

1.	In the **Websites** tab, click the name of your web site.

1.	Click the **Scale** tab.

	![Scale-tab-azure-websites](Images/scale-tab-azure-websites.png?raw=true "Scale-tab-azure-websites")

	_Scale Tab_

1.	In the **general** section, set the web site mode to **Standard**.

	![Standard Web Site Mode](Images/standard-web-site-mode.png?raw=true "Standard Web Site Mode")

	_Standard Web Site Mode_

	> **Note:** Before switching a web site from the free web site mode to the shared or standard web site mode, you must first remove spending caps in place for your web site subscription. For more information on shared and standard mode pricing, see [Pricing Details ](https://www.windowsazure.com/en-us/pricing/details/).

1.	Click **Save** and, when prompted, click **Yes**.

	> **Note**: If you receive a "Configuring scale for web site '<site name>' failed" error you can use the details button to get more information. You may receive a "Not enough available reserved instance servers to satisfy this request." error. If you receive this error, you will need to try again later to upgrade your account.

<a name="configure-ssl" />
#### Task 3 - Configuring SSL in Microsoft Azure Websites####

Before performing the steps in this section, you must have associated a custom DNS name with your Microsoft Azure Web Site.

1.	In your browser, open the [Microsoft Azure Management Portal ](https://manage.windowsazure.com/).

1.	In the **Websites** section, click the name of your site and then select the **Configure** tab.

	![Configure Tab](Images/configure-tab.png?raw=true "Configure Tab")

	_Configure Tab_

1.	In the **certificates** section, click **upload a certificate**.

	![Certificate Section](Images/certificate-section.png?raw=true "Certificate Section")

	_Certificate Section_

1.	Using the **Upload a certificate** dialog, select the .pfx certificate file created earlier using the script. Specify the password that was used to secure the .pfx file. Finally, click the **check** to upload the certificate.

	![Upload a certificate](Images/upload-a-certificate.png?raw=true "Upload a certificate")

	_Upload a certificate_

1.	In the **ssl bindings** section of the **Configure** tab, use the dropdowns to select the domain name to secure with SSL, and the certificate to use. You may also select whether to use Server Name Indication (SNI) or IP based SSL.
	-	IP based SSL associates a certificate with a domain name by mapping the dedicated public IP address of the server to the domain name. This requires each domain name (contoso.com, fabricam.com, etc.) associated with your service to have a dedicated IP address. This is the traditional method of associating SSL certificates with a web server.
	-	SNI based SSL is an extension to SSL and Transport Layer Security (TLS) that allows multiple domains to share the same IP address, with separate security certificates for each domain. Most modern browsers (including Internet Explorer, Chrome, Firefox and Opera) support SNI, however older browsers may not support SNI.

	![SSL Bindings](Images/ssll-bindings.png?raw=true "SSLl Bindings")

	_SSL Bindings_

	> **Note:** Adding SSL bindings may have a pricing impact.

1.	Click **Save** to save the changes and enable SSL and, when prompted, click **Yes**.

1. Open Internet Explorer and browse **https://www.[YOUR-DOMAIN-NAME].com**

	![Certificate error](Images/certificate-error.png?raw=true "Certificate error")

	_Certificate error_

	> **Note**: If you are not able to continue to the website, open the Command Line prompt with administrative privileges and execute the following command: "certutil -setreg chain\minRSAPubKeyBitLength 512". To revert this change you need to delete the entry by running "certutil -delreg chain\MinRsaPubKeyBitLength"

1. Click **Continue to this website (not recommended)** and you will be able to browse the default web site.

1. Click the certificate error in the navigation bar and click the **View Certificates** link.

	![Untrusted Certificate dialog](Images/untrasted-certificate-dialog.png?raw=true "Untrusted  Certificate dialog")

	_Untrusted Certificate dialog_

1. In the **Certificate** box you will see the information of the certificate that you uploaded previously.

	![Certificate dialog](Images/certificate-dialog.png?raw=true "Certificate dialog")

	_Certificate dialog_

---

<a name="creating-a-web-application-and-red" />
### Exercise 3: Creating a web application and redirecting request to HTTPS ###

In this exercise you will create a new MVC 4 web application. Once created, you will publish it to your Microsoft Azure Web Site and configure it to redirect HTTP traffic to HTTPS.

<a name="creating-a-new-web-site" />
#### Task 1 - Creating a new Web Site ####

1. Open **Visual Studio 2012 Express for Web**.

1. In the top menu, click **File** | **New Project**.

1. In the **New Project dialog**, expand **Visual C#** in the **Installed** list and select **Web**. Choose the **ASP.NET MVC 4 Web Application** template, set the **Name** of the project to _SecureMVC_ and set a location for the solution. Click **OK** to create the project.

	![New Project dialog](Images/new-project-dialog.png?raw=true "New Project dialog")

	_New Project dialog_

1. In the **New ASP.NET MVC Project** select **Internet Application** and click **OK**.

	![New ASP.NET MVC 4 Project](Images/new-aspnet-mvc-4-project.png?raw=true "New ASP.NET MVC 4 Project")

	_New ASP.NET MVC 4 Project_

	![MVC Internet Application Structure](Images/mvc-internet-application-structure.png?raw=true "MVC Internet Application Structure")

	_MVC Internet Application Structure_

1. Open the **Web.config** file and add the rewrite rule to redirect http content to https.

	<!-- mark:4-17 -->
	````HTML
	<configuration>
	...
	
		<system.webServer>
			<rewrite>
				<rules>
					<clear />
					<rule name="Redirect to https" stopProcessing="true">
						<match url="(.*)" />
						<conditions>
							<add input="{HTTPS}" pattern="off" ignoreCase="true" />
						</conditions>
						<action type="Redirect" url="https://{HTTP_HOST}{REQUEST_URI}" redirectType="Permanent" />
					</rule>
				</rules>
			</rewrite>
		</system.webServer>
	</configuration>
	````

1. Press **Ctrl** + **S** to save the file.

<a name="deploying-to-windows-azure-web-sites" />
#### Task 2 - Deploying to Microsoft Azure Websites ####

1. Open the [Microsoft Azure Management Portal](https://manage.windowsazure.com/).

1. In the **Websites** tab, click on the website you created in the Getting Started section.

1. Go to the **Dashboard** tab and, in the quick glance section at the right of the screen, click **Download the publish profile**

	![Download Publish Profile](Images/download-publish-profile.png?raw=true "Download Publish Profile")

	_Download Publish Profile_

1. Switch back to Visual Studio. Right-click the **SecureMVC** project and select **Publish**.

	![Publish menu](Images/publish-menu.png?raw=true "Publish menu")

	_Publish menu_

1. In the **Profile** tab, click **Import**.

	![Publish Web dialog](Images/publish-web-dialog.png?raw=true "Publish Web dialog")

	_Publish Web dialog_

1. In the **Import Profile Dialog** dialog box, click **Browse** and select the .publishsettings file you downloaded before. Lastly, click **OK**.
 
	![Import Publish Profile dialog](Images/import-publish-profile-dialog.png?raw=true "Import Publish Profile dialog")

	_Import Publish Profile dialog_

1. After importing the publish profile, click **Publish**.

	![Publish Web Site](Images/publish-web-site.png?raw=true "Publish Web Site")

	_Publish Web Site_

1. In the **Output** window in Visual Studio, you should see the deploy progress. After seccessful deploy process, Internet Explorer should automatically redirect to your website.

	![Output Window](Images/output-window.png?raw=true "Output Window")

	_Output Window_

1. Open Internet Explorer if the deploy didn't and browse to **http://www.[YOUR-DOMAIN-NAME].com**. Check how you are redirected to **https://www.[YOUR-DOMAIN-NAME].com**.

	>**Note**: If there is a problem with security certificates, click **Continue to this website (not recommended)**.

	![Default MVC4 Solution deployed to Azure WebSites](Images/default-mvc4-solution-deployed-to-azure-websi.png?raw=true "Default MVC4 Solution deployed to Azure WebSites")

	_Default MVC4 Solution deployed to Azure WebSites_

---

<a name="summary"></a>
## Summary ##

By completing this hands-on lab you learned how to:

- Configure a custom domain in Microsoft Azure Websites 
- Configure a SSL in Microsoft Azure Websites 
- Create a web application and redirecting request to HTTPS 

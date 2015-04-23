<a name="Title"></a>
# Creating Websites in Microsoft Azure Using WebMatrix #

---
<a name="Overview"></a>
## Overview ##

In this hands-on lab you will learn how to create a new Web Site in Microsoft Azure by using a template from the pre-packaged applications gallery. Once created, you will update the site using Web Matrix and deploy the changes.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

* Create a new Web Site in Microsoft Azure by using a pre-packaged application from the templates Gallery
* Update your Web Site using Web Matrix 2 and deploy the changes 

<a name="Prerequisites"></a>
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Microsoft Web Matrix 2](http://www.microsoft.com/web/webmatrix/next/)
- A Microsoft Azure subscription with the Websites Preview enabled - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

>**Note:** This lab was designed to use Windows 7 Operating System.

<a name="Setup"></a>
### Setup ###

In order to execute the exercises in this hands-on lab you need to set up your environment.

1. Open a Windows Explorer window and browse to the lab's **Source** folder.

1. Right click the **Setup.cmd** file and click **Run as administrator**. This will launch the setup process that will configure your environment and install the Visual Studio code snippets for this lab.

> **Note:** Make sure you have checked all the dependencies for this lab before running the setup. 

---

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

1. [Exercise 1: Creating a Microsoft Azure Web Site using the Applications Gallery](#Exercise1)
1. [Exercise 2: Customizing a Web Site using Web Matrix 2](#Exercise2)

<a name="Exercise1"></a>
### Exercise 1: Creating a Microsoft Azure Web Site using the Applications Gallery ###

During this exercise you will create a new web site using the pre-packaged web applications from the Applications Gallery.

1. Go to the [Microsoft Azure Management Portal](https://manage.windowsazure.com/) and sign in using the Microsoft credentials associated with your subscription.

	![Log on to Microsoft Azure portal](images/login.png?raw=true "Log on to Microsoft Azure portal")

	_Log on to Microsoft Azure Management Portal_

1. Click **New** on the command bar.

	![Creating a new Web Site](images/new-website.png?raw=true "Creating a new Web Site")

	_Creating a new Web Site_

1. Click **Web Site** and then **From Gallery**.

	![Creating a new Web Site from the Gallery](images/new-web-site-from-the-gallery.png?raw=true "Creating a new Web Site from the Gallery")

	_Creating a new web site from the gallery_

1. In the **Blogs** category select the **Umbraco CMS 5** application.

	![Umbraco application from Gallery](images/umbraco-cms-5-application.png?raw=true "Umbraco application from Gallery")

	_Umbraco application from Gallery_

1. In the **Configure Your App** page, type an available **Url** (for example, _umbracoSample_) and select **Create a new SQL database** from the **Database** drop-down list. Leave the default database **username** and provide a **password**.

	![Configuring the web site settings](images/web-site-settings.png?raw=true "Configuring the web site settings")

	_Configuring the web site settings_

1. In the **Specify database settings** page, type the database name (for example, _umbracoSampleDB_) and select **New SQL Database server** from the **Server** drop-down list.

	> **Note:** You can also use an existing database server by providing the server name and the administrator's username and password.

	![Configuring the database settings](images/database-settings.png?raw=true "Configuring the database settings")

	_Configuring the database settings_

1. In the **Create a Server** page, configure your database server login username and password. Make sure the **Allow Microsoft Azure services to access the server** option is marked and the password matches the security requirements.

	![Configuring the database administrator account](images/database-admin.png?raw=true "Configuring the database administrator account")

	_Configuring the database administrator account_

1. Once the web site is successfuly created, you will see it listed on the **Websites** section and a message will appear at the bottom of the screen. To start installing Umbraco click on **Setup**.

	![Umbraco Web Site](images/umbraco-web-site.png?raw=true "Umbraco Web Site")

	_Umbraco Web Site_

	> **Note:** Alternatively, you can click on the web site to open it's **Dashboard** and then click the **Site Url** link.
	>
	> ![Umbraco Web Site Dashboard](images/umbraco-web-site-administration.png?raw=true "Umbraco Web Site Dashboard")
	>
	> _Umbraco Web Site Dashboard_
	> 

1. Now you will configure Umbraco to run on Microsoft Azure. Click **Install Umbraco 5.1**.

	![Installing the Umbraco application](images/configuring-umbraco-application.png?raw=true "Installing the Umbraco application")

	_Installing the Umbraco application_

1. The Umbraco installation wizard will start and a Welcome page will show up. Click **Lets get started!** to start the installation process.

	![Installation wizard welcome page](images/umbraco-installation-wizard-welcome.png?raw=true "Installation wizard welcome page")

	_Installation wizard welcome page_

1. On the Database page, select "**I'm an advanced user, let me put in the connection string**".

	![Configuring the Umbraco Database](images/umbraco-connection-string-at-wizard.png?raw=true "Configuring the Umbraco Database")

	_Configuring the Umbraco Database_

1. Go back to the Microsoft Azure Portal and select **SQL Databases** from the menu on the left. 

	![SQL Databases](images/umbraco-database.png?raw=true "SQL Databases")

	_SQL Databases_

1. Click **umbracoSampleDB** to open it's Dashboard. Then click **Show connection strings**.

	![Obtaining Umbraco Database's Connection String](images/umbraco-connection-string.png?raw=true "Obtaining Umbraco Database's Connection String")

	_Obtaining Umbraco Database's Connection String_

1. Copy the **ADO.NET** connection string from the **Connection Strings** dialog.

	![Copying Umbraco ADO.NET Connection String](images/umbraco-adonet-connection-string.png?raw=true "Copying Umbraco ADO.NET Connection String")

	_Copying Umbraco ADO.NET Connection String_

1. Go back to the Umbraco installation and paste the connection string you've just copied. Replace the **{your_password_here}** placeholder with your database server login password. Click **Install** to continue.

	![Configuring the connection string](images/umbraco-inserting-connection-string-at-wizard.png?raw=true "Configuring the connection string")

	_Configuring the connection string_

1. Your application database will be configured and populated with data. Click **Continue** when the process finishes.

	![Configuring the Umbraco database](images/umbraco-database-startup.png?raw=true "Configuring the Umbraco database")

	_Configuring the Umbraco database_

1. The next step is to create an Umbraco admin user account. Enter the requested information and then click **Create User**.

	![Creating Umbraco's Admin User](images/umbraco-application-admin.png?raw=true "Creating Umbraco's Admin User")

	_Creating Umbraco's Admin User_

1. Install a starter kit by clicking **Install** as shown in the figure below. 

	> **Note:** Umbraco starter kits allow you to easily bootstrap your Umbraco site, providing out-of-the-box sections and styles.

	![Installing a Starter Kit](images/install-starter-kit.png?raw=true "Installing a Starter Kit")

	_Installing a Starter Kit_

1. Wait until the application restarts. Once completed click **Continue**. 

	![Starter Kit Installation Successful](images/install-starter-kit-finished.png?raw=true "Starter Kit Installation Successful")

	_Starter Kit Installation Successful_

1. You will see the installation wizard final screen. Click **Preview your new website** to open your application.

	![Wizard completed](images/wizard-final-screen.png?raw=true "Wizard completed")

	_Wizard completed_

1. The **Umbraco Homepage** will be opened.

	![Umbraco's Homepage](images/umbraco-homepage.png?raw=true "Umbraco's Homepage")

	_Umbraco's Homepage_

<a name="Exercise2"></a>
### Exercise 2: Customizing a Web Site using Web Matrix 2 ###

During this exercise you will use Web Matrix 2 to update your application. You will add a Facebook's Like Button to the book view.

1. Go to the [Microsoft Azure Management Portal](https://manage.windowsazure.com/) and sign in using the Microsoft credentials associated with your subscription.

	![Log on to Microsoft Azure portal](images/login.png?raw=true "Log on to Microsoft Azure portal")

	_Log on to Microsoft Azure Management Portal_

1. Select the Umbraco Web Site (_umbracoSample_) to open the web site Dashboard and click the **Download publish profile** link. 

	> **Note:** The _publish profile_ contains all of the information required to publish a web application to a Microsoft Azure website for each enabled publication method. The publish profile contains the URLs, user credentials and database strings required to connect to and authenticate against each of the endpoints for which a publication method is enabled. Both **Microsoft WebMatrix** and **Microsoft Visual Web Developer** support reading publish profiles to automate configuration of these programs for publishing web applications to Microsoft Azure websites. 

	![Download Publish Profile](images/download-publish-profile.png?raw=true "Downloading Publish Profile")

	_Downloading Publish Profile_

1. Save the file to a known location.

	![Save Publish Profile](images/save-publish-profile.png?raw=true "Saving Publish Profile")

	_Saving the Publish Profile_

1. Open Web Matrix 2.

1. In the **Open Site** option in Web Matrix, select **Remote Site**.

	![Opening a Web Site](images/webmatrix-open-site.png?raw=true "Opening a Web Site")

	_Opening a Web Site_

1. Click **Import publish settings** and select the publish profile file you have just downloaded.

	![Importing Publish Settings](images/webmatrix-import-publish-settings.png?raw=true "Importing Publish Settings")

	_Importing Publish Settings_

1. After selecting the file, enter a **Site Name** and click **OK**.

	![WebMatrix Remove Site Name](images/webmatrix-remote-site-name.png?raw=true "WebMatrix Remove Site Name")

	_WebMatrix Remote Site Name_

1. Open the **Views** folder and double-click the **BookPage.cshtml** view.

	![Book's View](images/webmatrix-bookpage-view.png?raw=true "Book's View")

	_Book's View_

1. Add the following code just before the `<div class="product-page cf">` element.

	With this code you are including the JavaScript SDK (JS SDK), enabling you to use Facebook social plugins.

	````JavaScript
	<div id="fb-root"></div>
	<script>
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>
	````

	>**Note:** You can read more about Facebook Like button [here](http://developers.facebook.com/docs/reference/plugins/like/).
	
	
	![Adding Facebook's SDK code](images/bookview-fbsdk.png?raw=true "Adding Facebook's SDK code")

	_Adding Facebook's SDK code_

1. Add the following code just before the `<Options>` header.

	> **Note:** The Like button lets a user share your content with friends on Facebook. When the user clicks the Like button on your site, a story appears in the user's friends' News Feed with a link back to your website.

	````HTML
	<div class="fb-like"
		data-href="@HttpContext.Current.Request.Url.ToString()" 
		data-send="false" data-width="100" data-show-faces="false">
	</div>
	````

	![Adding Facebook's Like button](images/webmatrix-fbbutton.png?raw=true "Adding Facebook's Like button")

	_Adding Facebook's Like button_
	
	>**Note:** 
	>
	> * The **data-href** attribute specifies the URL to like. In this example, the current URL.
	> * The **data-send** attribute specifies wheter to include a Send button with the Like button. In this example, it's set to false.

1. Save the edited file.

1. Click the **Run** button on the WebMatrix menu ribbon to open your site. Click on **Books** to open the books page.

	![Umbraco's Homepage](images/umbraco-homepage-webmatrix.png?raw=true "Umbraco's Homepage")

	_Umbraco's Homepage_

1. Click on **Umbraco's User Guide** or any of the other book's pages to open the book details page.

	![Umbraco's Books page](images/umbraco-books-webmatrix.png?raw=true "Umbraco's Books page")

	_Umbraco's Books page_

1. In the book's detail page you will see the Facebook **Like** button you've just added.

	![Viewing the Like button](images/umbraco-like-button.png?raw=true "Viewing the Like button")

	_Viewing the Like button_

<a name="Summary"></a>
## Summary ##

In this hands-on lab you have learned how to create a new Web Site in Microsoft Azure by using a template from the pre-packaged applications gallery. Once created, you updated the site using Web Matrix and deployed the changes. This hands-on lab offers a glimpse into how simple web site development is when using WebMatrix and Microsoft Azure Websites together. 

<a name="Title" />
# Creating Websites in Microsoft Azure (OS X) #

---
<a name="Overview" />
## Overview ##

In this hands-on lab you will learn how to create a new web site in Microsoft Azure by using a template from the pre-packaged applications gallery. Once created, you will edit the site using a text editor and update the site using FTP.

<a name="Objectives" />
### Objectives ###

In this hands-on lab, you will learn how to:

* Create a new Web Site in Microsoft Azure by using a pre-packaged application from the templates Gallery
* Update your Web Site by editing files using a text editor and update the site using FTP

<a name="Prerequisites" />
### Prerequisites ###

The following is required to complete this hands-on lab:

- A Microsoft Azure subscription with the Websites Preview enabled - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

> **Note:** This lab was designed to use Mac OS X Operating System

---

<a name="Exercises" />
## Exercises ##

This hands-on lab includes the following exercises:

1. [Exercise 1: Creating a Microsoft Azure Web Site using the Applications Gallery](#Exercise1)
1. [Exercise 2: Customizing a Web Site on OS X using a text editor and update the site using FTP](#Exercise2)

<a name="Exercise1" />
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

1. In the **Blogs** category select the **WordPress** application.

	![WordPress application from Gallery](images/wordpress-application.png?raw=true "WordPress application from Gallery")

	_WordPress application from gallery_

1. In the **Configure Your App page**, type an available **Url** (for example, _wpressSample_) and select **Create a new MySQL database** from the **Database** drop-down list. 

	![Configure Web Site](images/web-site-settings.png?raw=true "Configure Web Site")

	_Configuring Web Site_

1. In the **Create New Database** page, type the database name or use the default name given by the portal. Select the checkbox to accept the legal terms, then click the confirmation button to complete the creation of the Web Site.

	![Configuring Database Settings](images/database-settings.png?raw=true "Configuring Database Settings")

	_Configuring **Database Settings**_

1. Once the web site is created, you will see it listed on the **Websites** section.

	![WordPress Web Site](images/wordpress-web-site.png?raw=true "WordPress Web Site")

	_WordPress Web Site_

1. Click the web site to open its **Dashboard**, and then click the **Site Url** link to browse to the new site.

	![WordPress Web Site Dashboard](images/wordpress-web-site-administration.png?raw=true "WordPress Web Site Dashboard")

	_WordPress Web Site Dashboard_

1. Now you will configure **WordPress** for running on **Microsoft Azure**. Complete the **Site Title**, **Username**, **Password** and **E-mail** fields. Then, click **Install WordPress**.

	![Configuring WordPress Application](images/configuring-wordpress-application.png?raw=true "WordPress Web Site Administration")

	_Installing the WordPress Application_

1. The WordPress installation will start. Once the process is completed, a screen will be opened showing the final status. Click **Log In** to access the Word Press application.

	![Installation Successful](images/wordpress-installation-success.png?raw=true "Installation Successful")

	_Installation Successful_

1. Enter the **Username** and **Password** previously configured, then click **Log In** to open the administration site.

	![WordPress Login](images/wordpress-login-screen.png?raw=true "WordPress Login")
	
	_WordPress Login_

1. To open the WordPress blog, on the administration site you can click on the link with the site's name, located on the upper-left corner of the page, in our case **WordPress Sample**. 

	![WordPress Admin Site](images/wordpress-sample-admin.png?raw=true "WordPress Admin Site")

	_WordPress Admin Site_

1. A sample "Hello World" blog post will be shown. On the next exercise you will learn how to customize blog pages by using the FTP publishing feature.

	![WordPress "Hello World" sample post](images/wordpress-sample-site.png?raw=true "WordPress "Hello World" sample post")

	_WordPress "Hello World" sample post_

<a name="Exercise2"></a>
### Exercise 2: Customizing a Web Site on OS X using a text editor and update the site using FTP ###

During this exercise you will use the FTP publishing feature to update the web site by adding the Facebook's **Like** button to blog posts.

1. Go to the Microsoft Azure portal dashboard and copy the **FTP HOSTNAME**.
	
	![Obtaining the FTP deployment hostname](images/ftp-hostname.png?raw=true "Obtaining the FTP deployment hostname")

	_Obtaining the FTP deployment hostname_

1. Go back to the command prompt and connect to the FTP publishing service by running the following command (replace the hostname with the value obtained from the portal).

	````CommandPrompt
	ftp waws-prod-blu-001.ftp.azurewebsites.windows.net
	````	
	
	![Connecting to the FTP server](images/ftp-connect.png?raw=true "Connecting to the FTP server")

	_Connecting to the FTP server_
		
	>**Note**: Replace the first **waws-prod-blu-001.ftp.azurewebsites.windows.net** value with the one obtained from the portal. Also remove the **ftp://** prefix as depicted above.

1. Provide the **User Name** and **Password** of your deployment credentials. Make sure that the **User Name** is prefixed by the **Web Site** name (e.g. **wpressSample\admin**)

	![Providing FTP credentials](images/ftp-user-pass.png?raw=true "Providing FTP credentials") 

	_Providing FTP credentials_
	
	> **Note:** Deployment credentials are other than the Live ID associated with your Microsoft Azure subscription and are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click Ok.

	>
	>![Entering the username and password](images/deployment-credentials.png?raw=true "Setting the user name and password")
	>
	>_Entering the username and password_

1. Go to the **wp-content | themes | twentyeleven** folder, download **single.php** using the **GET** ftp command.

   ````CommandPrompt
   get site/wwwroot/wp-content/themes/twentyeleven/single.php single.php
   ```` 

   ![Downloading single.php](images/ftp-download-single.png?raw=true "Downloading single.php")

   _Downloading single.php_

1. Open **single.php** in a text editor.

	![Opening single.php](images/textedit-edit-single.png?raw=true "Opening single.php")

	_Opening single.php_

1. Add the following code just before the `<div id="content" role="main">` element. Save the file.

	````JavaScript
	<div id="fb-root"></div>
	<script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script>
	<fb:like href="<?php echo get_permalink(); ?>" show_faces="true" width="450"></fb:like>
	````

	>**Note:** With this code you are including the JavaScript SDK (JS SDK), enabling you to use Facebook social plugins.
	> You can read more about Facebook Like button [here](http://developers.facebook.com/docs/reference/plugins/like/).
	
	![Adding Facebook's Like Button](images/single-fbsdk.png?raw=true "Adding Facebook's Like Button")
	
	_Adding Facebook's Like Button_


1. Upload the **single.php** file using the **PUT** ftp command.

	````CommandPrompt
	put single.php site/wwwroot/wp-content/themes/twentyeleven/single.php
	````

	![Uploading the single.php file](images/ftp-put.png?raw=true "Uploading the single.php file")

	_Uploading the single.php file_

1. Now, open the WordPress blog to see the Facebook's **Like Button** you've just added.

	![Facebook's Like Button](images/wordpress-fb-like-button.png?raw=true "Facebook's Like Button")

	_Facebook's Like Button_
	
<a name="Summary" />
## Summary ##

In this hands-on lab you have learned how to create a new web site in Microsoft Azure by using a template from the pre-packaged applications gallery. Once created, you updated the site using a text editor and updated the site files using FTP.

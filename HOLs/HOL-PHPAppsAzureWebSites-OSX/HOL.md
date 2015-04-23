<a name="Title" />
# Building and Publishing PHP Applications with Microsoft Azure Websites (OS X) #

---
<a name="Overview" />
## Overview ##

In this hands-on lab, you will explore the basic elements of the Microsoft Azure **Websites** service by creating a simple [PHP](http://www.php.net) application and deploying it using **FTP deployment**.

<a name="Objectives" />
### Objectives ###

In this hands-on lab, you will learn how to:

- Create the Web Site from the Microsoft Azure portal
- Create a simple PHP application and deploy it using FTP
- Create a new Web Site with the Git publishing feature enabled using the Microsoft Azure Command-Line Tools for Mac and Linux and then deploy the application using GIT

<a name="Prerequisites" />
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Mac OS X](http://www.apple.com/macosx/)
- [GIT Version Control System](http://git-scm.com/download)
- [Node.js](http://nodejs.org/#download) 
- [Microsoft Azure Command-Line Tools for Mac and Linux](https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/)

	>**Note:** If you do not have the Microsoft Azure Command-Line Tools for Mac and Linux installed, open a terminal and run the following command:
	>
	>````ShellScript
	>sudo npm install azure-cli -g
	>````
	>
	>By using -g, Microsoft Azure Command-Line Tools will install on your machine globally. That means, you will be able to execute azure commands from any location.

- A Microsoft Azure subscription with the Websites Preview enabled - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

>**Note:** This lab was designed to use the OS X Operating System.

---

<a name="Exercises" />
## Exercises ##

This hands-on lab includes the following exercises:

1.	[Creating and publishing PHP application in Microsoft Azure Websites](#Exercise1)
1.	[Using the Microsoft Azure Command-Line Tools for Mac and Linux for publishing PHP applications](#Exercise2)

---

<a name="Exercise1" />
### Exercise 1: Creating and Publishing PHP Applications in Microsoft Azure Websites ###

In the first exercise you will provision a new web site from the Microsoft Azure portal, create a simple PHP application using FTP, and finally publish the application taking advantage of the FTP endpoint provided by Microsoft Azure.

<a name="Ex1Task1" />
#### Task 1 – Creating a new Web Site from Microsoft Azure Portal ####

1. Go to the [Microsoft Azure portal](https://manage.windowsazure.com/) and sign in using  your account credentials.

	![Log on to the Microsoft Azure portal](images/login.png?raw=true "Log on to the Microsoft Azure portal")

	_Log on to the Microsoft Azure portal_

1. Click the **New** link on the bottom.

	![Creating a new Web Site](images/new-web-site.png?raw=true "Creating a new Web Site")

	_Creating a new Web Site_

1. Select **WEB SITE | QUICK CREATE**. Provide an available prefix for the new web site, and click **CREATE WEB SITE**.

	![Creating a new Web Site using Quick Create](images/quick-create.png?raw=true "Creating a new Web Site using Quick Create option")

	_Creating a new Web Site using Quick Create_

1. Wait until the new web site is created.

	![Creating new web site status](images/creating.png?raw=true "Creating new web site status")

	_Creating new web site status_

1. Once the web site is created, click the **URL** link to check that it is working.

	![Navigating the placeholder web site](images/navigate-website.png?raw=true "Navigating the placeholder web site")

	_Navigating the placeholder web site_

1. Go back to the portal and click the web site **NAME** column to open the site dashboard.

	![Selecting the dashboard tab](images/go-to-the-dashboard.png?raw=true "Selecting the dashboard tab")
	
	_Selecting the dashboard tab_

<a name="Ex1Task2" />
#### Task 2 – Creating a New Simple PHP Application and Publishing it Using FTP ####

1. Open a new command prompt window and create a new folder for the web site (e.g. **phpsample**). Then change the current directory to the one you have created.

	````CommandPrompt
	mkdir phpsample
	cd phpsample
	````

	![Creating phpsample folder](images/create-website-folder2.png?raw=true "Creating phpsample folder")

	_Creating phpsample folder_

1. Create a new file and name it **index.php**.

	````CommandPrompt
	touch index.php
	````

1. Open **index.php** using **TextEdit** and write the following code snippet.

	````php
	<!DOCTYPE html>
	<html>
	<head>
		<title>Microsoft Azure Websites - Hello World sample!</title>
	</head>

	<body>
		<h1>Microsoft Azure Websites - Hello World sample!</h1>

		<?php
			// Show all information, defaults to INFO_ALL
			phpinfo();
		?>
	</body>
	</html>
	````
	
	![Writing a PHP hello world sample code](images/index-php.png?raw=true "Writing a PHP hello world sample code")

	_Writing a PHP hello world sample code_

1. Save **index.php** file and close TextEdit.

1. Go to the Microsoft Azure portal dashboard and copy the **FTP HOSTNAME**.
	
	![Obtaining the FTP deployment hostname](images/ftp-hostname.png?raw=true "Obtaining the FTP deployment hostname")

	_Obtaining the FTP deployment hostname_

1. Go back to the command prompt and connect to the FTP publishing service by running the following command (replace the hostname with the value obtained from the portal).

	````CommandPrompt
	ftp s1.ftp.azurewebsites.com
	````	
	>**Note**: Replace the first **s1.ftp.azurewebsites.com** value with the one obtained from the portal (without the **ftp://** prefix).

1. Enter the **User Name** and the **Password** of your deployment credentials. Make sure that the **User Name** is preceeded by the name of your web site (e.g. **phpsample\admin**).
	
	> **Note:** Deployment credentials are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click Ok.

	>
	>![Entering the username and password](images/deployment-credentials.png?raw=true "Setting the user name and password")
	>
	>_Entering the username and password_

1. Upload the **index.php** file using the **PUT** ftp command.

	````CommandPrompt
	put index.php /site/wwwroot/index.php
	````

	![Uploading the index.php file](images/ftp-put.png?raw=true "Uploading the index.php file")

	_Uploading the index.php file_
	
1. Finally, browse to the published web site to make sure the application is running successfully (you can find the web site **URL** in Microsoft Azure portal dashboard).

	![Obtaining the Web Site url](images/site-url.png?raw=true "Obtaining the Web Site url")
	
	_Obtaining the Web Site url_
		
	![Browsing to the online sample](images/sample-running.png?raw=true "Browsing to the online sample")
	
	_Browsing to the online sample_
	
---
	
<a name="Exercise2" />
### Exercise 2: Using the Microsoft Azure Command-Line Tools for Mac and Linux for Publishing PHP Applications ###

In this exercise you will use the Microsoft Azure Command-Line Tools for Mac and Linux to download your management certificate, create a new Web Site with GIT publishing enabled, and finally create a simple PHP file and deploy it by pushing the changes to the remote repository.

<a name="Ex2Task1" />
#### Task 1 – Downloading and Importing your Management Certificate  ####

1. Open a new terminal window and execute the **account download** command to download your Microsoft Azure subscription **publish settings** file.

	````CommandPrompt
	azure account download
	````

	![Downloading the publish settings file](images/account-download.png?raw=true "Downloading the publish settings file")

	_Downloading the publish settings file_

	> **Note:** The settings file contains certificate information. 

1. A new browser window will pop up. Log in using the credentials associated with your Microsoft Azure subscription.

	![Log on to the Microsoft Azure portal](images/login.png?raw=true "Log on to the Microsoft Azure portal")

	_Log on to the Microsoft Azure portal_
	
1. Your publish settings will be downloaded to your browser's default download folder (usually ~/Downloads) and a new page with relevant information will be displayed.

	![How to import account's publish settings file](images/publish-profile-info.png?raw=true "How to import account's publish settings file")

	_How to import account's publish settings file_

1. Go back to the command prompt and import the file downloaded in the step above by running the following command. Specify the **publish profile** file location.

	````CommandPrompt
	azure account import ~/Downloads/account-credentials.publishsettings
	````

	![Importing the publish settings file](images/import-publish-settings.png?raw=true "Importing the publish settings file")

	_Importing the publish settings file_

<a name="Ex2Task2" />
#### Task 2 – Creating a new Web Site with GIT Publishing ####

1. Create a new folder for the new web site (e.g. **phpsamplecli**) and change the current directory to it.

	````CommandPrompt
	mkdir phpsamplecli
	cd phpsamplecli
	````
	
1. Run the following **site create** command to create a new site with **GIT publishing** feature enabled. Choose a region when prompted.

	````CommandPrompt
	azure site create --git phpsamplecli
	````

	![Creating a new web site and enabling GIT publishing](images/create-website-with-git.png?raw=true "Creating a new web site and enabling GIT publishing")

	_Creating a new web site and enabling GIT publishing_
	
1. Go back to the terminal window and create a new file called **index.php**.

	````CommandPrompt
	touch index.php
	````
	
	![Creating a new index.php file](images/create-index-file.png?raw=true "Creating a new index.php file")

	_Creating a new index.php file_

1. Open the **index.php** file using **TextEdit** and write the following code snippet.

	````php
	<!DOCTYPE html>
	<html>
	<head>
		<title>Microsoft Azure Websites - Hello World sample!</title>
	</head>

	<body>
		<h1>Microsoft Azure Websites - Hello World sample!</h1>

		<?php
			// Show all information, defaults to INFO_ALL
			phpinfo();
		?>
	</body>
	</html>
	````
	
	![Writing a PHP hello world sample code](images/index-php.png?raw=true "Writing a PHP hello world sample code")

	_Writing a PHP hello world sample code_

1. Save the **index.php** file and close TextEdit.

<a name="Ex2Task3" />
#### Task 3 – Deploying the Web Site using GIT ####

1. Stage the new file, commit and push the changes to the git repository running the commands below. Enter the deployment password when prompted.

	````CommandPrompt
	git add .
	git commit -a -m "# initial commit"
	git push azure master
	````
	
	![Deploying the Web Site using GIT](images/git-deployment.png?raw=true "Deploying the Web Site using GIT")

	_Deploying the Web Site using GIT_

	>Deployment credentials are other than the account associated with your Microsoft Azure subscription and are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click OK.

	>
	>![Entering the username and password](images/deployment-credentials.png?raw=true "Setting the user name and password")
	>
	>_Entering the username and password_

1. Browse the Web Site using the **site browse** command to make sure the site is deployed.

	````CommandPrompt
	azure site browse phpsamplecli
	````
	
	![Browsing the Web Site](images/browse-command.png?raw=true "Browsing the Web Site")

	_Browsing the Web Site_

---

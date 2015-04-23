<a name="Title" />
# Building and Publishing Node.js Applications with Microsoft Azure Websites (OS X) #

---
<a name="Overview" />
## Overview ##

In this hands-on lab, you will learn the basics of the Microsoft Azure Websites service for Node.js applications. In Exercise 1, you will see how to use the Microsoft Azure portal for creating a web site and then publish a "Hello World" Node.js application using GIT. In Exercise 2, you will learn how to use the Microsoft Azure Command-Line Tools for publishing applications. 
<a name="Objectives" />
### Objectives ###

In this hands-on lab, you will learn how to create and publish a Node.js application using:

* Git
* Microsoft Azure Command-Line Tools for Mac and Linux

<a name="Prerequisites" />
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Git Version Control System](http://git-scm.com/) 
- [Node.js](http://nodejs.org/#download) 
- [Microsoft Azure Command-Line Tools for Mac and Linux](https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/) (for Exercise 2 only)

	>**Note:** If you do not have Microsoft Azure Command-Line Tools for Mac and Linux installed, open a terminal and run the following command:
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

1. [Building and Publishing a Node.js Web Site using GIT](#Exercise1)
1. [Building and Publishing a Node.js Web Site using the Command-Line Tools](#Exercise2)

---

<a name="Exercise1" />
### Exercise 1: Building and Publishing a Node.js Web Site using GIT ###

In the first exercise you will create a new web site from the Microsoft Azure portal, create a 'Hello World' Node.js application and finally publish it, taking advantage of the new GIT publishing feature provided by Microsoft Azure.

<a name="Ex1Task1" />
#### Task 1 – Creating a New Web Site Hosted in Microsoft Azure ####

1. Go to the [Microsoft Azure portal](https://manage.windowsazure.com/) **Microsoft Azure portal** and sign in using the **Microsoft Account** credentials associated with your subscription.

	![Log in into Microsoft Azure portal](images/log-in-into-windows-azure-portal.png?raw=true "Log in into Microsoft Azure portal")

	_Log on into Microsoft Azure portal_

1. In Microsoft Azure portal home page, click the **New** button located on the bottom bar.

	![Creating a new web site](images/creating-a-new-web-site.png?raw=true "Creating a new Web Site")

	_Creating a new web site_

1. Click **Web Site | Quick Create**. Provide an available URL for the new web site, select a region, and click **Create Web Site**.

	![Creating a new Web Site using the Quick Create option](images/creating-a-new-web-site-using-quick-create-op.png?raw=true "Creating a new Web Site using Quick Create option")

	_Creating a new Web Site using Quick Create option_

1.  Wait until the new web site is created.

	![Creating new web site status](images/creating-new-web-site-status.png?raw=true "Creating new web site status")

	_Creating new web site status_

1. Once the web site is created click on the **URL** link to check that the new web site is working.

	![Browsing to the new web site](images/browsing-to-new-site.png?raw=true "Browsing to the new web site")

	_Browsing to the new web site_

	![Web site running](images/web-site-running.png?raw=true "Web site running")

	_Web site running_

1. Go back to the portal and click the web site name column to go to the site's dashboard.

	![Selecting the dashboard tab](images/selecting-the-dashboard-tab.png?raw=true "Selecting the dashboard tab")

	_Selecting the dashboard tab_

1. Click the **Set up Git publishing** link.

	![Setting up Git Publishing](images/setting-up-git-publishing.png?raw=true "Setting up Git Publishing")

	_Setting up Git Publishing_

1. Wait a few seconds until the Git repository is ready.

	![Git repository created](images/git-repository-created.png?raw=true "Git repository created")

	_Git repository created_

1. Do not close the portal.

<a name="Ex1Task2" />
#### Task 2 - Creating a new Node.js Website ####
 
1. Create a new folder in a location that can be easily accessed.

1. Open your favorite text editor and copy the following code that will send the string *Hello World* to the browser. Save the file as **server.js** in the folder you have previously created.
 
	```Javascript
	var http = require('http');
	var port = process.env.port || 1337;
	http.createServer(function (req, res) {
					  res.writeHead(200, { 'Content-Type': 'text/plain' });
					  res.end('Hello World\n');
	}).listen(port);
	```
 
1. Create a new text file and paste the following code. Save the file as **package.json** in the same folder.
 
	```Json
	{
	  "name": "HelloWorld",
	  "version": "0.0.1",
	  "description": "",
	  "main": "./server.js",
	  "engines": { "node": ">= 0.6.0" }
	}
	```

	>**Note:** The package.json file tells the Node.js package manager (npm) how your package is structured, and which are the module dependencies. As this application is very simple it does not require dependencies, but in more complex applications you will probably need to specify a "dependencies" property. When publishing applications with Git, the Microsoft Azure platform automatically installs all the dependencies declared in this file.
 
1. In the text editor create a new file and paste the following code. This configuration indicates that the **server.js** file is a Node.js application
that should be handled by the **iisnode** module.
 
	> **Note:** The [iisnode](https://github.com/tjanczuk/iisnode) project provides a native IIS 7.x module that allows hosting of node.js applications in IIS 7.x.

	```XML
	<?xml version="1.0" encoding="utf-8"?>
	<configuration>
		<system.webServer>
			  <modules runAllManagedModulesForAllRequests="false" />

			  <!-- indicates that the server.js file is a node.js application 
				to be handled by the iisnode module -->
			  <handlers>
				<add name="iisnode" path="server.js" verb="*" modules="iisnode" />
			  </handlers>
			  <rewrite>
				<rules>
				  <clear />
				  <rule name="app" enabled="true" patternSyntax="ECMAScript" stopProcessing="true">
					<match url="server\.js.+" negate="true" />
					<conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
					<action type="Rewrite" url="server.js" />
				  </rule>
				</rules>
			  </rewrite>
		</system.webServer>
	</configuration>
	```
 
1. Save the file as **web.config** in your web site folder.

<a name="Ex1Task3" />
#### Task 3 – Publishing the Node.js application using Git####

1. Go back to the portal. Open the site's **Dashboard** and copy the **Git Clone Url** value from the bottom of the page.

	![Git Clone Url](images/git-clone-url.png?raw=true)

	_Copying the Git Clone Url_

1. In order to publish your local files, open a **Terminal** console, change directories to your application folder and run the following commands.

	```Terminal
	git init
	git add .
	git commit -m "initial commit"
	```

	> **Note:** You can learn more about Git commands in http://git-scm.com/documentation.

1. To add the remote Microsoft Azure repository and push the files, run the following commands. Replace the _{Git Clone Url}_ placeholder with the value obtained from the portal.

	```Terminal
	git remote add azure {Git Clone Url}
	git push azure master
	```

1. Enter the deployment credentials when prompted.

	> **Note:** Deployment credentials are other than the **Microsoft Account** associated with your Microsoft Azure subscription and are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click Ok.
	>
	>![Resetting the deployment credentials](images/deployment-credentials.png?raw=true "Resetting the deployment credentials")
	>
	>_Resetting the deployment credentials_

1. Go to the site's **Dashboard** and click the **Site Url** link to ensure that the site is running. A _Hello Word_ message will be shown.

	![Running the Node.js application](images/running-the-nodejs-application.png?raw=true "Running the Node.js application")

	_Running the Node.js application_

---

<a name="Exercise2" />
### Exercise 2: Building and Publishing a Node.js Web Site using the Command-Line Tools ###

In this exercise, you will learn how manage Websites using the Microsoft Azure Command-Line Tools for Mac and Linux.

> **Note:** These steps assume you have the Microsoft Azure Command-Line Tools for Mac and Linux installed.

1. Open a **Terminal** console and execute the following command to download your account's **publish settings** file. A new browser window will pop up. Log on using your **Microsoft Account** credentials associated with your Microsoft Azure subscription.
    
	```Terminal
	azure account download
	```

	Your publish settings will be downloaded to your browser's default download folder (usually ~/Downloads) and a new page with relevant information will be displayed.

	![Downloading the publish settings file](images/download-publishsettings.png?raw=true "Downloading the publish settings file")

	_Downloading the publish settings file_

1. Go back to the **Terminal** console and import the file downloaded in the previous step by running the following command, specifying the **publish settings** file location in the _{publish_settings_file}_ placeholder.

	```Terminal
	azure account import {publish_settings_file}
	```

1. Execute [Task 2 from Exercise 1](#Ex1Task2) to create a Node.js site, but placing the files in a different folder.

1. Go back to the **Terminal** console and change directories in order to go to the folder where you placed the files.

1. Run the following command to create the Microsoft Azure Web Site with **GIT publishing** feature enabled.

	```Terminal
	azure site create --git
	```

	Provide a site name when prompted, for example **nodejsappOSXcli**. Then select a region and proceed.

	![Creating a new Web Site and enabling GIT publishing](images/new-web-site-cli.png?raw=true "Creating a new Web Site and enabling GIT publishing")

	_Creating a new Web Site and enabling GIT publishing_

	> **Note:** By specifying **--git** when running the command **site create** you don't need to run additional commands to initialize the Git repository or add the git remote, since these two tasks will be done automatically by the Microsoft Azure Command-Line Tools.

1. Now you will add the application files to a Git repository and push them to the Microsoft Azure Web Site. To do this, go back to the command prompt and execute the following commands. When prompted provide your deployment credentials.

	```Terminal
	git add .
	git commit -m "initial commit"
	git push azure master
	```
	![Pushing the site files](images/push-site.png?raw=true "Pushing the site files")

	_Pushing the site files_

	> **Note:** Deployment credentials are other than the **Microsoft Account** associated with your Microsoft Azure subscription and are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click Ok.
	>
	>![Resetting the deployment credentials](images/deployment-credentials.png?raw=true "Resetting the deployment credentials")
	>
	>_Resetting the deployment credentials_

1. Run the following command to open the published deployments for your site in Microsoft Azure portal.

	```Terminal
	azure site portal
	```

	In Microsoft Azure portal, select your site from the list and open the **Deployments** page of the site. Check out the latest deployment.

	![Site deployments](images/site-deployments.png?raw=true "Site deployments")

	_Site deployments_

1. Execute the following command to browse to the published web site and make sure it works.

	```Terminal
	azure site browse
	```

	![Web site working](images/website-working-cli.png?raw=true "Web site working")

	_Web site working_

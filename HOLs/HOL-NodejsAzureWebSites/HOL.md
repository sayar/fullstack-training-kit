<a name="Title" />
# Building and Publishing Node.js Applications with Microsoft Azure Websites (Windows) #

---
<a name="Overview" />
## Overview ##

In this hands-on lab, you will learn the basics of the Microsoft Azure Websites service for Node.js applications. In Exercise 1, you will see how to use the Microsoft Azure Management Portal for creating a web site and then publish a "Hello World" Node.js application using GIT. In Exercise 2, you will learn how to use the Microsoft Azure Command-Line Tools for publishing applications. Finally, in exercise 3 you will explore the WebMatrix 2 features for building and publishing Node.js web applications in Microsoft Azure.

<a name="Objectives" />
### Objectives ###

In this hands-on lab, you will learn how to create and publish a Node.js application using:

- Git
- Microsoft Azure Command-Line Tools
- WebMatrix 2

<a name="Prerequisites" />
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Git Version Control System](http://git-scm.com/) 
- [Microsoft WebMatrix 2](http://go.microsoft.com/?linkid=9809776) (for exercise 3 only)
- [Node.js](http://nodejs.org/#download) 
- [Microsoft Azure Command-Line Tools](https://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/) (for exercise 2 only)

	>**Note:** If you do not have Microsoft Azure Command-Line Tools installed, open a command prompt with administrator privileges and run the following command:
	>
	>````PowerShell
	>npm install azure-cli -g
	>````
	>By using -g, Microsoft Azure Command-Line Tools will install on your machine globally. That means, you will be able to execute azure commands from any location.

- A Microsoft Azure subscription with the Websites Preview enabled - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

>**Note:** This lab was designed to use Windows 7 Operating System.

<a name="Setup"/>
### Setup ###

In order to execute the exercises in this hands-on lab you need to set up your environment.

1. Open a Windows Explorer window and browse to the lab’s **Source** folder.

1. Right-click the **Setup.cmd** file and click **Run as administrator**. This will launch the setup process that will automatically check and install all the requirements.

---
<a name="Exercises" />
## Exercises ##

This hands-on lab includes the following exercises:

1. [Building and Publishing a Node.js Web Site using GIT](#Exercise1)
1. [Building and publishing a Node.js Web Site using the Command-Line Tools](#Exercise2)
1. [Building and Publishing a Node.js Web Site using WebMatrix 2](#Exercise3)

<a name="Exercise1" />
### Exercise 1: Building and Publishing a Node.js Web Site using GIT ###

In the first exercise you will create a new web site from the Microsoft Azure portal, create a 'Hello World' Node.js application and finally deploy it taking advantage of the new GIT publishing feature provided by Microsoft Azure.

<a name="Ex1Task1" />
#### Task 1 – Creating a New Web Site Hosted in Microsoft Azure ####

1. Go to the [Microsoft Azure portal](https://manage.windowsazure.com/) and sign in using your **Microsoft Account** credentials associated with your subscription.

	![Sign in to Microsoft Azure Management portal](images/log-in-into-windows-azure-portal.png?raw=true "Sign in to Microsoft Azure Management portal")

	_Sign in to Microsoft Azure Management portal_

1. Click **New** at the bottom of the page.

	![Creating a new Web Site](images/creating-a-new-web-site.png?raw=true "Creating a new Web Site")

	_Creating a new Web site_

1. Click **Web Site** and then **Quick Create**.  Provide an available URL for the new Web Site and click **Create Web Site**.

	> **Note:** A Microsoft Azure Web Site is the host for a web application running in the cloud that you can control and manage. The Quick Create option allows you to deploy a completed web application to the Microsoft Azure Web Site from outside the portal. It does not include steps for setting up a database.

	![Creating a new Web Site using Quick Create ](images/creating-a-new-web-site-using-quick-create-op.png?raw=true "Creating a new Web Site using Quick Create")

	_Creating a new Web Site using Quick Create_

1.  Wait until the new web site is created.

	![Creating new web site status](images/creating-new-web-site-status.png?raw=true "Creating new web site status")

	_Creating new web site status_

1. Once the web site is created click the link under the **URL** column. Check that the new web site is working.

	![Browsing to the new web site](images/browsing-to-new-site.png?raw=true "Browsing to the new web site")

	_Browsing to the new web site_

	![Web site running](images/web-site-running.png?raw=true "Web site running")

	_Web site running_

1. Go back to the portal and click the name of the web site under the **Name** column to display the management pages for the web site.

	![Opening the web site management pages](images/selecting-the-dashboard-tab.png?raw=true "Openining the web site management pages")

	_Opening the web site management pages_

1. In the **Dashboard** page, under the **quick glance** section, click the **Set up Git publishing** link.

	![Setting up Git Publishing](images/setting-up-git-publishing.png?raw=true "Setting up Git Publishing")

	_Setting up Git Publishing_

	> **Note:** Git is a free, open-source, distributed version control system that handles small to very large projects. After you set up Git publishing, each .Git push initiates a new deployment.

1. Wait a few seconds until the Git repository is ready.

	> **Tip:** After the Git repository is ready you will see a quick start page with the set of commands you need to execute for pushing your web application files to Microsoft Azure. 

	![Git repository created](images/git-repository-created.png?raw=true "Git repository created")

	_Git repository created_

1. Do not close the management portal.

<a name="Ex1Task2" />
#### Task 2 - Creating a New Node.js Web Application ####
 
1. Create a new **node** folder in your _C:\\_ drive, or in another location that can be easily accessed.

1. Create a new text file with a text editor and add the following code that will send the string *Hello World* to the browser. Save the file as **server.js** in the folder you created (in this case *C:\node*).
 
	```Javascript
	var http = require('http');
	var port = process.env.port || 1337;
	http.createServer(function (req, res) {
					  res.writeHead(200, { 'Content-Type': 'text/plain' });
					  res.end('Hello World\n');
	}).listen(port);
	```
 
1. Create a new text file with a text editor and add the following code. Save the file as **package.json** in the **node** folder.
 
	```Json
	{
	  "name": "HelloWorld",
	  "version": "0.0.1",
	  "description": "",
	  "main": "./server.js",
	  "engines": { "node": ">= 0.6.0" }
	}
	```

	>**Note:** The package.json file tells the Node.js package manager (npm) how your package is structured, and which are the module dependencies. As this application is very simple it does not require dependencies, but in more complex apps you will probably need to specify a "dependencies" property. When publishing apps with Git, Microsoft Azure platform automatically installs all the dependencies declared in this file.
 
1. Create another text file with a text editor and add the following code. Save the file as **web.config** in your web site folder (in this case *C:\node*). This configuration indicates that the **server.js** file is a Node.js application
to be handled by the iisnode module.
 
	> **Note:** The [iisnode](https://github.com/tjanczuk/iisnode) project provides a native IIS 7.x module that allows hosting of node.js applications in IIS 7.x and IIS 7.x Express (WebMatrix).

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

<a name="Ex1Task3" />
#### Task 3 – Publishing the Node.js Application using Git####

1. Go back to the Microsoft Azure Management Portal. Open the site's **Dashboard** and under the **quick glance** section, copy the **Git Clone Url** value.

	![Git Clone Url](images/git-clone-url.png?raw=true)

	_Copying the Git Clone Url_

1. In order to publish your local files, open a **Git BASH** console, CD into your application folder (in this case *C:\node*) and run the following commands.

	```CommandPrompt
	git init
	git add .
	git commit -m "initial commit"
	```

	> **Note:** You can learn more about Git commands in the project documentation http://git-scm.com/documentation.

1. To add the remote Microsoft Azure repository and push the files, run the following commands. Replace the _{Git Clone Url}_ placeholder with the value obtained from the portal.

	```CommandPrompt
	git remote add azure {Git Clone Url}
	git push azure master
	```

1. Enter the deployment credentials when prompted.

	> **Note:** Deployment credentials are other than the Microsoft Account associated with your Microsoft Azure subscription and are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site's **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click Ok.
	>
	>![Resetting the deployment credentials](images/setting-the-username-and-password.png?raw=true "Resetting the deployment credentials")
	>
	>_Resetting the deployment credentials_

1. Go to the site's **Dashboard** page and click the **Site Url** link under the **quick glance** section to ensure that the site is running.

	![Running the Node.js application](images/running-the-nodejs-application.png?raw=true "Running the Node.js application")

	_Running the Node.js application_

---

<a name="Exercise2" />
### Exercise 2: Building and Publishing a Node.js Web Site using the Command-Line Tools ###

In this exercise, you will learn how to manage Websites using the Microsoft Azure Command-Line Tools. 

>**Note:** In the prerequisites section of this lab you will find the instructions to install the Command-Line Tools.

1. Open a Command Prompt with administrator privileges and execute the following command to download your account _publish profile_ file. A new browser window will pop up and you must login using your **Microsoft Account** credentials. 
    
    Once logged in, save the publish profile file in a known location (for example, 'C:\\')

	```CommandPrompt
	azure account download
	```

	![Downloading the account publish profile](images/download-publishsettings.png?raw=true "Downloading the account publish profile")

	_Downloading the account publish profile_

1. Go back to the Command Prompt and import the file downloaded in the step above by running the following command, specifying the publish profile file location in the _{publish_profile_file}_ placeholder (in this case *'C:\\'*).

	```CommandPrompt
	azure account import {publish_profile_file}
	```

1. Execute [Task 2 from Exercise 1](#Ex1Task2) to create a Node.js site, but place the files in a different folder than exercise 1 (for example *C:\NodeCLI*).

1. Open a Windows Command Prompt and CD to the folder where you placed the site (in this case *C:\NodeCLI*).

1. Run the following command to create the Microsoft Azure hosted site.

	```CommandPrompt
	azure site create --git
	```

	Provide a site name when prompted, for example, _NodeCLI_. Then select a region and proceed.

	![Creating a new Web Site using the Command-Line Tools](images/new-web-site-cli.png?raw=true "Creating a new Web Site using the Command-Line Tools")

	_Creating a new Web Site using the Command-Line Tools_

	> **Note:** By specifying **--git** when running the command **site create** you don't need to run additional commands to initialize the Git repository or add the git remote, since these two tasks will be done automatically by the command line tools.

1. Now you will add the current files to the Git repository and push them. To do this, go back to the command prompt and execute the following commands. When prompted, provide your deployment credentials.

	```CommandPrompt
	git add .
	git commit -m "initial commit"
	git push azure master
	```
	![Pushing the site files](images/push-site.png?raw=true "Pushing the site files")

	_Pushing the site files_

	> **Note:** Deployment credentials are other than the Microsoft Account associated with your Microsoft Azure subscription and are valid for use with all Microsoft Azure Websites associated with your subscription. If you don't know your deployment credentials you can easily reset them using the management portal. Open the web site's **Dashboard** page and click the **Reset deployment credentials** link. Provide a new password and click Ok.
	>
	>![Resetting the deployment credentials](images/reset-credentials-cli.png?raw=true "Resetting the deployment credentials")
	>
	>_Resetting the deployment credentials_

1. Let's check that the publishing was successful. Run the following command to open the site in the Microsoft Azure Management portal and provide your Microsoft Account credentials associated with the subscription to sign in.

	```CommandPrompt
	azure site portal
	```
	In the Microsoft Azure portal, click your site in the Web Site list and open the **Deployments** page of the site. Check out the latest deployment.

	![Web Site deployments](images/site-deployments.png?raw=true "Web Site deployments")

	_Web Site deployments_

1. Now execute the following command to browse to the web site and make sure it runs successfully.

	```CommandPrompt
	azure site browse
	```

	![Published web site](images/website-working-cli.png?raw=true "Published web site")

	_Published web site_

---

<a name="Exercise3" />
### Exercise 3: Building and Publishing a Node.js Web Site using WebMatrix 2 ###

In this exercise you will learn how to build and publish Websites in Microsoft Azure with WebMatrix 2. You will use the new Node.js web site templates to create a simple Node.js web application and publish it to Microsoft Azure using WebMatrix publishing features.

#### Task 1 - Creating a New Node.js Web Application in WebMatrix 2 ####

1. Execute [Task 1 from Exercise 1](#Ex1Task1) to create a new Web Site (e.g. _web-matrix-test_) in the Microsoft Azure Management Portal.

1. Open **WebMatrix 2**.

	![Starting WebMatrix 2](images/web-matrix.png?raw=true "Starting WebMatrix 2")

	_Starting WebMatrix 2_

1. Select the **Templates** option and under the **Node** category select the **Express Site** template. Type a name for the site and click **Next**.

	> **Note:** This template provides a basic Node.js Web application with routing and templating that uses Express, an MVC-style application framework.

	![Creating a site with the Express Site template](images/express-template.png?raw=true "Creating a site with the Express Site template")

	_Creating a site with the Express Site template_

	>**Note:** 
	> If this is the first time you use the Express Site template, WebMatrix will install IISNode for IIS Express. 
	>
	>![IISNode for IIS Express](images/iisnode-install.png?raw=true "IISNode for IIS Express")

1. Click the **Run** button from the ribbon bar to check if the site is running successfully.

	![Running the web site](images/express-template-running.png?raw=true "Running the web site")

	_Running the web site_

#### Task 2 - Publishing the Web Application to Microsoft Azure ####

1. Go back to the Microsoft Azure Portal and open the **Dashboard** of the web site you've created.

	![Opening the Dashboard](images/website-dashboard.png?raw=true "Opening the Dashboard")

	_Opening the Dashboard_

1. Click the **Download publish profile** link from the **quick glance** section and save the file to a known location.

	> **Note:** The _publish profile_ contains all of the information required to publish a web application to a Microsoft Azure website for each enabled publication method. The publish profile contains the URLs, user credentials and database strings required to connect to and authenticate against each of the endpoints for which a publication method is enabled. Both **Microsoft WebMatrix** and **Microsoft Visual Web Developer** support reading publish profiles to automate configuration of these programs for publishing web applications to Microsoft Azure websites.

	![Downloading the publish profile](images/download-publish-profile.png?raw=true "Downloading the publish profile")

	_Downloading the publish profile_

1. Back in WebMatrix, click the **Publish** button from the ribbon bar.

1. In the **Publish Settings** dialog, click the **Import publish settings** link. Open the file you've just downloaded.

	![Opening the publish settings](images/import-publish-profile.png?raw=true "Opening the publish settings")

	_Opening the publish settings_

1. Click the **Validate Connection** and make sure the validation runs successfully. Click **Save**.

	![Validating the publish profile](images/validating-publish-settings.png?raw=true "Validating the publish profile")

	_Validating the publish profile_

1. If a **Publish Compatibility** dialog is displayed, click **Yes** to test compatibility. Once the test runs, click **Continue**.

	![Testing the publish compatibility](images/publish-compatibility.png?raw=true "Testing the publish compatibility")

	_Testing the publish compatibility_

1. On the **Publish Preview** step, make sure all the files are selected and click **Continue**.

	![Preview of the files to be published](images/publish-preview.png?raw=true "Preview of the files to be published")

	_Preview of the files to be published_

1. Make sure the publishing completes successfully.

	![Publishing the web site](images/publish-successfully.png?raw=true "Publishing the web site")

	_Publishing the web site_

1. Click the site link in the notification message to browse to the published site.

	![Browsing to the published site](images/published-site.png?raw=true "Browsing to the published site")

	_Browsing to the published site_

---

<a name="Summary" />
## Summary ##

In this hands-on lab, you learned the basics of the Microsoft Azure Websites service for Node.js applications. In Exercise 1, you saw how to use the Microsoft Azure Management Portal for creating a web site and then published a "Hello World" Node.js application using GIT. In Exercise 2, you learned how to use the Microsoft Azure Command-Line Tools for publishing applications. Finally, in exercise 3 you explored the WebMatrix 2 features for building and publishing Node.js web applications in Microsoft Azure. At the end, you had a working Node.js site running on Microsoft Azure. 

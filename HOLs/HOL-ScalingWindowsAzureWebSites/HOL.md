<a name="HOLTitle"></a>
# Automatically Scaling Web Applications on Microsoft Azure Websites #

---
<a name="Overview"></a>
## Overview ##

Microsoft Azure provides a set of features that allows you to monitor and scale your Web Site whenever is required. Moving static assets to a Storage account will leverage the load of your Web Site and with Auto-Scaling, your Microsoft Azure Websites will automatically scale accordingly with their CPU load. Additionally, you can use Endpoint monitoring to measure the response time of your Web site from different locations.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Move static assets from your Web Site to your Microsoft Azure Storage account.
- Configure an Endpoint Monitoring for your Storage account.
- Set up Auto-Scaling for your Web Site.

<a name="Prerequisites"></a>
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Microsoft Visual Studio 2012 Express for Web][1]
- A Microsoft Azure subscription - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

[1]: http://msdn.microsoft.com/vstudio/products/

<a name="Setup"/>
### Setup ###

In order to execute the exercises in this hands-on lab you need to set up your environment.

1. Open a Windows Explorer window and browse to the lab's **Source** folder.

1. Execute the **Setup.cmd** file with Administrator privileges to launch the setup process that will configure your environment and check the dependencies.

1. If the User Account Control dialog is shown, confirm the action to proceed.

---
<a name="Exercises"/>
## Exercises ##

This hands-on lab includes the following exercises:

1. [Moving Static Assets to Microsoft Azure Storage](#Exercise1)
1. [Configure Endpoint Monitoring](#Exercise2)
1. [Setting up Auto-Scaling for your Site](#Exercise3)

Estimated time to complete this lab: **45** minutes.

<a name="GettingStarted"></a>
### Getting Started: Publishing Web Site to Microsoft Azure ###

First, you will need to deploy a Web Site to Microsoft Azure. An MVC 4 Application is provided in the **Assets** folder of this lab.

<a name="GettingStartedTask1"></a>
#### Task 1 - Creating a New Web Site from the Microsoft Azure Portal ####

1. Go to the [Microsoft Azure Management Portal](https://manage.windowsazure.com/) and sign in using the Microsoft credentials associated with your subscription.

	![Log on to Microsoft Azure portal](Images/logging-azure-portal.png?raw=true "Log on to the Microsoft Azure portal")

	_Log on to the Microsoft Azure Management Portal_

1. Click **New** on the command bar.

	![Creating a new Web Site](Images/new-website.png?raw=true "Creating a new Web Site")

	_Creating a new Web Site_

1. Click **Compute**, **Web Site** and then **Quick Create**. Provide an available URL for the new web site and click **Create Web Site**.

	![Creating a new Web Site using Quick Create](Images/quick-create.png?raw=true "Creating a new Web Site using Quick Create")

	_Creating a new Web Site using Quick Create_

1. Wait until the new **Web Site** is created.

1. In the **Dashboard** page, under the **quick glance** section, click the **Download the publish profile** link.

1. Download the publish profile file to a known location. Further in this exercise you will see how to use this file to publish a web application to a Microsoft Azure Websites from Visual Studio.

	![Saving the publish profile file](Images/save-link.png?raw=true "Saving the publish profile")
	
	_Saving the publish profile file_

<a name="GettingStartedTask2"></a>
#### Task 2 - Publishing an ASP.NET MVC 4 Application using Web Deploy ####

1. Open **Visual Studio Express 2012 for Web** as Administrator.

1. Browse to the **Source\Assets\AssetsWebSite\** folder of this lab and open the **AssetsWebSite.sln** solution.

1. In the **Solution Explorer**,  right-click the web site project and select **Publish**.

	![Publishing the Application](Images/publishing-the-application.png?raw=true "Publishing the Application")

	_Publishing the web site_

1. In the **Profile** page, click **Import** and select the profile settings file you downloaded earlier in this exercise.

	![Importing the publish profile](Images/importing-the-publish-profile.png?raw=true "Importing the publish profile")

	_Importing publish profile_

1. In the **Connection** page, leave the imported values and click **Validate Connection**. Once the validation is completed, click **Next**.

1. In the **Preview** page, click **Publish**.

1. Once the publishing process finishes, your default browser will open the published web site. Verify that the web site was successfully published in Microsoft Azure.

<a name="Exercise1"></a>
### Exercise 1: Moving Static Assets to Microsoft Azure Storage ###

In this exercise, you will move your Web Site assets, such as Images and videos, to your Microsoft Azure Storage account and redirect your links to target the new location.

<a name="Ex1Task1" />
#### Task 1 - Creating a Storage Account from Management Portal ####

In this task you will learn how to create a new Storage Account using the Management Portal.

1. Navigate to http://manage.windowsazure.com using a Web browser and sign in using the Microsoft Account associated with your Microsoft Azure account.

1. In the menu located at the bottom, select **New | Data Services | Storage | Quick Create** to start creating a new Storage Account. Enter a unique name for the account and select a **Region** from the list. Click **Create Storage Account** to continue.

	![create-storage-account-menu](Images/create-storage-account-menu.png?raw=true)

	_Creating a new storage account_

1.  In the **Storage** section, you will see the Storage Account you created with a _Creating_ status. Wait until it changes to _Online_ in order to continue with the following step.

	![storage-account-created](Images/storage-account-created.png?raw=true)

	_Storage Account created_

1. Click on the storage account name you created. You will enter to the **Dashboard** page which provides you with information about the status of the account and the service endpoints that can be used within your applications.

	![storage-account-dashboard](Images/storage-account-dashboard.png?raw=true)

	_Displaying the Storage Account Dashboard_

1. Click the **Manage Keys** button at the bottom bar.

	![manage-keys-menu](Images/manage-keys-menu.png?raw=true)

	_Managing Access Keys_
	
1. Take note of the **Primary Access Key**. You will use it in the next task to upload assets to your storage account. Click the check button to continue.

	![Copying primary key](Images/copying-primary-key.png?raw=true)

	_Copying Primary Access Key_

1.	In the dashboard page, take note the **Blobs** service endpoint URL. You will use it in the next task to upload assets to your storage account.

	![blobs service endpoint](Images/blobs-service-endpoint.png?raw=true)

	_Taking note of the Blobs Service Endpoint_

<a name="Ex1Task2" />
#### Task 2 - Moving Static Assets to Storage ####

1. Open **Visual Studio Express 2012 for Web** and open the **AssetsWebSite** solution located in the **Source\Assets\AssetsWebSite\** folder of this lab.

1. Open the view **Index** under the **Views\Home** folder. As you can see in the code, this view displays some images and a video using a HTML5 player. These assets are located within your application and will be deployed with your site in the specified region.

1. Right-click the **Content** folder and select **Open folder in File Explorer**. Take note of the path of the folder.

1. Using a Web browser, download https://github.com/downloads/WindowsAzure/azure-sdk-downloads/AzCopy.zip. The **AzCopy** is a tool that allows you to upload files to a blob container. Once downloaded, unzip the file.

1. Open the folder where you unzipped the **AzCopy** tool, hold the **SHIFT** key and right-click the **Windows Explorer** and select **Open command window here**. This will open the **Command Prompt** in the **AzCopy** folder.

1. Execute the following script, replacing the following placeholders:

	**EXERCISE-ASSETS-FOLDER**: The path where the **Assets** folder of the solution is located (e.g.: _C:\WATK\Labs\HOL-ScalingWindowsAzureWebSites\Assets\AssetsWebSite\AssetsWebSite\Assets\)_.

	**STORAGE-ACCOUNT-BLOB-ENDPOINT**: The blobs endpoint URL of the storage account **plus** the Container name you will upload the assets in lowercase (e.g.: _http://mystorageaccountname.blob.core.windows.net/assets_).
 
	**STORAGE-ACCOUNT-KEY**: The Primary Access key for the storage account.

	````CMD
	azcopy [EXERCISE-ASSETS-FOLDER] [STORAGE-ACCOUNT-BLOB-ENDPOINT] /destkey:[STORAGE-ACCOUNT-KEY] /S
	````

	![azcopy-transfer-summary](Images/azcopy-transfer-summary.png?raw=true)

	_Transfer Files Summary_

1.	The tool will copy the files from the **Content** folder into the container you created. Go back to the Management Portal, to your Storage Account and go to **Containers** by clicking the link in the top menu.

	![storage-containers-menu](Images/storage-containers-menu.png?raw=true)

1.	Select the container from the list your created using the **AzCopy** tool (e.g.: _assets_) and click **Edit Container** button from the bottom bar.

1. Set the container **Access** to _Public Container_. Click the check button to continue.

	![storage-edit-container](Images/storage-edit-container.png?raw=true)

	_Editing Container Access_

1.	Enter the container by clicking its name. Select the **Azure_Intro.mp4** blob and select **Edit Blob** from the bottom bar.

	![storage-blob-edit-menu](Images/storage-blob-edit-menu.png?raw=true)

1. Change the **content type** of the blob to _video/mp4_. This allows the Web browser to recognize the blob as a Video. Click the check button to continue.

	![Editing Blob Details](Images/editing-blob-details.png?raw=true)

	_Editing Blob Content Type_

1. Copy the URL of the Video blob. Open a Web browser, and paste the URL. This verifies that the content is accessible.

<a name="Ex1Task3" />
#### Task 3 - Updating Assets to target Storage ####

In this task, you will update the location of the static assets in your Web Application to use the Microsoft Azure Storage blob URL instead.

1. Go back to **Visual Studio** and open the **Index** view under the **Views** folder.

1. Replace the \<img\> **src** attribute value with the corresponding Storage blob URL. Do the same for the \<video\> tag. For example, if it says _src="~/Assets/Picture.png"_ update it to _src="http://mystorageaccount.blob.core.windows.net/assets/Picture.png_

	> **Note:** The URL is case sensitive.

1. Press **F5** to run the application.

1.	The static assets will now be accessed using the storage account instead of the environment where your site is deployed. You can right-click the video player and click **Copy Video URL**. Open a new tab and paste in the navigation address. The player will be accessing the video from your storage account directly.

	![Copying Video URL](Images/copying-video-url.png?raw=true)

	_Copying Video URL_

1.	You can verify that the image is being accessed from your storage account by right-clicking on it and selecting **Properties**. The URL will target your storage account.

	![Picture properties](Images/picture-properties.png?raw=true)

	_Displaying Picture Properties_

<a name="Exercise2"></a>
### Exercise 2: Configuring Endpoint Monitoring ###

In this exercise, you will configure endpoint monitoring for your Microsoft Azure Web Site. Endpoint monitoring configures web tests from geo-distributed locations that test response time and uptime of web URLs. The test performs an HTTP get operation on the web URL to determine the response time and uptime from each location. Each configured location runs a test every five minutes.

> **Note:** Before switching a web site from the free web site mode to the standard web site mode, you must first remove spending caps in place for your Web Site subscription. For more information on shared and standard mode pricing, see [Pricing Details](https://www.windowsazure.com/en-us/pricing/details/).

<a name="Ex2Task1" />
#### Task 1 - Enabling endpoint monitoring ####

1.	Go to the Management Portal and open **Websites**. Select the Web site you created in the **Getting Started** section of this lab.

1.	Click **Scale** from the top menu.

1.	Change the Web site mode to **Standard**.

	![websites-standard-mode](Images/websites-standard-mode.png?raw=true)

	_Changing Web Site Mode to Standard_

	> **Note:** This feature is only available in **Standard** mode. You can monitor up to 2 endpoints from up to 3 geographic locations.

1. Go to the **dashboard page** and click **Configure Web Endpoint Monitoring** link.

	![websites-configure-endpoint](Images/websites-configure-endpoint.png?raw=true)

	_Configuring endpoint monitoring_

1.	Scroll down to the **monitoring** panel and add a new endpoint. Set its name (e.g.: _myendpoint_) and select 3 different locations from the list. For example: _Chicago_, _Amsterdam_ and _Hong-Kong_.

1. Click **Save** on the bottom bar.

1. Click **Monitor** on the top menu.

	![websites-monitor-menu](Images/websites-monitor-menu.png?raw=true)

	_Opening Monitor Section_

1. Click the **Add Metrics** button from the bottom bar.

	![add-metrics-menu](Images/add-metrics-menu.png?raw=true)

	_Adding Metrics_

1.	On the **Choose Metrics** dialog box, click **Endpoints**.

	![websites-monitor-endpoint](Images/websites-monitor-endpoint.png?raw=true)

	_Choosing Endpoint Metrics_

1.	Select the 3 **Response Time** metrics for each location and click the check button to continue.

	![websites-endpoints-metrics](Images/websites-endpoints-metrics.png?raw=true)

	_Selecting Endpoint Locations_

	The metrics will be displayed in the table below the chart.

	![websites-endpoints-table](Images/websites-endpoints-table.png?raw=true)

	_Displaying Metrics Values_

<a name="Exercise3"></a>
### Exercise 3: Setting up Auto-Scaling for your Site ###

In this exercise, you will enable auto scaling for your Microsoft Azure Web Site. You can configure the Web site to auto scale when the CPU reaches a target percentage, automatically increasing the instance count. You can configure the minimum and maximum number of instances.

<a name="Ex3Task1" />
#### Task 1 - Enabling Auto-Scaling ####

1. In the Management Portal, go to your Web Site and click **Scale** from the top menu.

1. In order to enable auto-scale, make sure your Web site **mode** is configured as **Standard**.

	![websites-standard-mode](Images/websites-standard-mode.png?raw=true)

1. Go to the **capacity** section and select _CPU_ from the **Autoscale** options. This enables auto scaling using CPU as a target. 

1. From the instance count slider, select the minimum and maximum instances that you want to target for your Web site. Change the target CPU range in order to increase or decrease the number of running instances. This automatically adds or removes an instance when the threshold is reached.

	> **Note:** Microsoft Azure checks the CPU of your web site once every five minutes and adds instances as needed at that point in time. If CPU usage is low, Microsoft Azure will remove instances once every two hours to ensure that your website remains performant. Generally, putting the minimum instance count at 1 is appropriate. However, if you have sudden usage spikes on your web site, be sure that you have a sufficient minimum number of instances to handle the load. 

	![websites-automatically-scaling](Images/websites-automatically-scaling.png?raw=true)

	_Automatically scaling your Web Site_

1. Click the **Save** button from the bottom bar to save the settings.

---

<a name="summary"></a>
## Summary ##

By completing this hands-on lab you learned the following:

* Moving static assets from your Web site to Microsoft Azure Storage.
* Configure endpoint monitoring to measure the availability and response time of your deployed Web site from different locations.
* Configure Auto-Scaling for Microsoft Azure Websites by changing the range of CPU target and the instance count.

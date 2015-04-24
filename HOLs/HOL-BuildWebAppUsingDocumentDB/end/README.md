##Setting up the End Solution

In the lab [**Build a web application with ASP.NET MVC using DocumentDB**](..) you are given instructions to create a new project that uses Azure DocumentDB. The final code for the app is provided in this folder. In order to be able to run it, you need to configure it.

To configure the end solution you will need to have created the DocumentDB database and retrieved the **URI** and **PRIMARY KEY** values, as indicated in the section [Creating a DocumentDB database account](../#creating-a-documentdb-database-account).

Once you have those values, perform the following steps:

1. Open Visual Studio and then the **Todo** solution.

1. Open the **Web.config** file.

1. Find the `appSettings` element and update the following values with the appropriate values that correspond to your Azure subscription:

	* **endpoint**: **URI** value copied from Azure
	* **authKey**: **PRIMARY KEY** value copied from Azure

16. Save the file.

You should now be ready to run the solution. 

If/when deploying the application to Azure Websites, you could be asked to provide additional information in the Publish Web dialog box if you have not built the application from scratch following the instructions in the lab. 
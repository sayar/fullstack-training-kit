<a name="handsonlab" />
# Microsoft Azure Websites and Virtual Machines for Node.js Applications (OS X) #

---

<a name="Overview" />
## Overview ##

A virtual machine in Microsoft Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Microsoft Azure, you can start, stop, and delete it whenever you need to, and you can access the virtual machine just as you do with a server in your office. In this lab, you will learn how to create a virtual machine running Linux and use it as a database server for a Node.js application. You will see how diverse technologies can run and interact in Microsoft Azure's cloud-based infrastructure.

In this lab, you will first create a new virtual machine starting from a Linux image from the Microsoft Azure Management Portal. Then, you will install and configure a [MongoDB](http://www.mongodb.org/) server on the virtual machine that can be accessible from an Internet application. Once the server is configured, you will publish a [Node.js](http://nodejs.org/) application using Microsoft Azure Websites that connects to the database server running in the virtual machine.

<a name="Objectives" />
### Objectives ###

In this hands-on lab, you will learn how to: 

- Create a Linux virtual machine running on Microsoft Azure
- Install and configure a MongoDB server in a Linux Virtual Machine running on Microsoft Azure
- Create a Node.js web application that connects to the MongoDB server running on the Linux virtual machine
- Publish a Node.js web application using GIT to Microsoft Azure Websites

<a name="Prerequisites" />
### Prerequisites ###

The following is required to complete this hands-on lab:

- [Mac OS X](http://www.apple.com/macosx/)
- [Git Version Control System](http://git-scm.com/)
- A Microsoft Azure subscription with the Websites and Virtual Machines Preview enabled - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)

>**Note:** This lab was designed for use on OS X.

---
 
<a name="Exercises" />
## Exercises ##

This hands-on lab includes the following exercises:

1. [Creating a Linux Virtual Machine in Microsoft Azure and Configuring MongoDB](#Exercise1)

1. [Connecting to the Virtual Machine from  a Node.js Application](#Exercise2)

<a name="Exercise1" />
### Exercise 1: Creating a Linux Virtual Machine in Microsoft Azure and Configuring MongoDB ###

In this exercise, you will create a new Linux virtual machine using the Microsoft Azure Management portal. You will then connect to the virtual machine using SSH and configure and start MongoDB server.
	
<a name="Ex1Task1" />
#### Task 1 – Creating and Configuring a New Linux Virtual Machine ####

1. Open Safari and browse to the [Microsoft Azure Management Portal](http://manage.windowsazure.com/). Then, log in with your Live Id credentials associated with your Microsoft Azure subscription.

1. In the menu located at the bottom, select **New | Virtual Machine | From Gallery** to start creating a new virtual machine.
	 
	![Creating a new Virtual Machine](Images/creating-a-new-virtual-machine.png?raw=true)

	_Creating a new Virtual Machine_
 
1. In the **Virtual Machine Operation System Selection** page, click **Platform Images** on the left menu and select the **openSUSE 12.3** image from the list. Click the arrow to continue.	

	![Creating a Virtual Machine Operation System Selection](Images/vm-os-selection.png?raw=true "Creating a Virtual Machine Operation System Selection")
 
	_Creating a Virtual Machine - Virtual Machine Operation System Selection_

	> **Note:** You can also upload your own customized image for your virtual machine, using the **Images** section. An image is a virtual hard drive (VHD) file that you can use as a template to create a new virtual machine. When you choose to create a virtual machine from an image, Microsoft Azure creates a disk for you from the image, and then it uses it for the virtual machine. 

1. In the **Virtual Machine Configuration** page, type a **Virtual Machine Name** and set the **New User Name** to **azureuser**. Uncheck the **upload compatible ssh ket for authentication**, check  **Provide Password** and type a password for your virtual machine. Leave the default **Size** for it. Click the **right arrow** to continue. Make note of the administrator username and password as you will use them later to connect to the virtual machine.

	![Configuring a Custom Virtual Machine](Images/creating-a-vm-configuration.png?raw=true)
 
	_Creating a Virtual Machine - Virtual Machine Configuration_

	>**Note:** It is suggested to use secure passwords for admin users, as Microsoft Azure virtual machines could be accessible from the Internet knowing just their DNS.

	>You can also read this document on the Microsoft Security website that will help you select a secure password:  [http://www.microsoft.com/security/online-privacy/passwords-create.aspx](http://www.microsoft.com/security/online-privacy/passwords-create.aspx)
 
1. In the **Virtual Machine Mode** page, select **Stand-alone Virtual Machine**, type an available **DNS Name**, select the **Storage Account** where the image should be created (or leave the default option to automatically create a new **Storage Account**). Finally, select the **Region/Affinity group/Virtual Network** value. Click the **right arrow** to continue. 

	![Configuring a Custom Virtual Machine Mode](Images/creating-a-vm-vm-mode.png?raw=true)
 
	_Creating a Virtual Machine - Virtual Machine Mode_
 
1. In the **Virtual Machine Options** page, click the submit button to create a new virtual machine.

	![Creating a Virtual Machine - Virtual Machine Options](Images/creating-a-vm--vm-options.png?raw=true "Creating a Virtual Machine - Virtual Machine Options")

	_Creating a Virtual Machine - Virtual Machine Options_
 
1. In the **Virtual Machines** section, you will see the virtual machines you created with a _provisioning_ status. Wait until it changes to _Running_ in order to continue with the following step.

	>**Note:** Please notice that the provisioning process might take a considerable amount of time.

	![Creating Linux Virtual Machine](Images/creating-linux-vm.png?raw=true)
	 
	_Creating Linux Virtual Machine_

1. Now, you will create public endpoints for the virtual machine. This will allow you to connect to the virtual machine services running on the selected ports from another application on the Internet. In particular, you will open the ports used by MongoDB, the NoSQL database server you will install in the Linux server.

	> **Note:** Virtual machines use endpoints to communicate within Microsoft Azure and with other resources on the Internet. All virtual machines that you create in Microsoft Azure can automatically communicate with other virtual machines in the same cloud service or virtual network. However, you need to add an endpoint to a machine for other resources on the Internet, like web applications, or other virtual networks to communicate with it.
	> 
	> For web applications to connect to the MongoDB server running on the virtual machine you will need to open the following private ports, as explained in the following steps.
	> 
	> -Port **27017**: MongoDB Server database port
	> 
	> -Port **28017**: MongoDB Server Web interface
	> 

1. To create a new endpoint, select your Linux virtual machine from the list and then click the **Endpoints** tab. You will notice that the endpoint for using SSH connections is configured by default; you will later use this endpoint for accessing the virtual machine.

	> **Note:** SSH, an acronym for Secure SHell,  allows you to securely access a shell (command line) remotely on most Linux/Unix systems. SSH encrypts all the data transferred between machines to avoid malicious users to read (_sniff_) username, password and commands that you run.

1. Click **Add Endpoint**, select **Add Endpoint** option and then click the **right arrow** to continue.

	![Adding a new Endpoint](Images/adding-a-new-endpoint.png?raw=true "Adding a new Endpoint")

	_Adding a new Endpoint_

1. In the **Specify the details of the endpoint** page, type _mongodb_ in the **Name** field, set the **Protocol** to _TCP_ and both the **Public Port** and **Private Port** to _27017_. Then click **OK**.

	> **Note:** For simplicity purposes, configure the public and private ports using the same value. However, in a production scenario you should use different values for security considerations.

	![Specify endpoint details](Images/new-endpoint-details.png?raw=true "Specify endpoint details")

	_Specify endpoint details_

	>**Note:** MongoDB uses 27017 as default port, and 28017 as the webservice port. You can check MongoDB default ports [here] (http://www.mongodb.org/display/DOCS/Production+Notes#ProductionNotes-TCPPortNumbers).
	
1. Repeat the previous steps to configure the endpoint for port **28017**.

<a name="Ex1Task2" />
#### Task 2 – Connecting to the Virtual Machine Using an SSH Client ####
 
1. In the Microsoft Azure Portal, select the Linux virtual machine from the list to enter its **Dashboard**. Locate the **DNS** field in the quick glance at the right bottom of the page. This is the public address you will use to connect to the virtual machine.

	![Dashboard - DNS name of the virtual machine](Images/dashboard---dns-name-of-the-virtual-machine.png?raw=true)
	 
	_Dashboard  - DNS name of the virtual machine_

1. Click the **Endpoints** tab, and copy the public port value of the SSH endpoint (private port 22).

1. Open a terminal (or any other SSH client) and connect to the virtual machine using the **ssh** command. To do this, use the following command replacing the placeholders with the administrator username and virtual machine DNS name. The command should look similar to the following:

	````Bash
	ssh [YOUR-ADMIN-USER-NAME]@[YOUR-VM-DNS-NAME] -p [YOUR-SSH-PORT]
	````

	>**Note:** The administrator username is the one you have configured when creating the virtual machine. You can check the SSH port in the endpoints tab. You should use the public endpoint.
 
1. Enter the administrator password to login. If it is the first time you connect, you might be prompted to accept a certificate.

	![Logging into the VM](Images/logging-into-the-vm.png?raw=true "Logging into the VM")
	
	_Logging in to the Linux Virtual Machine_

<a name="Ex1Task3" />
#### Task 3 – Installing and Configuring MongoDB ####

In this task, you will install and configure a MongoDB server in the Linux virtual machine.

MongoDB is a document-oriented NoSQL database designed for ease of development and scalability, with particular emphasis on Internet applications and infrastructure.

1. Once connected to the VM, execute the following command to switch the current user to **root** and get administrator privileges.
	
	````Bash
	sudo su -
	````

1.	Execute the following command to install **wget** and a MongoDB's prerequisite library.
	
	````Bash
	zypper install wget
	zypper install libstdc++6-32bit
	````

1.	Execute the following commands to download and extract MongoDB in the virtual machine. Notice that this command will download MongoDB version 2.4.3. If you prefer to use a newer version you need to adjust the following commands accordingly.
	
	````Bash
	wget http://downloads.mongodb.org/linux/mongodb-linux-i686-2.4.3.tgz
	tar xzf mongodb-linux-i686-2.4.3.tgz
	````

	![Downloading MongoDB](Images/downloading-mongodb.png?raw=true "Downloading MongoDB")

	_Downloading MongoDB_

1. Create a **/data/db** directory and grant permissions for the current user. By default, MongoDB will store data in the **/data/db** folder, but the directory has to be manually created.

	````Bash
	mkdir -p /data/db
	chown [YOUR-ADMIN-USER] /data/db
	````

1.	Enter the following command to start the MongoDB server. Notice in the console output that process default port is 27017, while web console default port is 28017 and both ports were opened using public endpoints.

	````Bash
	./mongodb-linux-i686-2.4.3/bin/mongod &
	````

	![Starting MongoDB process](Images/starting-mongodb-process.png?raw=true "Starting MongoDB process")

	_Starting MongoDB process_

	> **Note:** You can optionally enter the following command to start MongoDB server automatically on start up.

	>````Bash
	>	chkconfig mongod on
	>````

1. Press **ENTER** once the process is completed. 

1. Execute the following command to start MongoDB shell. The MongoDB interactive shell is a JavaScript shell that allows you to issue commands to MongoDB from the command line. You can run queries and inspect the content of a database.

	````Bash
	./mongodb-linux-i686-2.4.3/bin/mongo
	````

	![Connecting to MongoDB shell](Images/connecting-to-mongo-shell.png?raw=true)

	_Connecting to MongoDB shell_

1.	In the shell, type the following queries to test the connection. These queries will save a new document in the _foo_ collection and then retrieve it.

	````JavaScript
	db.foo.save( { a : 1 } )
	db.foo.find()
	````

	> **Note:** MongoDB stores JSON-like documents, grouped in collections. In this case _foo_ is the collection and _{a : 1}_ is the document.

	> One collection may have any number of documents and documents within one collection can have different schemas, which can be dynamic. This is one of the greatest differences with relational databases: every record in a relational table has the same fields, while documents in a collection can store different fields.

1.	Then, type the following command to retrieve the server status.

	````JavaScript
	db.serverStatus()
	````

	![MongoDB Server status shell](Images/mongodb-server-status-shell.png?raw=true "MongoDB Server status shell")

	_MongoDB Server status shell_

1.	You will now check the database status from a browser. Do not close the MongoDB shell.

	Open a browser and test that the MongoDB server running in your virtual machine can be accessed from the Internet. Use the following URL to get the server status in JSON format; replace the placeholders with your virtual machine data.

	`````
	http://[your-vm-dns-name]:28017/_status
	````

	![Server status output](Images/server-status-output.png?raw=true "Server status output")

	_Server status_

<a name="Ex1Task4" />
#### Task 4 – Configuring Text Search on MongoDB ####
	
In this task you will create a database and configure text search by adding a keyword index to your database. The text search feature in MongoDB has to be manually implemented. For that reason, you will create an additional field, which will store the text to be retrieved by the search queries, and you will then create an index on keywords field to improve the performance.
 	
>**Note**: You can read more about MongoDB Full-Text Search configuration [here] (http://www.mongodb.org/display/DOCS/Full+Text+Search+in+Mongo).	

1. If not already open, open MongoDB shell (`./mongodb-linux-i686-2.4.3/bin/mongo`).

1. Execute the following script to make MongoDB create and select a **ContactDb** database. 

	````JavaScript
	use ContactDb;
	````

	> **Note:** Switching to a database with the `use` command won't immediately create the database; the database is created lazily the first time data is inserted.

1. You will now add initial data for the next exercise. You will have a _Contacts_ collection, containing first name, last name, address and e-mail fields. To implement text search, you will add the 'keywords' field, containing the values for each of the fields. 

	>**Note:** If you do not specify the id, MongoDB will automatically create an object id. 

	````JavaScript
	db.contacts.save({firstname: "John", lastname: "Smith", address:"1 Microsoft Way, Redmond, WA.", email:"john.smith@live.com", _keywords: ["john", "smith", "john.smith@live.com" ] } );
	````

1. If you wish to find the contact, you can search in all the values by using **findOne**.

	````JavaScript
	db.contacts.findOne( {_keywords: "smith"} );
	````
	
	![Finding a contact](Images/finding-a-contact.png?raw=true "Finding a contact")

	_Finding a contact_

	To verify, you can also run this command that retrieves a null value:
	
	````JavaScript
	db.contacts.findOne( {_keywords: "lee"} );
	````

1. Execute the following commands to add more sample data to the database.

	````JavaScript
	db.contacts.save({firstname: "Catherine", lastname: "Abel", address:"1 Microsoft Way, Redmond, WA.", email:"catherine.abel@vannuys.com", 
_keywords: ["catherine", "abel", "catherine.abel@vannuys.com" ] } );

	db.contacts.save({firstname: "Kim", lastname: "Branch", address:"1 Microsoft Way, Redmond, WA.", email:"kim.branch@contoso.com", 
_keywords: ["kim", "branch", "kim.branch@contoso.com" ] } );

	db.contacts.save({firstname: "Mark", lastname: "Harrington", address:"1 Microsoft Way, Redmond, WA.", email:"mark.harrington@adatum.com", 
_keywords: ["mark", "harrington", "mark.harrington@adatum.com" ] } );

	db.contacts.save({firstname: "Keith", lastname: "Harris", address:"1 Microsoft Way, Redmond, WA.", email:"keith.harris@adventureworks.com", 
_keywords: ["keith", "harris", "keith.harris@adventureworks.com" ] } );

	db.contacts.save({firstname: "Wilson", lastname: "Pais", address:"1 Microsoft Way, Redmond, WA.", email:"wilson.pais@alpineskihouse.com", 
_keywords: ["wilson", "pais", "wilson.pais@alpineskihouse.com" ] } );	

	db.contacts.save({firstname: "Roger", lastname: "Harui", address:"1 Microsoft Way, Redmond, WA.", email:"roger.harui@baldwinmuseum.com", 
_keywords: ["roger", "harui", "roger.harui@baldwinmuseum.com" ] } );

	db.contacts.save({firstname: "Pilar", lastname: "Pinilla", address:"1 Microsoft Way, Redmond, WA.", email:"pilar.pinilla@blueyonderairlines.com", 
_keywords: ["pilar", "pinilla", "pilar.pinilla@blueyonderairlines.com" ] } );

	db.contacts.save({firstname: "Roger", lastname: "Harui", address:"1 Microsoft Way, Redmond, WA.", email:"roger.harui@baldwinmuseum.com", 
_keywords: ["roger", "harui", "roger.harui@baldwinmuseum.com" ] } );

	db.contacts.save({firstname: "Kari", lastname: "Hensien", address:"1 Microsoft Way, Redmond, WA.", email:"kari.hensien@citypowerlight", 
_keywords: ["kari", "hensien", "kari.hensien@citypowerlight" ] } );

	db.contacts.save({firstname: "Peter", lastname: "Brehm", address:"1 Microsoft Way, Redmond, WA.", email:"peter.brehm@cohowinery.com", 
_keywords: ["peter", "brehm", "peter.brehm@cohowinery.com" ] } );

	db.contacts.save({firstname: "Johny", lastname: "Porter", address:"1 Microsoft Way, Redmond, WA.", email:"johnny.porter@cohowinery.com", 
_keywords: ["johny", "porter", "johnny.porter@cohowinery.com" ] } );

	db.contacts.save({firstname: "John", lastname: "Harris", address:"1 Microsoft Way, Redmond, WA.", email:"john.harris@contoso.com", 
_keywords: ["john", "harris", "john.harris@contoso.com" ] } );
	````
			
1. Once you have populated your database, you will create an index for the **keywords** field. To do this, execute the `ensureIndex` command, which creates an index if it does not exist.
	
	````JavaScript
	db.contacts.ensureIndex( { _keywords: 1 } );
	````
	
	>**Note:** You can read more about MongoDB indexes [here] (http://www.mongodb.org/display/DOCS/Indexes).
	>
	> If you want to retrieve the existing indexes, you can run the command **db.system.indexes.find()** and check if the keywords index was created.

<a name="Ex1Task5" />
#### Task 5 – Creating Database Users in MongoDB ####

In this task, you will learn how to configure MongoDB security. You will first create an administrator user for the server, and then you will learn how to add users for each of the databases.

>**Note:** The current version of MongoDB supports only basic security. You authenticate a username and password in the context of a particular database. For more information about MongoDB security, check [this article] (http://www.mongodb.org/display/DOCS/Security+and+Authentication#SecurityandAuthentication-MongoSecurity).

1. If not already open, open MongoDB shell (`./mongodb-linux-i686-2.4.3/bin/mongo`).

1. Create an administrator user for the server process. Replace the placeholders with a user name and password. In the next exercise you will use these credentials to connect to the database server from a web application.

	````JavaScript
	use admin
	db.addUser("[YOUR-ADMIN-USERNAME]","[YOUR-ADMIN-PASSWORD]")
	````

	> **Note:** This user will be stored under the admin database. From now on, your database server administration will only be accessible with these credentials. To connect to the database with authentication, you will have to execute the `db.auth(username,password)` command. 
	>
	> Optionally, you can configure a user for your database as shown below. Notice that this user will only be able to connect to this database, while the system administrator user previously configured has full access.
	>
	>````JavaScript
	use [YOUR-DB-NAME]
	db.addUser("[username]","[password]")
	````
	>
	>![Adding a database user](Images/adding-a-database-user.png?raw=true "Adding a database user")
	>
	>_Adding a database user_

1. Run this command to check the system users created. You should be able to see the list of users.
	
	````JavaScript
	db.system.users.find()
	````

	![Database users](Images/database-users.png?raw=true "Database users")

	_Database users_

1. Type `exit` to exit from MongoDB shell.

1. To verify the process is now secured, switch back to your browser and refresh the status page. Notice that the administrator credentials are now required to retrieve the information. 

	![Authentication verification](Images/authentication-verification.png?raw=true "authentication verification")

	_Authentication_
	
<a name="Exercise2" />
### Exercise 2: Connecting to the Virtual Machine from  a Node.js Application ###

In this exercise you will create a new web site in Microsoft Azure Websites and publish a Node.js application taking advantage of the new GIT publishing feature provided by Microsoft Azure. The application you will publish will use a MongoDB database located in the Linux server you have configured in Exercise 1.

<a name="Ex2Task1" />
#### Task 1 – Creating a New Web Site Hosted in Microsoft Azure ####

1. Go to the [Microsoft Azure Management Portal](http://manage.windowsazure.com/) and sign in using your **Windows Live ID** credentials associated with your subscription.

1. Click **New** on the command bar.

	![Creating a new web site](Images/creating-a-new-web-site.png?raw=true "Creating a new web site")

	_Creating a new web site_

1. Click **Web Site** and then **Quick Create**. Provide an available URL for the new Web Site and click **Create Web Site**.

	>**Note:** A Microsoft Azure Web Site is the host for a web application running in the cloud that you can control and manage. The Quick Create option allows you to deploy a completed web application to the Microsoft Azure Web Site from outside the portal. It does not include steps for setting up a database.

	![Creating a new web site using quick create](Images/creating-a-new-web-site-using-quick-create.png?raw=true "Creating a new web site using quick create")

	_Creating a new Web Site using Quick Create_

1. Once the web site is created, click the link under the **URL** column. Check that the new web site is working.

	![Browsing the new web site](Images/browsing-to-the-new-web-site.png?raw=true "Browsing the new web site")

	_Browsing the new web site_

	![Web site running](Images/web-site-running.png?raw=true "Web site running")

	_Web site running_

1. Go back to the portal and click the name of the web site under the **Name** column to display the management pages for the web site.

	![Opening the web site management pages](Images/opening-the-web-site-management-pages.png?raw=true "Opening the web site management pages")

	_Opening the web site management pages_


1. If this is the first time you access to the portal you might be redirected to the **Quickstart** page. Click **Dashboard** in the menu to continue.

	![Opening web site dashboard](Images/opening-web-site-dashboard.png?raw=true "Opening web site dashboard")

	_Opening web site dashboard_

1. In the **Dashboard** page, under the **quick glance** section, click the **Setting up deployment from source control** link.

	![Setting up deployment from source control](Images/setting-up-source-control-publishing.png?raw=true "Setting up deployment from source control")

	_Setting up deployment from source control_

1. Select **Local Git repository** from the list of source code.

	![Local Git repository](Images/setting-local-git-repository.png?raw=true "Local Git repository")

	_Local Git repository_

	>**Note:** Git is a free, open-source, distributed version control system that handles small to very large projects. After you set up Git publishing, each .Git push initiates a new deployment.

1. If  you are prompt to configure a new user name and password, provide your own credentials. They will be necessary when pushing from git console to Microsoft Azure.

	![New username and password](Images/new-username-and-password.png?raw=true"New username and password")

	_New username and password_

1. Wait until your Git repository is ready to be used before continue with the following task.

	>**Tip:** When the Git repository is ready, quick start page will open, containing the set of commands you need to execute for pushing your web application files to Microsoft Azure. 

	![GIT repository created](Images/git-repository-created.png?raw=true "GIT repository created")

1. Click the **Configure** tab.

	![Configuration tab](Images/configuration-tab.png?raw=true "Configuration tab")

	_Configuration tab_

1. Scroll down to the **app settings** section.

1. Add a new pair key/value for the connection string. Use **DB** as the key and provide the connection string to the MongoDB as the value. The connection string should look similar to this one: _mongodb://[USER-NAME]:[PASSWORD]@[DNS-NAME].cloudapp.net:27017/ContactDb_. Then, click **Save**.

	>**Note** Replace the USER-NAME, PASSWORD and DNS-NAME with the information provided in exercise 1.

	![Database connection string configuration](Images/app-settings-configure-db-connection-string.png?raw=true "Database connection string configuration")

	_Database connection string configuration_

<a name="Ex2Task2" />
#### Task 2 – Exploring the Node.js Application ####

In this task you open and explore a simple Node.js application provided in this lab that uses the MongoDB database you have configured in Exercise 1. The application consists of an API with the CRUD (create, read, update, delete) operations.

1. Browse to the **/Source/Assets** folder of this lab.

1. Open **server.js** with a text editor, which is the main entry point of the Node.js application. Notice the require statements on the top of the file. This code is importing two main modules for this application:
	- [Express](http://expressjs.com): A web framework for Node.js, providing different features like views rendering or robust routing, among others.
	- [Mongoose](http://mongoosejs.com/): A MongoDB object modeling tool designed for Node.js. Mongoose will manage your connection and queries to MongoDB.

	````JavaScript
	var http = require('http'),
	express = require('express'),
	mongoose = require('mongoose'),
	...
	````

	Additionally notice the `http.createServer(app)` statement for creating and initializing the application.

	> **Note:** You can read a getting started guidance about the Express framework in [this article](http://howtonode.org/getting-started-with-express) and about Mongoose in its [documentation](http://mongoosejs.com/).

1. For retrieving and inserting data with Mongoose, you need to define a _Model_ using the **Schema** Mongoose interface. The schema mainly defines the structure of your documents -in this case _Contacts_ - and the types of data you are storing. 	Once the schema is in place the model is instantiated by using the `mongoose.model()` function. The returned **ContactModel** object will allow you to find and insert documents into the **Contact** collection.

	````JavaScript
	var Contact = new Schema({
	  id: ObjectId,
	  firstname: String,
	  lastname: String,
	  address: String,
	  email: String,
	  _keywords: Array, index: { unique: false }
	});

	var ContactModel = mongoose.model('Contact', Contact); 
	````

1. Take a look at the `mongoose.connect()` statement, which opens a connection to MongoDb with Mongoose. Take a look how we configured the connection in order to use one configured in Microsoft Azure app settings or use one defined here. This is useful when running locally.

	````JavaScript
	//
	// Replace the local user and password when running it locally
	db = mongoose.connect( process.env.DB || 'mongodb://[LOCAL-USER]:[PASSWORD]@localhost/ContactDb',function(err) { if (err) throw err; }); );
	````

1. Open **contacts.js** from the **routes** folder and locate the **add** function. The `new self.contactModel()` function creates a new contact document and saves it into the collection with the  `contact.save()` function. Notice that the **_keywords** field stores an array with the first name, last name and email of the contact. This field is then used for retrieving contacts.

	````JavaScript
    add: function (req, res) {
        var self = this;
        var item = req.body.item;
        contact = new self.contactModel({
          firstname: item.firstname,
          lastname: item.lastname,
          address: item.address,
          email: item.email,
          _keywords: [ item.firstname.toLowerCase(), item.lastname.toLowerCase(), item.email.toLowerCase() ]
        });

        contact.save(function (err) {
          if (!err) {
			return res.send({contact: contact});
		  } else {
            return console.log(err);
          }
        });
    }
	````

1. Scroll down and locate the **filter** function. Notice the `self.contactModel.find()` function which retrieves all the contacts documents that matches the search term in the FirstName, LastName or Email fields.

	````JavaScript
    filter: function(req, res){
        var self = this;
        var search = req.params._keyword.toLowerCase();
        self.contactModel.find({_keywords: search}, function (err, contacts) {
            if (!err) {
                res.send({contactlist: contacts });
            } else {
              return console.log(err);
            }
        });
    }
	...
	````

<a name="Ex2Task3" />
#### Task 3 – Publishing the Node.js application using GIT ####

1. Go back to the [Microsoft Azure Management Portal](http://manage.windowsazure.com/). Click the _nodeapp_ website and select the **Deployments** tab. Click in the **Copy** icon beside the **GIT URL**.
 
	![Copying the GIT URL](Images/copying-the-git-clone-url.png?raw=true "Copying the GIT URL")

	_Copying the Git Url_


1. In order to publish your local files, open a **Command Prompt**, browse to your application folder (in this case, the **/Source/Assets** folder of this lab) and run the following commands.

	````Bash
	git init
	git add .
	git config --global user.email "{username@example.com}"
	git config --global user.name "{your-user-name}"
	git commit -m "initial commit"
	````

	>**Note:** You can learn more about Git commands in the project documentation <http://git-scm.com/documentation>.

1. To add the remote Microsoft Azure repository and push the files, run the following commands. Replace the _{git-clone-url}_ placeholder with the value obtained from the portal. Enter the deployment credentials when prompted.

	````Bash
	git remote add azure {git-clone-url}
	git push azure master
	````

1. Go to the site **Dashboard** page and copy the **Site Url** link under the **quick glance** section.

	![Node.js application site URL](Images/nodejs-application-site-url.png?raw=true "Node.js application site URL")

	_Node.js application site URL_

1. Open Safari and paste the Site url append _/api/contacts_ to get all the contacts from the database.

	![Get all api result](Images/get-all-api-result.png?raw=true "Get all api result")

	_Get all api result_

1. Take note of one of the ids and navigate to _/api/contacts/{ID}_. You'll get all the information of that contact

	![Get contact by Id](Images/get-contact-by-id.png?raw=true "Get contact by Id")

	_Get contact by Id_

1. Now navigate to _/api/contacts/filter/{KEYWORD}_ which will filter the contact list by the keyword entered. 

	![Filter contacts by keyword](Images/filter-contacts-by-keyword.png?raw=true "Filter contacts by keyword")

	_Filter contacts by keyword_

---

<a name="Summary" />
## Summary ##


In this lab, you have created a new virtual machine starting from a Linux image from the Microsoft Azure Management Portal. Then, you installed and configured a MongoDB server on the virtual machine that can be accessible from an Internet application. Once the server was configured, you published a Node.js application using Microsoft Azure Websites that were connected to the database server running in the virtual machine.

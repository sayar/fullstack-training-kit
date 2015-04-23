var http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    ContactPage = require('./routes/contacts');

var app = express();

//
// Replace the local user and password when running it locally
db = mongoose.connect( process.env.DB || 'mongodb://[LOCAL-USER]:[PASSWORD]@localhost/ContactDb');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
	 layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  //app.use(express.errorHandler());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Contact = new Schema({
  id: ObjectId,
  firstname: String,
  lastname: String,
  address: String,
  email: String,
  _keywords: Array, index: { unique: false }
});

var ContactModel = mongoose.model('Contact', Contact); 

//API
var contactPage = new ContactPage(ContactModel);
app.get('/', function(req, res){
  return contactPage.get(req,res);
});
app.get('/api/contacts', function(req,res){return contactPage.get(req,res);});
app.get('/api/contacts/:id', function(req,res){return contactPage.getById(req,res);});
app.get('/api/contacts/filter/:_keyword', function(req,res){return contactPage.filter(req,res);});
app.post('/api/contacts', function(req,res){return contactPage.add(req,res);});
app.delete('/api/contacts/:id', function(req,res){return contactPage.remove(req,res);});
app.put('/api/contacts/:id', function(req,res){return contactPage.update(req,res);});

// Only listen on $ node app.js
var port = process.env.PORT || 1337;

http.createServer(app).listen(port, function(){
   console.log("Express server listening on port %d ",port);
});


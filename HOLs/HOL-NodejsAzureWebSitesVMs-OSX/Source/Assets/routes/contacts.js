module.exports = contacts;

function contacts (contactModel) {
    this.contactModel = contactModel;
};

contacts.prototype = {
    get: function(req, res){
        var self = this;
        self.contactModel.find(function (err, contacts) {
            if (!err) {
                res.send({ contactlist: contacts });
            } else {
              return console.log(err);
            }
          });
    },
    getById: function(req, res){
        var self = this;
        var id = req.params.id;
        self.contactModel.findOne(function (err, contacts) {
            if (!err) {
                res.send({ contact: contacts });
            } else {
              return console.log(err);
            }
          });
    },
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
    },
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
    },
    remove:function(req, res){
        var self = this;
        var id = req.params.id;
        self.contactModel.findById(id, function (err, contact) {
            if (!err) {
                contact.remove(function(err){
                    if(!err){
                        return res.send({contact: contact });
                    } else{
                        console.log(err);
                    }
                });
            } else {
              return console.log(err);
            }
        });             
    },
    update: function(){
        var self = this;
        var id = req.params.id;
        var item = req.body.item;
        self.contactModel.findById(id, function(err, contact) {
            if (!err) {
                contact.firstname = item.firstname,
                contact.lastname = item.lastname,
                contact.address = item.address,
                contact.email = item.email,
                contact._keywords = [ item.firstname.toLowerCase(), item.lastname.toLowerCase(), item.email.toLowerCase() ]

                contact.save(function (err) {
                    if (err) return handleError(err);
                    res.send({contact: contact });
                });
                
            } else {
              return console.log(err);
            }
        });
    }
};

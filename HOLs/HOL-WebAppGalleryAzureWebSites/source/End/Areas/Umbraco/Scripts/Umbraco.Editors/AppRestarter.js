/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.AppRestarter = Base.extend({

        _opts: null,
        _viewModel: null,
            
        constructor: function () {
            
            //view model for knockout
            this._viewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                status : ko.observable(""),
                retryCount: ko.observable(0),
                statusMsg: ko.observable(""),
                ysod: ko.observable("")
            });
            
        },

        //updates the tree and the app tray, then redirects
        _refreshAppComponents: function() {
            //now that we're successful, let's refresh the tree and apps
            var tree = $u.Sys.ClientApiManager.getMainTree();
            tree.syncNode(tree.getJsTree().get_container().find("li:first"));
            $u.Sys.ClientApiManager.getApp().refreshAppTray();

            self.location = this._opts.redirectUrl;
        },

        //send the ajax request to restart the app pool and to check if its completed
        _restartApp: function(statusCheck) {

            var _this = this;
            
            if (this._viewModel.retryCount() >= 100){
                if (this._viewModel.status() != "error") {
                    this._viewModel.statusMsg("The maximum retry count has been reached, please manually refresh the page.");
                }   
                return;             
            }
            
            if (this._viewModel.status() == "restarted") return;
            if (statusCheck != "wait") {
                //this will only fire twice, once to do the restart and once to check
                $.ajax({
                    data : "{'onlyCheck': '" + statusCheck + "'}",
                    type: "POST",
                    url: _this._opts.ajaxUrl, 
                    error: function(jqXHR, textStatus, errorThrown) {
                        if (_this._viewModel.retryCount() >= 100 && _this._viewModel.status() != "error") {
                            _this._viewModel.status("error");
                            //get text inside body
                            var errorHtml = jqXHR.responseText.split("<body bgcolor=\"white\">")[1].split("</body>")[0];
                            _this._viewModel.statusMsg("A server error occurred during install: \n\n Exception/Stack Trace: \n\n");
                            _this._viewModel.ysod(errorHtml);
                        }
                    },
                    success: function(r) {                    
                        if (r) {
                            _this._viewModel.status(r.status);
                            if (r.status == "restarted") {
                                //now that its successful, lets redirect
                                _this._viewModel.statusMsg("Success! Please wait while redirecting...");
                                setTimeout(function() {
                                    _this._refreshAppComponents();                                
                                }, 1500);
                            }
                        }                    
                    }
                });                
            }

            //recurse!
            this._viewModel.retryCount(this._viewModel.retryCount() + 1);
            setTimeout(function() {_this._restartApp(statusCheck ? "wait": true);}, 1000);
        },

        init: function(o) {
            
            this._opts = o;  
            
            //apply knockout js bindings
            ko.applyBindings(this._viewModel);
                              
            this._restartApp(false);
                                                                       
        }
        
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.AppRestarter();
            return this._instance;
        }

    }); //singleton
    
})(jQuery, base2.Base);
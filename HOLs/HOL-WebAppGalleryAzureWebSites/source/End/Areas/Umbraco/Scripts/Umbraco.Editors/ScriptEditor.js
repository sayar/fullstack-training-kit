/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    // Editor class
    Umbraco.Editors.ScriptEditor = Base.extend({
        
        // Private 
        _opts: null,
        
        _codeMirror: null,
            
        _viewModel: null,
            
        // Constructor
        constructor: function () {

            this._viewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Always set parent
                name: ko.observable(""),
                id: "",
                parentId: "",
                success: ko.observable(false),
                fileContent: "",
                save: function(e) {

                    if (e && e.preventDefault)
                        e.preventDefault();

                    //need to validate the form!
                    if (!$("form").valid())
                        return;

                    var _this = this;
                    var _parent = this.parent;

                    _this.fileContent = _parent._codeMirror.getValue();

                    $("#submit_Save").hide().parent().append("<div class='progress-spinner'/>");

                    $.post(_parent._opts.ajaxUrl, ko.toJSON(_this), function(e) {
                        $("#submit_Save").show().parent().find(".progress-spinner").remove();

                        //remove unsaved notice
                        $(".notice").hide();
                        $(".fill").css({ "top": "0px" });

                        //check result for errors and use our custom validator
                        if (Umbraco.System.ValidationHelper.validateJsonResponse(e, "CustomDataValidationRule")) {
                            _this.success(e.success);
                            
                            _this.onSaveSuccess(e);
                    
                            //show notifications
                            Umbraco.System.NotificationManager.getInstance().showNotifications(e.notifications);
                            //sync the tree to the node path
                            $u.Sys.ApiMgr.getMainTree().syncNode(e.path[0]);
                        }
                    });
                    return false; //prevent default
                },
                onSaveSuccess: function (e) {
                    //allow deriving types to be notified of success  
                }
            });
        },
        
        // Public
        init: function (o) {

            this._opts = $.extend({ }, o);

            var _this = this;
                
            if (!this._opts.ajaxUrl){
                //get the url from the form
                this._opts.ajaxUrl = $("form").attr("action");
            }

            //set the view model props
            this._viewModel.name(this._opts.name);
            this._viewModel.id = this._opts.id;
            this._viewModel.parentId = this._opts.parentId;

            //create the tabs			
            $("#tabs").umbracoTabs({
                    content: "#editorContent"
                });

            //manually add ko-bindings to the form elements
            $("#Name").attr("data-bind", "value: name");
            $("#submit_Save").attr("data-bind", "click: save");

            //initialize CodeMirror  
            var codeMirrorOpts = $.extend({
                theme: "umbraco",
                lineNumbers: true
            }, this._opts.codeMirrorOpts);
                
            this._codeMirror = CodeMirror.fromTextArea(document.getElementById(this._opts.editorTextBoxId), codeMirrorOpts);
                
            //ajust fill height to display unsaved notice
            var notice = $(".notice");
            if(notice.length > 0)
                $(".fill").css({ "top": (notice.position().top + notice.outerHeight() + 12) + "px" });

            //apply knockout js bindings
            ko.applyBindings(this._viewModel);
        },
            
        getCodeMirrorInstance: function () {
            return this._codeMirror;
        }
            
    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.ScriptEditor();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
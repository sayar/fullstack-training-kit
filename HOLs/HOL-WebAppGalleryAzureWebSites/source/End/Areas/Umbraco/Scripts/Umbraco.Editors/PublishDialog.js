/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.PublishDialog = Base.extend({
        
        _opts: null,

        _dialogViewModel: null,
            
        constructor: function () {

            var _this = this;
            
            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                includeChildren: ko.observable(false),
                includeUnpublishedChildren: ko.observable(false),
                msgText: ko.observable(""),
                id: null,
                success: ko.observable(false),
                save: function(e) {
                    e.preventDefault();
                    $("#submit_Save").hide().parent().append("<div class='progress-spinner'/>");
                    var _this = this;
                    var data = ko.toJSON(_this);
                    $.post(_this.parent._opts.ajaxUrl, data, function(e) {
                        $("#submit_Save").show().parent().find(".progress-spinner").remove();
                        //check result for errors and use our custom validator
                        if (Umbraco.System.ValidationHelper.validateJsonResponse(e, "CustomDataValidationRule")) {
                            $(".validation-summary").validationSummaryApi().hideSummary();
                            _this.success(e.success);
                            _this.msgText(e.msg);
                            Umbraco.System.NotificationManager.getInstance().showNotifications(e.notifications);
                        }
                    });
                }
            });
            
            //uncheck the includeUnpublishedChildren property if the includeChildren property is unchecked
            this._dialogViewModel.includeChildren.subscribe(function(newValue) {            
                if (!newValue) _this._dialogViewModel.includeUnpublishedChildren(false);
            });
            
        },

        nodeClickHandler: function(e, args) {
            ///<summary>Handles the tree node click</summary>
                
            var id = args.node.attr("id");

            //set the view model properties
            this._dialogViewModel.toId(id);
            this._dialogViewModel.hasSelectedNode(true);
            this._dialogViewModel.msgText("'" + args.node.find("span:first").text() + "' has been selected as the root of your new content, click 'Save'.");
        },

        init: function(o) {            
                        
            this._opts = o;

            //init the view model properties
            this._dialogViewModel.id = this._opts.id;

            //manually add ko-bindings to the form elements
            $("#submit_Save").attr("data-bind", "click: save, visible: !success()");                
                
            //enabled the standard validation engine
            $.validator.unobtrusive.reParse($("form"));

            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel);
        }

    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.PublishDialog();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.PermissionsDialog = Base.extend({
        
        _opts: null,

        _dialogViewModel: null,
            
        constructor: function () {

            var _this = this;

            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                id: null,
                userGroups: ko.observableArray([]),
                success: ko.observable(false),
                msgText: ko.observable(""),
                selectedUserGroup: ko.observable(""),
                save: function(e) {
                    e.preventDefault();
                    var _this = this;
                    var data = {
                        id: _this.id,
                        userGroupPermissions: []
                    };
                    $("div.permissions-grid-container").each(function(idx, el) {
                        data.userGroupPermissions.push($(el).permissionsGridApi().getPermissions());
                    });
                    $("#submit_Save").hide().parent().append("<div class='progress-spinner'/>");
                    $.post(_this.parent._opts.ajaxUrl, ko.toJSON(data), function(e) {
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
        },

        init: function(o) {

            this._opts = $.extend({ ajaxUrl: $("form").attr("action") }, o);

            //populate the view model                
            this._dialogViewModel.id = this._opts.id;
                
            //create the permissions grids
            //NOTE: We move the grids to the root to move them out of the permissions dialog scope, and move them back once the data is bound 
            for(var i = 0; i < this._opts.userGroupPermissions.length; i++) {
                var userGroupPermissionsModel = this._opts.userGroupPermissions[i];
                var htmlId = userGroupPermissionsModel.userGroupHtmlId;
                this._dialogViewModel.userGroups.push(htmlId);
                $("div#" + htmlId + ".permissions-grid-container").hide().appendTo("body").permissionsGrid({
                    userGroupPermissionsModel: userGroupPermissionsModel
                });
            };
                
            //hook up the user groups selector, and select first entry
            $(".user-group-selector").change(function() {
                var htmlId = $(this).val();
                $("div.permissions-grid-container").hide();
                $("div#" + htmlId + ".permissions-grid-container").show();
            }).triggerHandler("change");
                
            //manually add ko-bindings to the form elements
            if(this._dialogViewModel.userGroups().length > 0)
                $("#submit_Save").attr("data-bind", "click: save, visible: !success()");
            else
                $("#submit_Save").remove();
                
            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel, $("#editor").get(0));
                
            //move grids back
            $("div.permissions-grid-container").appendTo(".permissions-grids-container");
        }

    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.PermissionsDialog();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
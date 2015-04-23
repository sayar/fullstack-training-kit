/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.RollbackDialog = Base.extend({
        
        _opts: null,

        _dialogViewModel: null,
            
        constructor: function () {

            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                id: null,
                selectedVersion: ko.observable(""),
                viewMode: ko.observable("diff"),
                loading: ko.observable(false),
                diffData: ko.observable(null),
                msgText: ko.observable(""),
                success: ko.observable(false),
                diff: function(e) {
                    e.preventDefault();
                    var versionId = this.selectedVersion();
                    if (versionId != "") {
                        var _this = this;
                        _this.loading(true);
                        var data = ko.toJSON({
                            id: _this.id,
                            revisionId: versionId
                        });
                        $.post(_this.parent._opts.diffUrl, data, function(e) {
                            _this.loading(false);
                            _this.diffData(e);
                        });
                    } else {
                        $(".diff-wrapper").empty();
                    }
                },
                save: function(e) {
                    e.preventDefault();
                    $("#submit_Save").hide().parent().append("<div class='progress-spinner'/>");
                    var _this = this;
                    var data = ko.toJSON({
                        id: _this.id,
                        revisionId: _this.selectedVersion()
                    });
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
                this._instance = new Umbraco.Editors.RollbackDialog();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
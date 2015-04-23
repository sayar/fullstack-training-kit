/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.SortDialog = Base.extend({
        
        _opts: null,

        _dialogViewModel: null,
            
        constructor: function () {
            
            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Always set
                msgText: ko.observable(""),
                parentId: null,
                success: ko.observable(false),
                items: [],
                save: function(e) {
                    e.preventDefault();
                    var _this = this;
                    var data = ko.toJSON(_this);
                    $("#submit_Save").hide().parent().append("<div class='progress-spinner'/>");
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

            var _this = this;
            
            this._opts = o;

            //init the view model properties
            this._dialogViewModel.parentId = this._opts.parentId;
            //populate the array with observable items
            for(var i in this._opts.items) {
                var item = {
                    id: this._opts.items[i].id,
                    sortIndex: ko.observable(this._opts.items[i].sortIndex),
                    utcCreated: this._opts.items[i].utcCreated,
                    name: this._opts.items[i].name
                };
                this._dialogViewModel.items.push(item);
            }                

            //manually add ko-bindings to the form elements
            $("#submit_Save").attr("data-bind", "click: save, visible: !success()");

            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel);

            //add sort behavior
            $(".sort-table").sortable({
                items: 'tbody tr', 
                containment: $(".sort-table tbody"),
                axis: "y",
                update: function (e, ui) {
                    //loop through each item and update it's index
                    for(var i in _this._dialogViewModel.items) {
                        var index = $(".sort-table tbody tr")
                            .index($(".sort-table tbody tr[data-id='" + _this._dialogViewModel.items[i].id + "']"));
                        _this._dialogViewModel.items[i].sortIndex(index);
                    }                                               
                }                    
            });              
        }

    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.SortDialog();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
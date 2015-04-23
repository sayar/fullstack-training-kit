/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.HostnameDialog = Base.extend({
        
        _opts: null,
        _dialogViewModel: null,
            
        constructor: function () {
            
            //view model for knockout js
            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                id: null,
                success: ko.observable(false),
                msgText: ko.observable(""),
                currentValue: ko.observable(""),
                virtualDirectory: "",
                assignedHostnames: ko.observableArray(),
                save: function(e) {
                    ///<summary>Saves the hostnames</summary>

                    e.preventDefault();
                    //enabled/disable certain validators for submitting
                    $("#DataValidation").rules("remove", "CustomDataValidationRule");
                    $("#NewHostname").rules("remove", "required");
                    if ($("form").valid()) {
                        $(".validation-summary").validationSummaryApi().hideSummary();
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
                },
                addNew: function() {
                    ///<summary>Adds a new hostname item to the array</summary>          

                    //enabled/disable certain validators for this button
                    $("#DataValidation").rules("remove", "CustomDataValidationRule");
                    $("#NewHostname").rules("add", { required: true });
                    if ($("form").valid()) {
                        this.parent._addHostname($("#NewHostname").val(), null);
                        this.currentValue("");
                        $(".validation-summary").validationSummaryApi().hideSummary();
                    }
                    //re-enable/disable certain validators
                    $("#NewHostname").rules("remove", "required");
                }
            });
            
            //add dependent observables
            this._dialogViewModel.resultRoute = ko.dependentObservable(function() {
                return this.currentValue() + (this.virtualDirectory.length > 0 ? this.virtualDirectory + "/" : "");
            }, this._dialogViewModel);
            
        },

        _addHostname: function(val, id) {
            
            var _this = this;
            
            ///<summary>Adds an item to the assigned host names array</summary>
            var model = {
                id: id,
                hostname: val,                
                sortOrder: 0, //we'll make this work eventually
                deleteItem: function() {
                    ///<summary>Removes the item from the array</summary>
                    var _item = this;
                    _this._dialogViewModel.assignedHostnames.remove(function(item) {
                        return item.hostname == _item.hostname;
                    });
                }
            };    
            
            //add dependent observables
            model.resultRoute = ko.dependentObservable(function() {
                    return this.hostname + (_this._opts.virtualDirectory.length > 0 ? _this._opts.virtualDirectory + "/" : "");
                }, model);
            
            this._dialogViewModel.assignedHostnames.push(model);
        },


        init: function(o) {

            var _this = this;

            this._opts = $.extend({ ajaxUrl: $("form").attr("action") }, o);;

            //populate the view model                
            this._dialogViewModel.id = this._opts.id;
            this._dialogViewModel.virtualDirectory = this._opts.virtualDirectory;
            for (var i in this._opts.assignedHostNames) {
                this._addHostname(this._opts.assignedHostNames[i].hostname, this._opts.assignedHostNames[i].id);
            }

            //manually add ko-bindings to the form elements
            $("#submit_Save").attr("data-bind", "click: save, visible: !success()");

            //add a custom jquery validation rule
            $.validator.addMethod("existsAlready",
                function(value, element) {
                    if (value.length > 0) {
                        var items = _this._dialogViewModel.assignedHostnames();
                        for (var i in _this._dialogViewModel.assignedHostnames()) {
                            if (items[i].hostname == value) {
                                return false;
                            }
                        }
                    }
                    return true;
                }, "The hostname entered already exists");
            $.validator.addMethod("hostname",
                function(value, element, regexp) {
                    if (regexp.constructor != RegExp)
                        regexp = new RegExp(regexp);
                    else if (regexp.global)
                        regexp.lastIndex = 0;
                    var r = this.optional(element) || regexp.test(value);
                    if (r) {
                        //need to validate the port if there is one
                        if (value.indexOf(":") > 0) {
                            var port = value.split(":")[1];
                            return port.match( /^\d+$/ );
                        }
                        return true;
                    }
                    return false;
                }, "Please enter a valid domain name and port (if a port is assigned)"
            );

            //add the validation rule to the hostname input
            $("#NewHostname").rules("add", { existsAlready: true });
            $("#NewHostname").rules("add", { hostname: /^([\w-\.:]+)$/i });



            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel);
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.HostnameDialog();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
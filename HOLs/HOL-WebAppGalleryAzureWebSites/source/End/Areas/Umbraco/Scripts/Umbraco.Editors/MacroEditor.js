/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.MacroEditor = Base.extend({

        _opts: null,

        _createMacroParameterViewModel: null,
        _macroPropertiesViewModel: null,
        _macroParametersViewModel: null,

        constructor: function () {

            //knockout js view model for managing the macro properties
            this._macroPropertiesViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                selectedMacroType: ko.observable(""),
                selectedMacroItem: ko.observable(""),
                macroItems: null,
                selectedItemLabel: null
            });

            //knockout js view model for managing the macro parameters
            this._macroParametersViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                macroParameters: ko.observableArray(),
                availableMacroParamEditors: [],
                populateParameters: function (e) {
                    e.preventDefault();
                    var _this = this;
                    var data = "{'macroEngineName': '" + _this.parent._macroPropertiesViewModel.selectedMacroType() + "', 'selectedItem': '" + _this.parent._macroPropertiesViewModel.selectedMacroItem() + "'}";
                    $("#submit_Save").hide().parent().append("<div class='progress-bar'/>");
                    $.post(_this.parent._opts.populateUrl, data, function (e) {
                        $("#submit_Save").show().parent().find(".progress-bar").remove();
                        Umbraco.System.NotificationManager.getInstance().showNotifications(e.notifications);
                        if (e.success) {
                            //for each paramter returned fill in the create view model and calls its add method
                            for (var p in e.parameters) {
                                _this.parent._createMacroParameterViewModel.alias(e.parameters[p].parameterName);
                                _this.parent._createMacroParameterViewModel.name(e.parameters[p].parameterName);
                                _this.parent._createMacroParameterViewModel.show(false);
                                _this.parent._createMacroParameterViewModel.parameterEditorId('');
                                _this.parent._createMacroParameterViewModel.addNew();
                            }
                        }
                    });
                }
            });

            //knockout js view model for managing the macro parameters
            this._createMacroParameterViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                show: ko.observable(false),
                alias: ko.observable(''),
                name: ko.observable(''),
                parameterEditorId: ko.observable(''),
                addNew: function () {
                    //validate the inputs, don't ignore the new fields, reparse, then validate
                    $("#macroParameterTable tfoot input").removeClass("ignore");
                    $("form").validate();
                    if ($("form").valid()) {
                        this.parent._addMacroParameter({
                            show: this.show(),
                            alias: this.alias(),
                            name: this.name(),
                            parameterEditorId: this.parameterEditorId()
                        });
                        //reset the inputs
                        this.parameterEditorId('');
                        this.show(false);
                        this.alias('');
                        this.name('');
                        //revalidate
                        $("#macroParameterTable tfoot input").addClass("ignore");
                        $.validator.unobtrusive.reParse($("form"));
                    }
                }
            });

            this._createMacroParameterViewModel.availableMacroParamEditors = ko.dependentObservable(function () {
                return this.availableMacroParamEditors;
            }, this._macroParametersViewModel);
        },

        //method to add a new macro parameter to the view model
        _addMacroParameter: function (obj) {

            var _this = this;

            var item = {
                show: ko.observable(obj.show),
                alias: ko.observable(obj.alias),
                name: ko.observable(obj.name),
                parameterEditorId: ko.observable(obj.parameterEditorId),
                deleteItem: function () {
                    _this._macroParametersViewModel.macroParameters.remove(this);
                    //revalidate
                    $.validator.unobtrusive.reParse($("form"));
                    return false;
                }
            };

            //add a dependent observable to return the current index of this item
            item.index = ko.dependentObservable(function () {
                return this.macroParameters.indexOf(item);
            }, this._macroParametersViewModel);
            
            this._macroParametersViewModel.macroParameters.push(item);
        },


        init: function (o) {

            var _this = this;

            this._opts = o;

            //override the default index if it's zero and the query string exists
            if ($u.Sys.QueryStringHelper.getQueryStringValue("tabindex")) {
                this._opts.activeTabIndex = $u.Sys.QueryStringHelper.getQueryStringValue("tabindex");
            }
            //create the tabs			
            $("#tabs").umbracoTabs({
                content: "#editorContent",
                activeTabIndex: this._opts.activeTabIndex,
                activeTabIndexField: this._opts.activeTabIndexField
            });

            //populate the macro parameters observable array with observable macro params
            for (var i in this._opts.macroParameters) {
                this._addMacroParameter({
                    parameterEditorId: this._opts.macroParameters[i].parameterEditorId,
                    show: this._opts.macroParameters[i].show,
                    alias: this._opts.macroParameters[i].alias,
                    name: this._opts.macroParameters[i].name
                });
            }

            //populate the available macro parameter editors
            for (var i in this._opts.availableMacroParamEditors) {
                var item = {
                    name: this._opts.availableMacroParamEditors[i].name,
                    value: this._opts.availableMacroParamEditors[i].id
                };
                this._macroParametersViewModel.availableMacroParamEditors.push(item);
            }

            //manually add ko-bindings to the macro type drop down
            this._opts.macroTypeDropDown.attr("data-bind", "value: selectedMacroType");

            //add dependent observable method to the view model to create the drop down list based on the macro type selected
            this._macroPropertiesViewModel.macroItems = ko.dependentObservable(function () {
                if (this.selectedMacroType()=="") return null;
                var macroItems = [];
                //loop through available macro items to find the one selected
                for(var m in _this._opts.availableMacroItems) {
                    if (_this._opts.availableMacroItems[m].item1 == this.selectedMacroType()) {                        
                        //item2 is the list in the Tuple
                        for(var s in _this._opts.availableMacroItems[m].item2) {
                            macroItems.push(_this._opts.availableMacroItems[m].item2[s]);
                        }
                        break;
                    }
                }
                return macroItems;
            }, this._macroPropertiesViewModel);

            //add dependent observable method to the view model to change the label of the selected macro item
            this._macroPropertiesViewModel.selectedItemLabel = ko.dependentObservable(function () {
                if (this.selectedMacroType()=="") return null;
                var macroItems = null;
                //loop through available macro items to find the one selected
                for(var m in _this._opts.availableMacroItems) {
                    if (_this._opts.availableMacroItems[m].item1 == this.selectedMacroType()) {
                        macroItems = _this._opts.availableMacroItems[m];
                        break;
                    }
                }
                if (macroItems) { //item1 is the name property of the Tuple
                    return macroItems.item1;
                }

                throw "Could not find the macro engine specified: " + this.selectedMacroType();
                
            }, this._macroPropertiesViewModel);

            this._macroPropertiesViewModel.selectedMacroType(this._opts.selectedMacroType);
            this._macroPropertiesViewModel.selectedMacroItem(this._opts.selectedMacroItem);

            //apply knockout js bindings
            ko.applyBindings(this._macroPropertiesViewModel, $("#macroPropertiesTab").get(0));
            ko.applyBindings(this._macroParametersViewModel, $("#macroParameterTable tbody").get(0));
            //since the populate element exists outside of the parameter table, we need to manually bind it like this:
            ko.applyBindingsToNode($("#macroParametersPopulate button").get(0), null, this._macroParametersViewModel);
            ko.applyBindings(this._createMacroParameterViewModel, $("#macroParameterTable tfoot").get(0));

            $.validator.unobtrusive.reParse($("form"));
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.MacroEditor();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
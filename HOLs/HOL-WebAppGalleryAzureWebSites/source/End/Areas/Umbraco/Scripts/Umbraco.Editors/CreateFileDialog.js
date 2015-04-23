/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.CreateFileDialog = Base.extend({
        
        _opts: null,
        _dialogViewModel: null,
            
        constructor: function () {

            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                createType: ko.observable("File"),
                availableFileExtensions: ko.observableArray([]),
                selectedFileExtension: ko.observable(""),
                availableStubs: ko.observableArray([])
            });
            
            this._dialogViewModel.filteredStubs = ko.dependentObservable(function() {
                var _this = this;
                if(_this.selectedFileExtension() != undefined) {
                    return ko.utils.arrayFilter(this.availableStubs(), function(itm) {
                        return itm.text.substr(_this.selectedFileExtension().length * -1) == _this.selectedFileExtension();
                    });                } else {
                    return [];   
                }
            }, this._dialogViewModel);
            
        },

        init: function(o) {            
                         
            this._opts = o;

            var _this = this;

            $.each(this._opts.availableFileExtensions, function(idx, itm) {
                _this._dialogViewModel.availableFileExtensions.push(itm);
            });
            
            $.each(this._opts.availableStubs, function(idx, itm) {
                _this._dialogViewModel.availableStubs.push(itm);
            });

            //subscribe to the knockout view model change for 'createType'
            this._dialogViewModel.createType.subscribe(function(newValue) {
                if (newValue == "Folder") {
                    $("#submit_Save").html("save");
                }
                else {
                    $("#submit_Save").html("next >");
                }
            });


            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel);
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.CreateFileDialog();
            return this._instance;
        }

    }); 

})(jQuery, base2.Base);
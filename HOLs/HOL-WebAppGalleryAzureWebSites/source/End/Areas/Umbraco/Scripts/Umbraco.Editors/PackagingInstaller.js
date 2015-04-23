/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.PackageInstaller = Base.extend({

        _viewModel: null,
            
        constructor: function () {

            this._viewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                autoInstall: ko.observable(false),
                acceptTerms: ko.observable(false),
                validateInstall: function() {
                    return confirm("Are you sure you want to install this package?");
                },
                validateRemoval: function() {
                    return confirm("This will delete this package from your local repository, are you sure you want to remove it?");
                },
                validateUninstall: function() {
                    return confirm("Are you sure you want to uninstall this package?");
                }
            });
            
            this._viewModel.canUpload = ko.dependentObservable(function() {
                return !this.autoInstall() || (this.autoInstall() && this.acceptTerms());
            }, this._viewModel);
        },

        init: function() {
            //apply knockout js bindings
            ko.applyBindings(this._viewModel);
        }
            
    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.PackageInstaller();
            return this._instance;
        }
        
    });
    
})(jQuery, base2.Base);
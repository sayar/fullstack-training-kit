/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors.InsertMacroEditor");

(function ($, Base) {

    Umbraco.Editors.InsertMacroEditor.SetParameters = Base.extend({

        _editorViewModel: null,

        constructor: function () {

            this._editorViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                cancel: function (e) {
                    e.preventDefault();

                    // Close the dialog
                    window.parent.$u.Sys.WindowManager.getInstance().hideModal();
                }
            });

        },

        init: function () {

            //apply knockout js bindings
            ko.applyBindings(this._editorViewModel, $(".button-bar").get(0));

        }
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.InsertMacroEditor.SetParameters();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.DataTypeEditor = Base.extend({
            
        init: function (o) {

            var _opts = $.extend({
                //jquery selector for the proeprty editor drop down list
                propEditorDropDown: false
            }, o);

            //create the tabs			
            $("#tabs").umbracoTabs({
                content: "#editorContent"
            });
        
            //The knockout js view model for the selected item
            var selectedPropEditorViewModel = {
                selectedId: ko.observable(_opts.propEditorDropDown.val()),
                itemChanged: function (event) {
                    this.selectedId($(event.target).val());
                }
            };

            ko.applyBindings(selectedPropEditorViewModel, document.getElementById('dataTypeDefinition'));
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.DataTypeEditor();
            return this._instance;
        }

    });     

})(jQuery, base2.Base);
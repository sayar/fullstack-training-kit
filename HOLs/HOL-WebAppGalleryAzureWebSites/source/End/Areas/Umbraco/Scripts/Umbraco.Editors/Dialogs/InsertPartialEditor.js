/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.InsertPartialEditor = Base.extend({

        _editorViewModel: null,

        constructor: function () {

            this._editorViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                availablePartials: ko.observableArray([]),
                selectedPartial: ko.observable(),
                save: function(e) {
                    e.preventDefault();
                    
                    // Build up code snippet
                    var snippet = "@Html.Partial(\""+ this.selectedPartial() +"\")";
                    
                    // Insert snippet into current editors code mirror instance
                    window.parent.editor.getCodeMirrorInstance().replaceSelection(snippet);
                    window.parent.editor.getCodeMirrorInstance().focus();
                    
                    // Close the dialog
                    this.cancel(e);
                },
                cancel: function(e) {
                    e.preventDefault();
                    
                    // Close the dialog
                    window.parent.$u.Sys.WindowManager.getInstance().hideModal();
                }
            });

        },

        init: function (o) {

            var _this = this;

            $.each(o.availablePartials, function(idx, itm) {
                _this._editorViewModel.availablePartials.push(itm);
            });

            //apply knockout js bindings
            ko.applyBindings(this._editorViewModel);
            
        }
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.InsertPartialEditor();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
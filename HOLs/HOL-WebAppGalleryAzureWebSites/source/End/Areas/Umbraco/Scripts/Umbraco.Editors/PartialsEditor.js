/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.Editors/ScriptEditor.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($) {

    // Editor class
    Umbraco.Editors.PartialsEditor = Umbraco.Editors.ScriptEditor.extend({
            
        // Public
        init: function(o){
            
            // Call base constructor
            this.base(o);

            _this = this;
            
            // Toolbar buttons
            $("#submit_InsertField").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Insert an umbraco page field",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.insertFieldUrl,
                    modalClass: "insert-field",
                    removeOnHide: false
                });
                
            });
            
            $("#submit_InsertMacro").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Insert a Macro",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.insertMacroUrl,
                    modalClass: "insert-field",
                    removeOnHide: false
                });
                
            });
        }
            
    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.PartialsEditor();
            return this._instance;
        }
        
    });

})(jQuery);
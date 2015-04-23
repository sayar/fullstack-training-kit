/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors.InsertMacroEditor");

(function ($, Base) {

    Umbraco.Editors.InsertMacroEditor.InsertMacro = Base.extend({

        init: function (o) {

            // Build up code snippet
            var snippet = "@Umbraco.RenderMacro(\"" + o.macroAlias +"\"";
            
            var params = "";
            for(var paramName in o.macroParams) {
                if(params != "")
                    params += ", ";
                params += paramName + " = \"" + o.macroParams[paramName] +"\"";
            }
            
            if(params != "") {
                snippet += ", new { " + params + " }";
            }
            
            snippet += ")";
            
            // Insert snippet into current editors code mirror instance
            window.parent.editor.getCodeMirrorInstance().replaceSelection(snippet);
            window.parent.editor.getCodeMirrorInstance().focus();
            
            // Close the dialog
            window.parent.$u.Sys.WindowManager.getInstance().hideModal();

        }
        
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.InsertMacroEditor.InsertMacro();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
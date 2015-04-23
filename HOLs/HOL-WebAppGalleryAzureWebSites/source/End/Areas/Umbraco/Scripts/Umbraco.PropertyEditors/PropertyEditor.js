/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="../../Scripts/Umbraco.Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.PropertyEditors");

(function ($, Base) {

    // Initializes a new instance of the PropertyEditor class.
    // Should be extended by property editors with any additional functionality needed.
    Umbraco.PropertyEditors.PropertyEditor = Base.extend({
            
        id : null,
        context : null,
        
        constructor: function(id){
            this.id = id;
        }
        
    });
     
})(jQuery, base2.Base);
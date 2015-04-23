/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.UI");

(function ($, Base) {

    // A class to represent a UI Element
    Umbraco.UI.UIElement = Base.extend({
            
        _element: null,
            
        constructor: function (uiElementDef) {
            // constructor should be overriden in derived types to construct the element
            // base upon the passed in uiElementDef
        },
            
        bind: function () {
            // bind should be overridden in derived types to bind the UI elements events
        },
            
        getElement: function () {
            return this._element;
        }
        
    });

})(jQuery, base2.Base);
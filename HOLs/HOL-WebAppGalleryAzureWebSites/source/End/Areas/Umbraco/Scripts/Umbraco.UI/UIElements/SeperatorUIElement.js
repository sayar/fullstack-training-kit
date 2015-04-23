/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.UI.UIElements");

(function ($, Base) {

    // A class to represent a Seperator UI Element
    Umbraco.UI.UIElements.SeperatorUIElement = Umbraco.UI.UIElement.extend({

        constructor: function (uiElementDef) {
            // Create element
            this._element = $("<span class='seperator-ui-element'></span>");
        }

    });

})(jQuery, base2.Base);
/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.UI.UIElements");

(function ($, Base) {

    // A class to represent a Button UI Element
    Umbraco.UI.UIElements.ButtonUIElement = Umbraco.UI.UIElement.extend({
        
        _uiElementDef: null,
            
        constructor: function (uiElementDef) {

            this._uiElementDef = uiElementDef;
            
            // Convert null values to empty strings
            uiElementDef.cssClass = uiElementDef.cssClass == null ? "" : uiElementDef.cssClass;
            uiElementDef.icon = uiElementDef.icon == null ? "" : uiElementDef.icon;
            
            // Create element
            var elementString = "<input class='button-ui-element " + uiElementDef.cssClass + "' alt='"+ uiElementDef.title +"' title='"+ uiElementDef.title +"' value='"+ uiElementDef.title +"'";
            switch(uiElementDef.buttonType.toLowerCase()) {
                case "image":
                    elementString += " type='image' src='"+ uiElementDef.icon +"'";
                    break;
                case "button":
                    elementString += " type='button'";
                    break;
                case "submit":
                    elementString += " type='submit'";
                    break;
            }
            
            for(var key in uiElementDef.additionalData) {
                elementString += " " + key + "=\"" + uiElementDef.additionalData[key] + "\"";
            }
            
            elementString += " />";
            this._element = $(elementString);
        },
        
        bind: function(){
            this._element.data('uiElementDef', this._uiElementDef);
            this._element.click(function( e ){
                e.preventDefault();
                var uiElementDef = $(this).data('uiElementDef');
                $(uiElementDef).trigger('action');
            });
        }
            
    });

})(jQuery, base2.Base);
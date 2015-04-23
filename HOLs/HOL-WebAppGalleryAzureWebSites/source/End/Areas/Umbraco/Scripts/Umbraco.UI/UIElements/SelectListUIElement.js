/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.UI.UIElements");

(function ($, Base) {

    // A class to represent a Select List UI Element
    Umbraco.UI.UIElements.SelectListUIElement = Umbraco.UI.UIElement.extend({
        
        _uiElementDef: null,
            
        constructor: function (uiElementDef) {

            this._uiElementDef = uiElementDef;
            
            // Convert null values to empty strings
            uiElementDef.cssClass = uiElementDef.cssClass == null ? "" : uiElementDef.cssClass;
            
            // Create element
            var elementString = uiElementDef.title + "&nbsp;<select class='select-list-ui-element " + uiElementDef.cssClass + "' alt='"+ uiElementDef.title +"' title='"+ uiElementDef.title +"'";
            for(var key in uiElementDef.additionalData) {
                elementString += " " + key + "=\"" + uiElementDef.additionalData[key] + "\"";
            }
            elementString += "><option value=''>"+ uiElementDef.title +"</option>";
            
            if(uiElementDef.items != null && uiElementDef.items != undefined) {
                for (var i = 0; i < uiElementDef.items.length; i++) {
                    elementString += "<option value=\"" + uiElementDef.items[i].value + "\">" + uiElementDef.items[i].text + "</option>";
                }
            }

            elementString += "</select>";
            this._element = $(elementString);
        },
        
        bind: function(){
            this._element.data('uiElementDef', this._uiElementDef);
            this._element.change(function( e ){
                e.preventDefault();
                var uiElementDef = $(this).data('uiElementDef');
                $(uiElementDef).trigger('action');
            });
        }
            
    });

})(jQuery, base2.Base);
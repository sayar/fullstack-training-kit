/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="../../Scripts/Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.PropertyEditors");

(function ($, Base) {

    // Initializes a new instance of the PropertyEditorContext class.
    // Should only be created by the Property Editor Manager
    Umbraco.PropertyEditors.PropertyEditorContext = Base.extend({

        id: null,
        uiElements: null,

        //can be set to disable the panel from being shown
        enablePanel: true,
            
        constructor: function () {
            this.uiElements = [];
        },

        registerUIElement: function(uiElement)
        {
            var context = this;

            // Only bind action handler if an interactive UI Element
            if (uiElement.alias != undefined)
            {
                $(uiElement).bind('action', function() {

                    var eventName = 'on' + uiElement.alias;
                        
                    //trigger an event with the name of the alias (i.e. onBold )
                    $(context).trigger(eventName, this);

                    //trigger a global event so listeners can bind once without knowing all of the buttons
                    $(context).trigger('action', { element: this, event: eventName });
                });
            }

            this.uiElements.push(uiElement);
        }

    });

})(jQuery, base2.Base);
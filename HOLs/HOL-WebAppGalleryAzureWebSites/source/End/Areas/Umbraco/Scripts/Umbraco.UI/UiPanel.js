/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.UI");

(function ($, Base) {

    // Initializes a new instance of the UIPanel class.
    Umbraco.UI.UIPanel = Base.extend({

        // Private
        _cachedPanels: [],
        _currentPanel: null,
            
        // Create UI panel from a property editor context
        _createPanel: function(context) {

            var panel = $("<div class='ui-panel'></div>");

            // Loop through all action items
            var uiElementsCount = context.uiElements.length;

            for (var i = 0; i < uiElementsCount; i++) {

                var uiElement = context.uiElements[i];

                // Check to see if the UI Element belongs to this action panel
                if (uiElement.uIPanelAlias == this.alias) {
                    var uiElementInst = Umbraco.UI.UIElementFactory.getInstance().createUIElement(uiElement);
                    uiElementInst.bind();
                    panel.append(uiElementInst.getElement());
                }
            }

            return panel;
        },
            
        // Constuctor
        constructor: function (element, alias, defaultUIElements) {
            
            var el = $(element);

            this.alias = alias;

            var _this = this;
            
            //TODO: Allow a default set of UI elements to be passed in on constructor 
            if(defaultUIElements)
            {
                for (var i = 0; i < defaultUIElements.length; i++) {
                    var uiElement = defaultUIElements[i];
                    // Check to see if the UI Element belongs to this action panel
                    if (uiElement.uIPanelAlias == this.alias) {
                        var uiElementInst = Umbraco.UI.UIElementFactory.getInstance().createUIElement(uiElement);
                        el.append(uiElementInst.getElement());
                    }
                }
            }

            // Listen for the set focus event on the peroperty editor manager
            $(Umbraco.PropertyEditors.PropertyEditorManager.getInstance()).bind('setFocus', function(e, context){
            
                if (_this._currentPanel != null)
                    _this._currentPanel.hide();
                
                if(context == null) 
                    return;

                if(_this._cachedPanels[context.id] == undefined) {
                    var panel = _this._createPanel(context);
                    panel.hide(); //initialize to hidden
                    el.append(panel);
                    _this._currentPanel = _this._cachedPanels[context.id] = panel;
                } else {
                    _this._currentPanel = _this._cachedPanels[context.id];
                };

                if (context.enablePanel) {
                    _this._currentPanel.show();
                }            
            });
            
        },
            
        // Public
        alias : ""

    });

    // jQuery helper method to allow initialization via jQuery syntax
    $.fn.UIPanel = function(alias, defaultUIElements) {

        return this.each(function() {
            var uiElementPanel = new Umbraco.UI.UIPanel(this, alias, defaultUIElements);
        });

    };

})(jQuery, base2.Base);
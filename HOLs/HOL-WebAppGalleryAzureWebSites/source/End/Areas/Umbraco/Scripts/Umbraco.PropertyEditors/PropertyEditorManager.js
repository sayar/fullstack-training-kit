/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.PropertyEditors");

(function ($, Base) {

    // Singleton PropertyEditorManager class to encapsulate the management of PropertyEditors.
    Umbraco.PropertyEditors.PropertyEditorManager = Base.extend({

        _propertyEditorUIElements: {},

        // List of registered property editors
        _registeredPropertyEditors: [],

        // Placeholder to the currently focused property editor
        _currentPropertyEditor: null,

        getPropertyEditorUIElements: function(propEditorId) {
            ///<summary>returns all ui elements registered for a given property editor id</summary>
            return this._propertyEditorUIElements[propEditorId];
        },

        init: function(uiElements) {
            this._propertyEditorUIElements = uiElements;
        },

        // Registers a property editor with the manager, and creates and assigns a Property Editor Context
        registerPropertyEditor: function(propEditor, callBack) {

            // Check to make sure the property editor hasn't already been registered
            if (this._registeredPropertyEditors[propEditor.id] == undefined) {

                // Create a context
                var context = new Umbraco.PropertyEditors.PropertyEditorContext();
                context.id = propEditor.id;

                // Get all UI Element definitions for current property editor
                if (this._propertyEditorUIElements[propEditor.id] != undefined) {
                    $.each(this._propertyEditorUIElements[propEditor.id], function(idx, el) {
                        context.registerUIElement(el);
                    });
                }

                // Set the property editors context
                propEditor.context = context;

                // Cache the property editor
                this._registeredPropertyEditors[propEditor.id] = propEditor;

                // Notify the view to trigger initialization
                callBack.apply(propEditor, [context]);
            }
        },

        // Sets the current focused property editor and broadcasts a focus event
        // to notify UI Panels
        setFocus: function(event, propEditor) {

            // Stop the event from bubbling
            if (event) event.stopPropagation();

            // Set the current property editor
            this._currentPropertyEditor = propEditor;

            // Grab the context
            var context = (this._currentPropertyEditor == null) ? null : this._currentPropertyEditor.context;

            // Broadcast setFocus event
            $(this).trigger("setFocus", [context]);
        }

    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.PropertyEditors.PropertyEditorManager();
            return this._instance;
        }
        
    });

    // Setup default mousedown on the tab container to hide any panels by default
    $(function(){
        $("#editorContent,#tabs").mousedown(function(e){
            Umbraco.PropertyEditors.PropertyEditorManager.getInstance().setFocus(e, null);
        });
    });
    
})(jQuery, base2.Base);
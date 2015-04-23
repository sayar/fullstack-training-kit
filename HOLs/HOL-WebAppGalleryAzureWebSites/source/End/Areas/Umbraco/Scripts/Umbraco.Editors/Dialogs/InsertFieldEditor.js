/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.InsertFieldEditor = Base.extend({

        _opts: null,

        _editorViewModel: null,

        constructor: function () {

            this._editorViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                availableFields: ko.observableArray([]),
                availableCasingTypes: ko.observableArray([]),
                availableEncodingTypes: ko.observableArray([]),
                selectedField: ko.observable(),
                selectedAlternativeField: ko.observable(),
                alternativeText: ko.observable(),
                recursive: ko.observable(false),
                insertBefore: ko.observable(),
                insertAfter: ko.observable(),
                selectedCasingType: ko.observable("Unchanged"),
                selectedEncodingType: ko.observable("Unchanged"),
                convertLineBreaks: ko.observable(false),
                removeParagraphTags: ko.observable(false),
                save: function(e) {
                    e.preventDefault();
                    
                    // Build up code snippet
                    var snippet = "@Umbraco.Field(\""+ this.selectedField().replace(" - ", "\", \"") +"\"";
                    
                    if(this.selectedAlternativeField() && this.selectedAlternativeField() != "") {
                        snippet += ", altFieldAlias: \"" + this.selectedAlternativeField().replace(" - ", "\", altValueAlias: \"") + "\"";
                    }
                    
                    if(this.alternativeText() && this.alternativeText() != "") {
                        snippet += ", altText: \"" + this.alternativeText() + "\"";
                    }
                    
                    if(this.recursive()) {
                        snippet += ", recursive: " + this.recursive();
                    }
                    
                    if(this.insertBefore() && this.insertBefore() != "") {
                        snippet += ", insertBefore: \"" + Umbraco.Utils.htmlEncode(this.insertBefore()) + "\"";
                    }
                    
                    if(this.insertAfter() && this.insertAfter() != "") {
                        snippet += ", insertAfter: \"" + Umbraco.Utils.htmlEncode(this.insertAfter()) + "\"";
                    }
                    
                    if(this.selectedCasingType() && this.selectedCasingType() != "" && this.selectedCasingType() != "Unchanged") {
                        snippet += ", casing: global::Umbraco.Cms.Web.UmbracoRenderItemCaseType." + this.selectedCasingType();
                    }
                    
                    if(this.selectedEncodingType() && this.selectedEncodingType() != "" && this.selectedEncodingType() != "Unchanged") {
                        snippet += ", encoding: global::Umbraco.Cms.Web.UmbracoRenderItemEncodingType." + this.selectedEncodingType();
                    }
                    
                    if(this.convertLineBreaks()) {
                        snippet += ", convertLineBreaks: " + this.convertLineBreaks();
                    }
                    
                    if(this.removeParagraphTags()) {
                        snippet += ", removeParagraphTags: " + this.removeParagraphTags();
                    }
                    
                    snippet += ")";

                    // Insert snippet into current editors code mirror instance
                    window.parent.editor.getCodeMirrorInstance().replaceSelection(snippet);
                    window.parent.editor.getCodeMirrorInstance().focus();
                    
                    // Close the dialog
                    this.cancel(e);
                },
                cancel: function(e) {
                    e.preventDefault();
                    
                    // Close the dialog
                    window.parent.$u.Sys.WindowManager.getInstance().hideModal();
                }
            });

        },

        init: function (o) {

            this._opts = $.extend({}, o);

            var _this = this;

            $.each(this._opts.availableFields, function(idx, itm) {
                _this._editorViewModel.availableFields.push(itm);
            });
            
            $.each(this._opts.availableCasingTypes, function(idx, itm) {
                _this._editorViewModel.availableCasingTypes.push({
                    name: itm,
                    checked: ko.observable(false)
                });
            });
            
            $.each(this._opts.availableEncodingTypes, function(idx, itm) {
                _this._editorViewModel.availableEncodingTypes.push({
                    name: itm,
                    checked: ko.observable(false)
                });
            });

            //apply knockout js bindings
            ko.applyBindings(this._editorViewModel);
            
        }
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.InsertFieldEditor();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
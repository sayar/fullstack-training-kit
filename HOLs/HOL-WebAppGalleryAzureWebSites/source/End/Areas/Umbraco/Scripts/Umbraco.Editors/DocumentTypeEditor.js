/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.DocumentTypeEditor = Base.extend({

        _opts: null,
        _viewModel: null,
            
        constructor: function () {
            
            this._viewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                selectedTemplates: ko.observableArray(),
                defaultTemplate: ko.observable()
            });
            
        },

        init: function (o) {

            var _this = this;
            
            this._opts = o;
            
            if (!this._opts.ajaxUrl) {
                //get the url from the form
                this._opts.ajaxUrl = $("form").attr("action");
            }
                
            //populate the selectedTemplates list
            $(".allowed-templates input[type='checkbox']:checked").each(function() {
                var val = $(this).val();
                var text = $(this).parents("tr").find("label").text();
                _this._viewModel.selectedTemplates.push({ value: val, text: text });
            });
                
            $(".allowed-templates input[type='checkbox']").click(function() {
                var val = $(this).val();
                var templates = _this._viewModel.selectedTemplates();

                // Find object index
                var idx = -1;
                for(var i = 0; i < templates.length; i++) {
                    if(templates[i].value == val) {
                        idx = i;
                        break;
                    }
                }
                    
                // Add or remove item from array
                if($(this).is(":checked")) {
                    if(idx == -1) {
                        var text = $(this).parents("tr").find("label").text();
                        _this._viewModel.selectedTemplates.push({ value: val, text: text });
                        _this._viewModel.selectedTemplates.sort(function (left, right) {
                            return left.value == right.value ? 0 : (left.value < right.value ? -1 : 1);
                        });
                        // If the only template in the list, set as default
                        if(templates.length == 1) {
                            _this._viewModel.defaultTemplate(val);
                        }
                    }
                } else {
                    if(idx > -1) {
                        _this._viewModel.selectedTemplates.splice(idx, 1);
                    }
                }
            });

            //set default template
            this._viewModel.defaultTemplate(this._opts.defaultTemplate);

            //apply knockout js bindings
            ko.applyBindings(this._viewModel);
                
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.DocumentTypeEditor();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
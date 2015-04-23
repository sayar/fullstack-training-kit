/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/BaseViewModel.js" />

Umbraco.System.registerNamespace("Umbraco.UI");

(function ($, Base) {

    // Initializes a new instance of the TreePicker class.
    Umbraco.UI.TreePicker = Base.extend({

        // Private
        _el: null,
        _opts: null,
        _isCreated: false,
        _viewModel: null,

        // Constructor
        constructor: function (el, o) {

            this._el = el;
            
            this._opts = $.extend({
                selectedValue: "",
                selectedText: ""
            }, o);

            this._viewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Always set parent
                selectedValue: ko.observable(),
                selectedText: ko.observable(),
                chooseLink: function () {
                    
                    var _this = this;
                    
                    // Show tree modal window
                    $u.Sys.WindowManager.getInstance().showModal({
                        id: "treepicker",
                        title: _this.parent._opts.modalTitle,
                        isGlobal: false,
                        forceContentInIFrame: false,
                        content: "#" + _this.parent._el.id + "_tree",
                        modalClass: "tree-picker",
                        removeOnHide: false
                    });

                    // Initialize the tree
                    if (!_this.parent._isCreated) {
                        $("#" + _this.parent._el.id + "_tree").umbracoTreeApi().createJsTree();
                        _this.parent._isCreated = true;
                    }
                    
                },
                deleteLink: function(){
                    this.selectedValue("");
                    this.selectedText("");
                }
            });

            //knockout js view model for managing the tree picker value
            this._viewModel.selectedValue(this._opts.selectedValue);
            this._viewModel.selectedText(unescape(this._opts.selectedText));

            //knockout js apply bindings, scoped to the current tree picker
            ko.applyBindings(this._viewModel, el);
        },

        // Public
        nodeClickHandler: function (e, data) {
            
            // Set the value
            this._viewModel.selectedValue(data.metaData.jsonId.rawValue);

            // Set the title
            this._viewModel.selectedText($.trim($(data.node[0]).find("> a > span").text()));
        }

    }, { // Static members

        // Helper method to execute namespaced method from string
        _executeFunctionByName: function (functionName, context /*, args */) {

            var args = Array.prototype.slice.call(arguments).splice(2);
            var namespaces = functionName.split(".");
            var func = namespaces.pop();
            for (var i = 0; i < namespaces.length; i++) {
                context = context[namespaces[i]];
            }

            return context[func].apply(this, args);
        },

        nodeClickHandler: function (e, data) {

            // Close the tree picker
            $u.Sys.WindowManager.getInstance().hideModal({
                id: "treepicker",
                isGlobal: false
            });

            // Send to relevant tree picker
            $("#" + data.metaData.TreePickerId).treePickerApi().nodeClickHandler(e, data);
            
            // Call callback
            if (data.metaData.OnNodeClickCallback) {
                this._executeFunctionByName(data.metaData.OnNodeClickCallback, window, e, data);
            }
        }

    });

    //jquery plugin
    $.fn.treePicker = function (o) {

        var _opts = $.extend({
            inputField: $(this)
        }, o);

        return $(this).each(function () {
            var treePicker = new Umbraco.UI.TreePicker(this, _opts);
            $(this).data("api", treePicker);
        });
    };

    //jquery api plugin 
    $.fn.treePickerApi = function () {

        //ensure there's only 1
        if ($(this).length != 1) {
            throw "Requesting the API can only match one element";
        }

        //ensure thsi is a collapse panel
        if ($(this).data("api") == null) {
            throw "The matching element had not been bound to a treePicker";
        }

        return $(this).data("api");
    };

})(jQuery, base2.Base);
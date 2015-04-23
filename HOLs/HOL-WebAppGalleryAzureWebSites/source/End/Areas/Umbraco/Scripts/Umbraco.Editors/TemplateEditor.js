/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.Editors/ScriptEditor.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($) {

    // Editor class
    Umbraco.Editors.TemplateEditor = Umbraco.Editors.ScriptEditor.extend({
             
        // Constructor
        constructor: function () {
            
            this.base();
            
            this._viewModel = $.extend(this._viewModel, {
                parent: this, // Always set parent
                availableTemplates: ko.observableArray([]),
                currentLayout: ko.observable(),
                onSaveSuccess: function (e) {
            
                    if (e.path) {

                        //we can't be sure a template hasn't moved, so we can't just sync the tree to the path because the node has the same id
                        //first we have to check whether it has moved, and if it has remove the node with the node id and then resync the whole path

                        var path = e.path[0]; // Paths are multidementional, however templates can have only one parent, so get first path returned.
                        
                        var tree = $u.Sys.ApiMgr.getMainTree();
                        var lastNodeId = new $u.Sys.HiveId(path[path.length-1]);
                        var $lastNode = tree.getJsTree().get_container().find("#" + lastNodeId.htmlId());
                        
                        var targetPathString = ",";
                        for (var i = 0; i < path.length; i++) {
                            var nodeId = new $u.Sys.HiveId(path[i]);
                            targetPathString += nodeId.htmlId() + ",";
                        }

                        var actualPathString = "," + lastNodeId.htmlId() + ",";
                        var ancestors = $lastNode.parents("li");
                        for (var j = 0; j < ancestors.length; j++) {
                            var anchestor = $(ancestors[j]);
                            if(anchestor.hasClass("tree-root")) break;
                            actualPathString = "," + anchestor.attr("id") + actualPathString;
                        }

                        if(targetPathString != actualPathString) {
                            tree.removeNode($lastNode, true);
                        }
                    }
                }
            });
        },
            
        // Public
        init: function(o){

            _this = this;

            this._viewModel.availableTemplates(o.availableTemplates);
            this._viewModel.currentLayout(o.currentLayout);
            this._viewModel.currentLayout.subscribe(function(newValue) {
                var content = _this.getCodeMirrorInstance().getValue();
                var layoutDefRegex = new RegExp("(@{[\\s\\S]*?Layout\\s*?=\\s*?\")[^\"]*?(\";[\\s\\S]*?})", "gi");
                if(newValue != undefined && newValue != "") {
                    if (layoutDefRegex.test(content)) {
                        // Declaration exists, so just update it
                        content = content.replace(layoutDefRegex, "$1" + newValue + "$2");
                    } else {
                        // Declaration doesn't exist, so prepend to start of doc
                        //TODO: Maybe insert at the cursor position, rather than just at the top of the doc?
                        content = "@{\n\tLayout = \"" + newValue + "\";\n}\n" + content;
                    }
                } else {
                    if (layoutDefRegex.test(content)) {
                        // Declaration exists, so just update it
                        content = content.replace(layoutDefRegex, "$1$2");
                    }
                }
                _this.getCodeMirrorInstance().setValue(content);
            });
            
            // Toolbar buttons
            $("#submit_InsertField").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Insert an umbraco page field",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.insertFieldUrl,
                    modalClass: "insert-field",
                    removeOnHide: false
                });
                
            });
            
            $("#submit_InsertPartial").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Insert a Partial View",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.insertPartialUrl,
                    modalClass: "define-section",
                    removeOnHide: false
                });
                
            });
            
            $("#submit_InsertMacro").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Insert a Macro",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.insertMacroUrl,
                    modalClass: "insert-field",
                    removeOnHide: false
                });
                
            });
            
            $("#submit_DefineSection").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Define a Section",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.defineSectionUrl,
                    modalClass: "define-section",
                    removeOnHide: false
                });
                
            });

            $("#submit_ImplementSection").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "Implement a Section",
                    isGlobal: false,
                    forceContentInIFrame: true,
                    contentUrl: o.implementSectionUrl,
                    modalClass: "implement-section",
                    removeOnHide: false
                });
                
            });

            $("#select_Layout").attr("data-bind", "options: availableTemplates, optionsValue: 'value', optionsText: 'text', optionsCaption: '-- Master Template --', value: currentLayout");            
            
            // Call base constructor
            this.base(o);
        }
            
    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.TemplateEditor();
            return this._instance;
        }
        
    });

})(jQuery);
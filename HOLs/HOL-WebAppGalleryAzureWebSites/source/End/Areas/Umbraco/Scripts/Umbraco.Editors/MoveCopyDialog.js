/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.MoveCopyDialog = Base.extend({
        
        _opts: null,

        _dialogViewModel: null,
            
        constructor: function () {

            var _this = this;

            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Allways set
                hasSelectedNode: ko.observable(false),
                msgText: ko.observable(""),
                selectedItemId: null,
                success: ko.observable(false),
                toId: ko.observable(null),
                relateToOriginal: ko.observable(false),
                save: function(e) {
                    e.preventDefault();
                    var _this = this;
                    var data = ko.toJSON(_this);
                    $("#submit_Save").hide().parent().append("<div class='progress-spinner'/>");
                    $.post(_this.parent._opts.ajaxUrl, data, function(e) {
                        $("#submit_Save").show().parent().find(".progress-spinner").remove();
                        //check result for errors and use our custom validator
                        if (Umbraco.System.ValidationHelper.validateJsonResponse(e, "CustomDataValidationRule")) {
                            $(".validation-summary").validationSummaryApi().hideSummary();
                            _this.success(e.success);
                            _this.msgText(e.msg);
                            Umbraco.System.NotificationManager.getInstance().showNotifications(e.notifications);
                            //sync the tree
                            if (e.path) {
                                if (e.operation && e.operation == "move") {
                                    //when its a move operation, we can't just sync the tree to the path because the node has the same id
                                    //first we have to remove the node with the node id and then resync the whole path
                                    var tree = $u.Sys.ApiMgr.getMainTree();
                                    var nodeId = new $u.Sys.HiveId(e.path[0][e.path[0].length - 1]);
                                    var $node = tree.getJsTree().get_container().find("#" + nodeId.htmlId());
                                    tree.removeNode($node, true);
                                    //now we can sync...
                                }
                                $u.Sys.ApiMgr.getMainTree().syncNode(e.path[0]);
                            }
                        }
                    });
                }
            });
        },

        nodeClickHandler: function(e, args) {
            ///<summary>Handles the tree node click</summary>

            var hiveId = new $u.Sys.HiveId(args.node.data("jsonId"));
            var id = hiveId.rawValue();

            var _this = Umbraco.Editors.MoveCopyDialog.getInstance(); // Have to fetch instance, as nodeClickHandler is called in context of tree node

            //set the view model properties
            _this._dialogViewModel.toId(id);
            _this._dialogViewModel.hasSelectedNode(true);
            _this._dialogViewModel.msgText("'" + args.node.find("span:first").text() + "' has been selected as the root of your new content, click 'Save'.");
        },

        init: function(o) {

            this._opts = o;

            //init the view model properties
            this._dialogViewModel.msgText("No node selected yet, please select a node in the list above before clicking 'ok'");
            this._dialogViewModel.selectedItemId = this._opts.selectedItemId;

            //manually add ko-bindings to the form elements
            $("#submit_Save").attr("data-bind", "click: save, visible: !success()");

            //enabled the standard validation engine
            $.validator.unobtrusive.reParse($("form"));

            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel);
        }

    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.MoveCopyDialog();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
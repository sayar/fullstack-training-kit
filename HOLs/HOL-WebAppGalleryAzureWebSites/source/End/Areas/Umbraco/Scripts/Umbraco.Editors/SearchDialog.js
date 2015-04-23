/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.SearchDialog = Base.extend({

        _opts: null,

        _dialogViewModel: null,

        constructor: function() {

            this._dialogViewModel = $.extend({}, Umbraco.System.BaseViewModel, {
                parent: this, // Always set
                searchTerm: ko.observable(""),
                results: ko.observableArray([]),
                doSearch: function() {
                    var _this = this;
                    if (!_this.parent._opts.ajaxUrl || !_this.parent._opts.treeId) throw "Both the ajaxUrl and treeId must be specified as options for the SearchDialog";
                    var data = "{ 'searchText':'" + _this.searchTerm() + "', 'treeId':'" + _this.parent._opts.treeId + "' }";
                    $.post(_this.parent._opts.ajaxUrl, data, function(e) {
                        //clear the items
                        _this.results.removeAll();
                        for (var i in e) {
                            _this.results.push({ title: e[i].Title, id: e[i].Id, description: e[i].Description, gotoItem: _this.gotoItem });
                        }
                    });
                },
                gotoItem: function(e) {
                    var treeApi = $u.Sys.ApiMgr.getMainTree();
                    var id = $(e.target).closest("a").attr("data-id");
                    treeApi.syncTree(id, this.parent._opts.treeId, true);
                }
            });

        },

        init: function(o) {

            this._opts = o;

            this._dialogViewModel.searchTerm(this._opts.inputField.val());

            //apply knockout js bindings
            ko.applyBindings(this._dialogViewModel);

            this._opts.inputField.watermark('Type to search...');

            //run the search if there's a search term
            if (this._dialogViewModel.searchTerm() != "") {
                this._dialogViewModel.doSearch();
            }
        }

    }, {

        _instance: null,
        
        // Singleton accessor
        getInstance: function() {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.SearchDialog();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
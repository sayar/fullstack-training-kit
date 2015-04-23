/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {
    
    Umbraco.Editors.SearchBox = Base.extend({

        _opts: null,
        _currTreeId: null,
            
        constructor: function (o) {

            this._opts = $.extend({
                inputField: null,
                searchAjaxUrl: null,
                treeElementId: null,
                searchUrl: null,
                windowMgr: null
            }, o);

            var _this = this;
            
            //setup the autocomplete
            var acOptions = {
                minLength: 2,
                delay: 2,
                source: function(request, response) {
                    //make our ajax call
                    var data = "{ 'searchText':'" + request.term + "', 'treeId':'" + _this._currTreeId + "' }";
                    $.post(_this._opts.searchAjaxUrl, data, function(e) {
                             var obj = [];
                             for(var i in e) {
                                obj.push({ label: e[i].Title, value: e[i].Id });
                             }
                             response(obj);
                        });                
                },
                select: function(event, ui) {
                    event.preventDefault();                
                    var id = ui.item.value;
                    //sync the tree with the selected id and open it's editor
                    var treeApi = $("#" + _this._opts.treeElementId).umbracoTreeApi();
                    treeApi.syncTree(id, _this._currTreeId, true);
                }
            };

            this._opts.inputField.autocomplete(acOptions);
            
            this._opts.inputField.watermark('Type to search...');
            
            //handle enter key
            this._opts.inputField.keypress(function(e) {
                if(e.keyCode == 13) {
                    _this.search(_opts.inputField.val());
                }
            });
            
        },

        setTreeId: function(id) {
            ///<summary>Before searching, the tree ID must be set so the system knows which data to search</summary>
            this._currTreeId = id;
        },
            
        search: function(text) {
            //<summary>Shows the search results in the editor panel</summary>
                
            //close the autocomplete box
            this._opts.inputField.autocomplete("close");

            //show the search result template
            var fullUrl = this._opts.searchUrl + "?searchTerm=" + text + "&treeId=" + this._currTreeId;
            this._opts.windowMgr.contentFrame(fullUrl);
        }

    });

    //jquery plugin
    $.fn.umbracoSearchBox = function(o) {
        var _opts = $.extend({
                inputField: $(this)
            }, o);
        return $(this).each(function() {
            var searchBox = new Umbraco.Editors.SearchBox(_opts);
            $(this).data("api", searchBox);
        });
    };

    //jquery api plugin 
    $.fn.umbracoSearchBoxApi = function() {
        //ensure there's only 1
        if ($(this).length != 1) {
            throw "Requesting the API can only match one element";
        }
        //ensure thsi is a collapse panel
        if ($(this).data("api") == null) {
            throw "The matching element had not been bound to an umbracoSearchBox";
        }
        return $(this).data("api");
    };

})(jQuery, base2.Base);
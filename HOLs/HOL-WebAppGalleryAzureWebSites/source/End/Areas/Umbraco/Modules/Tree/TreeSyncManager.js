/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/jQuery/jquery.cookies.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/QueryStrings.js" />

Umbraco.System.registerNamespace("Umbraco.Controls");

(function ($, Base) {

    Umbraco.Controls.TreeSyncManager = Base.extend({
        ///<summary>Ensures that tree nodes are synced</summary>

        _getPathIdFromQueryString: function() {
            ///<summary>gets the 'path' id from the query string if there is one</summary>
            return Umbraco.System.QueryStringHelper.getQueryStringValue("path");
        },

        _removeNotification: function() {
            ///<summary>removes the cookie for the id</summary>
            var id = this._getPathIdFromQueryString();
            if (id != null) {
                $.cookies.del(id);
            }
        },

        getPath: function(pathId, deleteCookie) {
            ///<summary>returns the node path in the cookie based on the current 'path' query string id</summary>
            var foundCookies = $.cookies.filter( /^path/ );
            var id = (pathId) ? pathId : this._getPathIdFromQueryString();
            if (id != null) {
                //search the cookies for this id
                for (var name in foundCookies) {
                    if (name == ("path_" + id)) {
                        var val = eval(foundCookies[name]);
                        if(deleteCookie) {
                            $.cookies.del(name);
                        }
                        return val;
                    }
                }
            }
            //if nothing is found then return an empty array
            return [];
        },
        syncTree: function(p) {
            ///<summary>method to sync the tree either based on an id, in which case it will try to find path in a cookie with the specified id, or you can pass in a path as an Array of HiveId objects</summary>
            
            // Get the path from the input param 'p' or from cookie, if 'p' is not a valid path
            var path = null;
            if (!$.isArray(p)) {
                path = this.getPath(p);
                if (path.length == 0) {
                    return;
                }
            }
            else {
                path = p;
            }
            
            // If path is multidimentional array, sync each path
            if (path && (($.isArray(path) && path.length > 0))) {
                for(var i = 0; i < path.length; i++) {
                    if (path[i] && (($.isArray(path[i]) && path[i].length > 0))) {
                        $u.Sys.ApiMgr.getMainTree().syncNode(path[i]);
                    }
                }
            } else if(typeof path == "string") {
                $u.Sys.ApiMgr.getMainTree().syncNode(path);
            }
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Controls.TreeSyncManager();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
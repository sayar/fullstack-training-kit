/// <reference path="/Areas/Umbraco/Scripts/Modernizr/modernizr.js" />

//A plugin used to persist tree applications data so that when navigating between applications in Umbraco, the tree's state is maintained.

(function ($) {

    $.jstree.plugin("applicationpersistence", {

        __init: function () {
            var _this = this;
            this.get_container()
                .bind("load_node.jstree", $.proxy(function (e, data) {
                    //need to check if this node is in our selected nodes list, if so, do the selection
                    var appId = data.inst._getCurrentAppId();
                    if (appId) {
                        var appState = data.inst.getApplicationState(appId);
                        if (appState && appState.selectedNodes) {
                            for (var n in appState.selectedNodes) {
                                data.inst.select_node(data.inst.get_container().find("#" + appState.selectedNodes[n]), true);
                            }
                            //Once tree has loaded, wipe out stored data untill we move away again
                            _this.clearApplicationState(appId);
                        }
                    }
                }))
                .bind("before.jstree", $.proxy(function (e, data) {
                    //before destroying the tree, lets save the data
                    var settings, appId;
                    if (data.func === "destroy") {
                        appId = this._getCurrentAppId();
                        if (appId) {
                            this.saveApplicationState(appId);
                        }
                    }
                    else if (data.func === "load_node" && data.args && data.args.length && data.args.length > 0 && data.args[0] == -1) {
                        //if we're loading the root node, check if we have persisted data for the app id                        
                        settings = this.get_settings();
                        appId = this._getCurrentAppId();
                        if (appId && !settings.json_data.data) {
                            var appState = this.getApplicationState(appId);
                            if (appState && appState.nodeData) {
                                //set the initial 'data' for the json_data plugin
                                settings.json_data.data = appState.nodeData;
                            }
                            this._set_settings(settings);
                        }
                    }
                }, this))
                .bind("init.jstree", $.proxy(function (e, data) {

                }, this));
        },
        defaults: {
        },
        _fn: {
            _getCurrentAppId: function () {
                var settings = this.get_settings();
                if (settings && settings.json_data && settings.json_data.ajax && settings.json_data.ajax.url) {
                    //app id's are the md5 hash of the root ajax data url
                    return MD5(settings.json_data.ajax.url(-1));
                }
                return null;
            },
            clearApplicationState: function (app) {
                var persistenceId = "tree_" + app;
                if (Modernizr.sessionstorage) {
                    sessionStorage.setItem(persistenceId, JSON.stringify({ loaded: true }));
                    // We set a loaded flag rather than just clearing as the UmbracoApplication does a check to see whether
                    // it should display the dashboard or not, so we use this to notify it that it shouldn't and that
                    // the tree has already loaded the correct panel in place.
                }
            },
            getApplicationState: function (app) {
                ///<summary>Gets the data persisted for the app</summary>

                //generate an id for the current app
                var persistenceId = "tree_" + app;
                if (Modernizr.sessionstorage) {
                    var ssItem = sessionStorage.getItem(persistenceId);
                    if (ssItem) {
                        return eval("(" + ssItem + ")");
                    }
                }
                return null;
            },
            saveApplicationState: function (app) {
                ///<summary>Saves the current state of the tree for the specified app so it can be restored. Stores the persisted data, this will check if we hvae a sessionStorage available, otherwise it will use sessvar (window.name) to store the values.</summary>

                if (this.data.core.refreshing) { return; }
                var nodeData = this.get_json(-1, ["id", "class"], ["href"]);

                //for some reason, the data.icon when it is a full path is persisted with double quotes, though this still works fine
                //in chrome, FF and IE have a fit about it
                var checkIcon = function (n) {
                    if (n && n.data && n.data.icon) {
                        //trim start
                        if (n.data.icon.startsWith("\"")) {
                            n.data.icon = n.data.icon.substring(1, n.data.icon.length);
                        }
                        //trime end
                        if (n.data.icon.endsWith("\"")) {
                            n.data.icon = n.data.icon.substring(0, n.data.icon.length - 1);
                        }
                    }
                    //recurse
                    if (n.children) {
                        for (var child in n.children) {
                            checkIcon(n.children[child]);
                        }
                    }
                };
                for (var c in nodeData) {
                    checkIcon(nodeData[c]);
                }
                

                //store the selected node                
                var selected = [];
                this.get_selected().each(function () {
                    selected.push($(this).attr("id"));
                });

                var toPersist = { nodeData: nodeData, selectedNodes: selected };

                //generate an id for the current app
                var persistenceId = "tree_" + app;
                if (Modernizr.sessionstorage) {
                    sessionStorage.setItem(persistenceId, JSON.stringify(toPersist));
                }
            }
        }
    });
})(jQuery);
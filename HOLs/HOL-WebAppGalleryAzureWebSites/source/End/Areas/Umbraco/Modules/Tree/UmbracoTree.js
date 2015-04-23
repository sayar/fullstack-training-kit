/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="../../Scripts/Umbraco.System/UmbracoUtils.js" />
/// <reference path="../../Scripts/Umbraco.System/WindowManager.js" />

Umbraco.System.registerNamespace("Umbraco.Controls");

(function ($, Base) {

    //tree class
    Umbraco.Controls.UmbracoTree = Base.extend({

        //**** internal members: ****
        _opts: null,
        _isJsTreeDestroyed: false,
            
        constructor: function (o) {

            //default options combined with specified options
            this._opts = $.extend({
                    jqueryElem: null,
                    themeFolder: "",
                    jsonUrl: "",
                    isDebug: true,
                    showContext: true
                }, o);
            
        },

        _debug: function(msg, isErr) {
            ///<summary>debugging method</summary>
            window.__debug__(msg, "UmbracoTree", isErr);
        },

        _showThrobber: function($node) {
            ///<summary>
            /// internal methods to force the throbber loader to display/hide for a particular tree node
            /// the code here is what jstree does internally to display the throbber
            /// </summary>
            $node.data("jstree-is-loading", true); //set it's loading flag to true
            $node.children("a").addClass("jstree-loading"); //set the loading styles
        },
            
        _hideThrobber: function($node) {
            $node.data("jstree-is-loading", false); //remove the flag
            $node.children(".jstree-loading").removeClass("jstree-loading"); //remove the loading style
        },

        _getHiveId: function($node) {
            ///<summary>Returns the HiveId object for the current tree node</summary>
            var hiveId = new $u.Sys.HiveId($node.data("jsonId"));
            return hiveId;
        },

        _ensureJqueryLiNode: function($node) {
            ///<summary>helper method to validate a node</summary>
            if (!($node instanceof jQuery)) {
                throw "reloadSingleNode only accepts a jQuery node";
            }
            if ($node.get(0).tagName.toUpperCase() != "LI") {
                throw "reloadSingleNode requires that the jquery element passed in is an 'li' node";
            }
        },

        _findNodeByHiveId: function(hiveId, $treeRoot) {
            ///<summary>
            /// This will first try to find the node based on an exact Id match which is fast, if that fails, 
            /// this uses the jquery each method to search for a node based on the HiveId object,
            /// since this will execute a function for each li node, this is a much slower way of finding
            /// a node, however it is more accurate than matching an exact Id if the serialized HiveId is not 'long form' including
            /// all of the HiveId parts.
            /// </summary>

            var found = $treeRoot.find("#" + hiveId.htmlId());
            if (found.length > 0) return found;

            $treeRoot.find("li").each(function() {
                ///<summary>This will filter the li's until it finds one that matches</summary>
                //if this is the absolute root, ignore trying to match
                if (!$(this).hasClass("root-wrapper")) {
                    if ($(this).data() && $(this).data().jsonId) {
                        var nodeHiveId = new $u.Sys.HiveId($(this).data().jsonId);
                        if (hiveId.equals(nodeHiveId)) {
                            //FOUND!
                            found = $(this);
                            //break out of the each loop
                            return false;
                        }
                    }
                }
            });

            return found;
        },


        //** Properties **
            
        //currentApp: "content",

        //** Methods **
            
        removeNode: function($node, noAnimation) {
            ///<summary>Removes the node element from the tree, this doesn't actually make any ajax calls, simply removes the node from the DOM with the animation</summary>
            ///<param name="nodeElement">The 'li' DOM element or JQuery element to remove</param>

            if (noAnimation) {
                //add metadata to query on event handler
                $node.data("no-animate", noAnimation);
            }
            this.getJsTree().delete_node($node);
        },

        syncNode: function(nodeParam, callback, nodeSelectType) {
            ///<summary>
            /// This will ensure the node is refreshed and visible. If the node already exists in the tree, this will refresh it from the server.
            /// If the node doesn't exist in the tree, then we assume the parameter passed in is a node Path and this will try to open the tree to
            /// the particular node that the path refers to.
            /// If the parameter passed it is neither an actual html li element, nor a Path, we assume it is an Id that already exists in the tree
            /// and will attempt to find it and reload it.
            ///</summary>
            /// <param name="nodeSelectType">
            /// if empty/null then the default is:
            /// - "implicit" = node will be selected if it is not already selected
            /// other options are:
            /// - "explicit" = the node will be selected even if it is already selected (this will force the editor to re-load too)
            /// - "none" = the node will not be selected
            /// </param>
                
            var _this = this;
            var $jsTree = _this.getJsTree();

            //NOTE: this would be better if we could figure out the 'current' tree root (i.e. settings app has many tree roots), however its not always possible so we are going on the assumption that any tree node id is completely unique no matter what.
            var $treeRoot = $jsTree.get_container().find("li:first");

            //we'll support passing in either a jquery node, a path or an id and we'll look it up. 
            //if its not a jquery node, then we'll see if we can find it with a path or id
            if (!(nodeParam instanceof jQuery)) {
                if (!$.isArray(nodeParam)) {
                    var nodeId = Umbraco.Utils.urlDecode(nodeParam);
                    nodeParam = $treeRoot.find("#" + nodeId);
                    if (!nodeParam || nodeParam.length == 0) {
                        _this._debug("Could not find a tree node with id " + nodeId, true);
                        return;
                    }
                    else if (nodeParam.length > 1) {
                        _this._debug("More than one tree node was found with id " + nodeId, true);
                        return;
                    }
                    this.reloadSingleNode(nodeParam, callback);
                }
                else {
                    //so we'll assume its a path which means we have to look some things up
                    var paths = new Array();
                    for (var i in nodeParam) {
                        paths.push(new $u.Sys.HiveId(nodeParam[i]));
                    }
                    //loop through the paths until we find the last one that exists
                    var deepestNode = $treeRoot;
//                    for(var p = 0; p < paths.length; p++) {
//                        var found = _this._findNodeByHiveId(paths[p], deepestNode);
//                        if(found.length == 1) {
//                            deepestNode = found;
//                            break;
//                        }
//                    }
                    
                    for(var p = paths.length - 1; p >= 0; p--) {
                        var found = _this._findNodeByHiveId(paths[p], deepestNode);
                        if(found.length == 1) {
                            deepestNode = found;
                            break;
                        }
                    }

                    if (deepestNode.hasClass('root-wrapper')) {
                        _this._debug("Could not sync tree, deepest node found is the root wrapper", true);
                        return;
                    }
                    var deepestNodeId = new $u.Sys.HiveId(_this.getNodeMetaData(deepestNode).jsonId);
                    //if the deepest loaded node is actually the node we're looking for, then just reload it
                    if (deepestNodeId.equals(paths[paths.length - 1])) {
                        this.reloadSingleNode(deepestNode, callback);
                    }
                    else {
                        //if the deepest node is actually a 'root-wrapper' node this means that its a tree that has multiple roots nodes
                        //such as the settings application which has many root nodes, if the deepest node found is the absolute root (root-wrapper)
                        //then we cannot sync the tree
                        if (deepestNode.hasClass('root-wrapper')) {
                            _this._debug("Could not sync tree, deepest node found is the root wrapper", true);
                            return;
                        }
                        
                        //ok, now that we have found the deepest node in the path that is currently loaded, we need to start loading them in
                        var cb = function($e) {
                            $jsTree.open_node($e, false); //open the node after its reloaded
                            //find the original stored path for the current node id and the index of the item in the paths array
                            var currPathIndex = -1;
                            var currPath = $.grep(paths, function(h, i) {
                                var nodeHiveId = new $u.Sys.HiveId(_this.getNodeMetaData($e).jsonId);
                                if (h.equals(nodeHiveId)) {
                                    currPathIndex = i;
                                    return true;
                                }
                                return false;
                            });
                            if (currPath.length == 0) {
                                _this._debug("Could not find reloaded node id in original paths", true);
                                return;
                            }
                            if (currPathIndex == -1) {
                                _this._debug("Could not sync tree with path: " + nodeParam, true);
                                return;
                            }
                            //check if the next part of the path exists in the children
                            var nextPath = paths[currPathIndex + 1];
                            var $found = _this._findNodeByHiveId(nextPath, $e);
                            if ($found.length == 0) {
                                _this._debug("Could not sync tree with path: " + nodeParam, true);
                                return;
                            }
                            if ($found && $.inArray(nextPath, paths) == (paths.length - 1)) {
                                //FOUND!
                                if (!nodeSelectType || nodeSelectType == "implicit") { 
                                    //check if it is already selected
                                    if (!$jsTree.is_selected($found)) {
                                        //we need to add some temp metadata to this node to let the select_node event handler
                                        //to first check if the content frame is already set to the requested URL.
                                        $found.data("nodeSelectType", "implicit");
                                        $jsTree.select_node($found, true);
                                    }                                        
                                }
                                else if (nodeSelectType == "explicit") {
                                    $jsTree.select_node($found, true);
                                }
                                return;
                            }
                            this.reloadChildren(found, callback);
                        };

                        this.reloadChildren(deepestNode, cb);
                    }
                }
            }
            else {
                this.reloadSingleNode(nodeParam, callback);
            }

        },

        reloadChildren: function($node, callback) {
            /// <summary>Reloads the children of a node and calls the callback on complete. Note, this is similar to the built in js tree refresh method but provides a call back and some better UI handling</summary>

            this._ensureJqueryLiNode($node);

            var $jsTree = this.getJsTree();

            this._showThrobber($node);
            //we need to add the callback to this node's data object since the only way to know when it is complete is listen for the event handler to execute which we listen to on js tree initialization.
            //in the event handler, we'll check if this data has been set and call the method. Once called, we'll remove the data.
            $node.data("reloadCallback", callback);
            $jsTree.deselect_all();
            $jsTree.refresh($node);
        },

        reloadSingleNode: function($node, callback, nodeSelectType) {
            /// <summary>Reloads a single node with the latest server data</summary>
            /// <param name="nodeSelectType">
            /// if empty/null then the default is:
            /// - "implicit" = node will be selected if it is not already selected
            /// other options are:
            /// - "explicit" = the node will be selected even if it is already selected (this will force the editor to re-load too)
            /// - "none" = the node will not be selected
            /// </param>
                
            this._ensureJqueryLiNode($node);

            var _this = this;
            var $jsTree = _this.getJsTree();

            //if its a root node, just reload the children normally
            if ($node.hasClass("tree-root")) {
                //we need to add the callback to this node's data object since the only way to know when it is complete is listen for the event handler to execute which we listen to on js tree initialization.
                //in the event handler, we'll check if this data has been set and call the method. Once called, we'll remove the data.
                $node.data("reloadCallback", callback);
                $jsTree.refresh($node);
                return;
            }

            //get the parent node of this node
            var $parent = $jsTree._get_parent($node);

            if ($parent == -1) {
                //if we've made it this far, we'll have to reload the whole tree
                $jsTree.refresh(-1);
                return;
            }

            if ($parent) {
                //get it's json url
                var dataUrl = _this.getDataUrl($parent);
                //check if the node was previously opened
                var isOpened = $node.hasClass("jstree-open");
                //check if its selected
                var isSelected = $node.children("a").hasClass("jstree-clicked");
                //close the branch
                $jsTree.close_node($node, true);

                _this._showThrobber($node);

                //make an ajax call to get it's data
                $.getJSON(dataUrl + "?id" + _this._getHiveId($parent).rawValue(), { "noCache": Math.random() },
                    function(msg) {
                        //on success, use jsTree's data plugin parser to parse the json into a jquery ul object
                        var $treeFromResult = $jsTree._parse_json(msg);
                        if (!$treeFromResult) {
                            throw "Could not parse json when syncing node: " + _this._getHiveId($node).rawValue();
                        }
                        //find our current li node object in the result
                        var $newNode = $treeFromResult.find("[id='" + $node.attr("id") +"']");
                        if ($newNode.length > 0) {

                            _this._hideThrobber($node);

                            //now replace the original node with our new one
                            $node.replaceWith($newNode);
                            $jsTree.clean_node($newNode);

                            //reopen the children if required
                            if (isOpened) {
                                $jsTree.open_node($newNode);
                            }
                            //reselect if required
                            if (isSelected) {
                                if (!nodeSelectType || nodeSelectType == "implicit") {
                                    $newNode.children("a:first").addClass("jstree-clicked");    
                                }
                                else if (nodeSelectType == "explicit") {
                                    $jsTree.select_node($newNode, true);    
                                }
                            }

                            if ($.isFunction(callback)) {
                                callback.apply(_this, [$newNode]);
                            }

                        }
                    });
            }
        },

        getJsTree: function() {
            /// <summary>Returns an instance of the jstree object</summary>
            return $.jstree._reference(this._opts.jqueryElem);
        },

        getDataUrl: function($node) {
            /// <summary>Creates the JSON URL based on the node requested</summary>
            if ($node != -1) {
                return this.getNodeMetaData($node).jsonUrl;
            }
            else {
                return this._opts.jsonUrl;
            }
        },

        getNodeMetaData: function($node) {
            /// <summary>Returns the meta data stored with the node</summary>

            return $node.data();
        },

        loadApp: function(srcUrl, callback) {
            /// <summary>Loads the tree for the specified app</summary>

            this._debug("loadApp: " + srcUrl);

            //load in the new tree with the new src url
            var jsTree = this.getJsTree();               
                
            //kill the tree
            if (jsTree) jsTree.destroy();

            //set the json url to the new one
            this._opts.jsonUrl = Umbraco.Utils.urlDecode(srcUrl);
               
            this.createJsTree(callback);                
        },

        getPluginNames: function() {
            ///<summary>Returns an array of strings of plugin names to load</summary>
            if (this._opts.showContext) {
                return ["themes", "json_data", "ui", "umbracocontextmenu", "umbraconodeformatter", "applicationpersistence"];                    
            }
            else {
                return ["themes", "json_data", "ui", "umbraconodeformatter"];
            }
        },

        onNodeSelected: function(event, $node, nodeSelectType) {
            ///<summary>Called when a node is clicked </summary>

            event.preventDefault();
            event.stopPropagation();

            //get the editor path from meta data
            var metaData = this.getNodeMetaData($node);
            var editorPath = metaData.editorPath;
            if (editorPath) {
                //check if it's a JS call, or a URL
                if (editorPath.startsWith("/") || editorPath.startsWith("http:") || editorPath.startsWith("https:")) {
   
                    
                    //if the nodeSelectType is 'implicit' which currently will only be the case when syncing a node
                    //then we need to check if the current content url is the same as the one being requested, if so
                    //then we just ignore.
                    if (nodeSelectType == "implicit") {                       
                        // (APN 22 Dec 2011) The following code used to also check:
                        // || $(Umbraco.System.WindowManager.getInstance().contentFrame()).data("url") == editorPath
                        // however $(Umbraco.System.WindowManager.getInstance().contentFrame()).data("url") was returning undefined after a page refresh (in Chrome and FF)
                        
                        if (Umbraco.System.WindowManager.getInstance().contentFrame().location.pathname == editorPath) {
                            return;
                        }
                    }
                    
                    Umbraco.System.WindowManager.getInstance().contentFrame(editorPath);

                    //raise an event!
                    var args = { node: $node, url: editorPath };
                    $(this).trigger("nodeClicked.umbracoTree", [args]);
                }
                else {
                    //if its a method, then call it
                    var hasError = false;
                    var f = null;
                    try {
                        f = eval(editorPath);
                    }
                    catch(err) {
                        hasError = true;
                    }
                    if ($.isFunction(f)) {
                        f.apply(this, [event, { node: $node, metaData: metaData }]);

                        //raise an event!
                        var args = { node: $node, method: f };
                        $(this).trigger("nodeClicked.umbracoTree", [args]);
                    }
                    else {
                        hasError = true;
                    }
                    if (hasError) throw "The 'editorPath' (" + editorPath + ") specified for the node is not a URL/Path and is not a JS method";
                }
            }
        },

        init: function(manuallyCreate) {
            /// <summary>Initializes this instance of the tree, should only be called once</summary>                               

            var _this = this;
            //store a reference to this api
            this._opts.jqueryElem.data("api", _this);
            //set the id of the element if there isn't one
            if (!this._opts.jqueryElem.attr("id")) this._opts.jqueryElem.attr("id", "UmbTree_" + Umbraco.Utils.generateRandom());

            this._debug("Initializing id: " + this._opts.jqueryElem.attr("id"));

            //set jsTree theme folder
            $.jstree._themes = this._opts.themeFolder;

            if (!manuallyCreate) {
                this.createJsTree();
            }

        },

        destroy: function() {
            /// <summary>Removes jsTree instance and this class from memory</summary>
            if (!this._isJsTreeDestroyed) {
                this._isJsTreeDestroyed = true;
                this.getJsTree().destroy();
            }
        },

        createJsTree: function(cb) {
            /// <summary>Creates/Recreates the jsTree instance and binds all of the jstree events to listeners.</summary>

            this._debug("createJsTree");

            var _this = this;
                
            //setup the jstree event bindings:
            this._opts.jqueryElem
                .bind("select_node.jstree", function(event, data) {
                    //when a node is selected call the onNodeSelected method
                    //first, need to see if there's nodeSelectType metadata on the node being checked
                    var nodeSelectType = data.rslt.obj.data("nodeSelectType");             
                    data.rslt.obj.removeData("nodeSelectType");
                    _this.onNodeSelected.apply(_this, [event, data.rslt.obj, nodeSelectType]);
                })
                .bind("refresh.jstree", function(event, data) {
                    //check the data on the node for a callback, if its there call it
                    if (data && data.args 
                        && data.args.length 
                            && data.args.length > 0 
                                && data.args[0].data
                                    && $.isFunction(data.args[0].data("reloadCallback"))) {
                        var callback = data.args[0].data("reloadCallback");
                        data.args[0].removeData("reloadCallback");
                        callback.apply(_this, [data.args[0]]);
                    }
                })
                .bind("destroy.jstree", function(event, data) {
                    _this.isJsTreeDestroyed = true;
                })
                .bind("loaded.jstree", function(event, data) {      
                    //if there was a callback specified for the createJsTree method, use it here and remove it
                    if (cb) {
                        var callback = cb;
                        cb = null;
                        delete cb;
                        callback.apply(_this, [data]);
                    }                        
                    //raise our own appLoaded event as this will only fire on the initial load (when a full app is loaded)
                    $(_this).trigger("appLoaded.umbracoTree", data);
                })
                .bind("save_opened.jstree", function(e, d) {
                    ///<summary>
                    /// Ok, this is a strange one, by default js tree will save all opened nodes on refresh of the root which means that if you had 
                    /// a deep set of nodes open that it would recursively make ajax calls to re-open them... though that might seem nice, not
                    /// sure if we really want it. So, for now we will listen for the save_opened event and clear all the save opened data.
                    /// if we want to re-enable that functionality, just remove this.
                    /// </summary>
                    _this.getJsTree().data.core.to_open = [];
                })
                .bind("click.jstree", function(event, data) {

                })
                .bind("delete_node.jstree", function(e, data) {
                    //check if the metadata to disable animation is found
                    if (data && data.args && data.args.length && data.args.length > 0 && data.args[0].data("no-animate")) {
                        //remove the metadata and return (don't animate)
                        data.args[0].removeData("no-animate");
                        return;
                    }
                    var root = data.rslt.prev.closest("li.tree-root");
                    root.find("li.recycle-bin").effect("highlight", { }, 3000);

                })
                .bind("load_node.jstree", function(e, data) {
                    //check if its the root node (always must be -1), if so, we need to load the child nodes. 
                    //this occurs when an app tree is the only tree rendered (i.e. content app) and since we're hiding the 
                    //arrow icon on the first node, we need to load it's children automatically.
                    if (data.rslt.obj == -1) {
                        data.inst.open_node(data.inst.get_container().find("li:first"), false, true);
                    }
                });
                
            //the jstree config options:
            var treeSetup = {
                "core": {
                    "animation": 0,
                    html_titles: true
                },
                "ui" : {
                  "select_prev_on_delete": false  
                },
                "plugins": this.getPluginNames(),
                "themes": {
                    "theme": "umbraco",
                    "dots": false
                },
                "json_data": {
                    // All the options are the same as jQuery's except for `data` which CAN (not should) be a function
                    //"progressive_render": true, //this is a nice feature but doesn't work with many things!
                    "ajax": {
                        success: function(d, t, x) {
                            //console.log(d);
                        },
                        error: function(x, t, e) {
                            if (t != "success") {
                                //first check if auth has timed out
                                if ($u.Sys.ApiMgr.getApp().handleAuthTimeout(x, t, e, true)) {
                                    //do nothing here
                                }
                                //then check errors
                                else if (x.status.toString().startsWith("500")) {
                                    $u.Sys.ApiMgr.getApp().handleAjaxException(x, t, e);
                                }                                
                            }
                        },
                            // the URL to fetch the data
                        "url": function(n) { return _this.getDataUrl.apply(_this, [n]); },
                        "contentType": "application/json; charset=utf-8",
                        "dataType": "json"
                    }
                }
            };
                
            //create the js tree with our config options
            this._opts.jqueryElem.jstree(treeSetup);
        }
    });

    //jquery extension
    $.fn.umbracoTree = function(opts, manualInit) {
        /// <summary>jQuery extension to create the umbraco tree</summary>

        return this.each(function() {
            var _tree = new Umbraco.Controls.UmbracoTree($.extend({ jqueryElem: $(this) }, opts));
            _tree.init(manualInit);
        });
    };

    $.fn.umbracoTreeApi = function() {
        /// <summary>exposes the Umbraco Tree api for the selected object</summary>
        if ($(this).length != 1) {
            throw "UmbracoTreeAPI selector requires that there be exactly one control selected, this selector returns " + $(this).length;
        };
        return $(this).data("api");     
    };

})(jQuery, base2.Base);    

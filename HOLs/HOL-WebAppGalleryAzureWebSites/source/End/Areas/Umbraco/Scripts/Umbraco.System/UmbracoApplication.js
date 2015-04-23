/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {

    $.fn.umbracoApplication = function(o) {
        return $(this).each(function() {
            var app = new Umbraco.System.UmbracoApplication(o);
            $(this).data("api", app);
        });
    };

    $.fn.umbracoApplicationApi = function() {
        //ensure there's only 1
        if ($(this).length != 1) {
            throw "Requesting the API can only match one element";
        }
        //ensure thsi is a collapse panel
        if ($(this).data("api") == null) {
            throw "The matching element had not been bound to an umbracoApplication";
        }
        return $(this).data("api");
    };

    Umbraco.System.UmbracoApplication = Base.extend({
        ///<summary>Initializes all of the back-office application, wires up the events between required clases and exposes an API to switch apps</summary>

        _opts: null,
        _searchInput: null,
        _searchBoxApi: null,
            
        constructor: function (o) {

            var _this = this;
            
            //default options combined with specified options
            this._opts = $.extend({
                    startupDashboard: "content",
                    mainTree: null,
                    contentFrame: null,
                    historyMgr: null,
                    windowMgr: null,
                    searchBox: $("#searchBox"),
                    appTrayUrl: "",
                    loginUrl: ""
                }, o);
            
            this._searchInput = this._opts.searchBox.find("input");
            this._searchBoxApi = this._searchInput.umbracoSearchBoxApi();
            
            //Ensure that our session storage is cleared when refreshing or starting up
            //this is required for our tree persistence since refreshes may not clear the session cache.
            var toRemove = [];
            for (var i = 0, len = sessionStorage.length; i < len; i++) {
                var key = sessionStorage.key(i).toString();
                if (key.startsWith("tree_")) {
                    toRemove.push(key);                
                }
            }
            for(var t in toRemove) {
                sessionStorage.removeItem(toRemove[t]);
            }
            
            //wire up the load event of the iframe and fade in the editor
            this._opts.contentFrame.load(function() {
                _this._opts.editorContainer.show();
            });

            //wire up history mgr events
            $(this._opts.historyMgr).bind("navigating.historyManager", function(sender, e) {
                _this.switchApp(e);
                //reset the search box
                _this._searchInput.val("");
            });

            //if there's already a deep link specified, this will navigate there
            if (!this._opts.historyMgr.navigateToCurrent()) {
                //if no deep link, then lets manually build the tree and load the dashboard
                _this._opts.mainTree.createJsTree();
                _this.loadDashboard(_this._opts.startupDashboard);
            }

            //wire up the tree node click to tell the search box which data to search
            $(this._opts.mainTree).bind("nodeClicked.umbracoTree", function(e, args) {
                var $treeRootNode = args.node.closest(".tree-root");
                _this._toggleSearchBox($treeRootNode, this);
            });

            //wire up the tree loaded event to show/hide the search box based on number of trees
            $(this._opts.mainTree).bind("appLoaded.umbracoTree", function(e, args) {
                _this._toggleSearchBox(this.getJsTree().get_container().find("li.tree-root"), this);
            });
            
            //wire up the about button
            $("button.about").click(function(e) {
                e.preventDefault();
                
                // Show tree modal window
                $u.Sys.WindowManager.getInstance().showModal({
                    title: "About",
                    isGlobal: false,
                    forceContentInIFrame: false,
                    content: "#about",
                    modalClass: "about",
                    removeOnHide: false
                });
                
            });
        },

        //shows/hides the search box based on if there is more than 2 nodes passed in (an app has loaded), or
        //if the tree actually supports searching
        _toggleSearchBox: function($rootNodes, umbracoTree) {
            if ($rootNodes.length != 1) {
                this._searchInput.fadeOut(200);
            }
            else {
                var metaData = umbracoTree.getNodeMetaData($rootNodes);
                if (metaData && metaData.treeId && metaData.searchable && metaData.searchable == "true") {
                    this._searchInput.fadeIn(200);
                    this._searchBoxApi.setTreeId(metaData.treeId);
                }
                else {
                    this._searchInput.fadeOut(200);
                    this._searchBoxApi.setTreeId(null);
                }
            }
        },

        refreshAppTray: function() {
            var _this = this;
            ///<summary>Reloads the application tray</summary>
            
            $.get(_this._opts.appTrayUrl, function(data) {
                if ($("#trayContainer").find("li").length != $(data).find("li").length) {
                    $("#trayContainer").fadeOut(300, function() {
                        $("#trayContainer").html(data);
                        $("#trayContainer").fadeIn(300);
                    });
                }
            }, "text/html");
        },

        loadDashboard: function (appAlias) {
            ///<summary>Loads the dashboard with the specified name</summary>  
                
            //get the tray icon
            var tray = $("#tray").find("a[data-app-alias='" + appAlias.toLowerCase() + "']");
            //get the dashboard url 
            var dashboard = tray.attr("data-dashboard-url");
            //show the dashboard
            this._opts.windowMgr.contentFrame(Umbraco.Utils.urlDecode(dashboard));
        },
            
        switchApp: function(appAlias) {
            ///<summary>Changes applications in the back office</summary>

            //get the tray icon
            var tray = $("#tray").find("a[data-app-alias='" + appAlias.toLowerCase() + "']");
            //get the tree src
            var src = tray.attr("data-tree-url");
            //load the tree app
            var _this = this;
            this._opts.mainTree.loadApp(src, function(data) {
                //need to check the callback to see if its selecting any persisted nodes (this stuff is stored using the Umbraco ApplicationPersistence jstree plugin)
                var persistedTreeData = data.inst.getApplicationState(data.inst._getCurrentAppId());
                if (persistedTreeData && ((persistedTreeData.selectedNodes && persistedTreeData.selectedNodes.length > 0) || persistedTreeData.loaded)) {
                    //don't load the dashboard, the selected node should load its editor...
                }
                else  {
                    _this.loadDashboard(appAlias);
                }
            });
                
            //change the tree container name
            $("#treeContainer .boxhead h2").text(tray.text());
                
        },

        detectLoginPage: function(pageHtml) {
            ///<summary>Checks if the pageHtml is the html for the login page</summary>

            if (pageHtml.search( /<meta\s+name="umbraco-page-type"\s+content="umbraco-login-page"/ ) != -1) {
                return true;
            }
            return false;
        },

        reloadTopWindow: function() {
            ///<summary>Simply reloads the back-office</summary>
            window.top.location.reload(true);
        },

        handleAuthTimeout: function (x, t, e, useModal) {
            ///<summary>detects if the response is the login page, if so, displays it in an overlay if showModal is true, if not will reload the top frame</summary>  
            if (this.detectLoginPage(x.responseText)) {
                if (!useModal) {
                    this.reloadTopWindow();    
                }
                else {
                    Umbraco.System.WindowManager.getInstance().showModal({ id: "login-dialog", isGlobal: true, title: "Login Expired", modalClass: "login", forceContentInIFrame: true, contentUrl: this._opts.loginUrl, showClose: false });   
                }                
                return true;
            }
            return false;
        },

        handleAjaxException: function(x, t, e) {
            ///<summary>Called to handle an exception/error caused by a jquery ajax call</summary>
                
            //show a modal window of the exception...
            //if the 'exception' is actually an error because the login token has timed out, redirect to home
            //so if the responseText has a meta tag: umbraco-page-type with a value of: umbraco-login-page we know its the login page                
            if (!this.handleAuthTimeout(x, t, e, true)) {                
                Umbraco.System.WindowManager.getInstance().showModal({ isGlobal: true, title: "Server error", modalClass: "exception", forceContentInIFrame: true, content: x.responseText });
            }
        }
    
    });
    
})(jQuery, base2.Base);
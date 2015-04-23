/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.UserGroupEditor = Base.extend({

        init: function(o) {

            var _opts = $.extend({
                //the hidden field to track the active tab index
                activeTabIndexField: true,
                //the active tab index to show on load
                activeTabIndex: ""
            }, o);
                
            // Setup permissions grid
            $("div.permissions-grid-container").permissionsGrid({
                userGroupPermissionsModel: {
                    userGroupId: "__permission__",
                    userGroupName: "",
                    permissions: _opts.permissions
                },
                isReadOnly: _opts.isReadOnly
            });

            //override the default index if it's zero and the query string exists
            if ($u.Sys.QueryStringHelper.getQueryStringValue("tabindex")) {
                _opts.activeTabIndex = $u.Sys.QueryStringHelper.getQueryStringValue("tabindex");
            }
            //create the tabs			
            $("#tabs").umbracoTabs({
                    content: "#editorContent",
                    activeTabIndex: _opts.activeTabIndex,
                    activeTabIndexField: _opts.activeTabIndexField
                });

            //create the toolbar UI Element panel
            $("#editorBar .container").UIPanel("Default");                

        }
        
    } , {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.Editors.UserGroupEditor();
            return this._instance;
        }
        
    });

})(jQuery, base2.Base);
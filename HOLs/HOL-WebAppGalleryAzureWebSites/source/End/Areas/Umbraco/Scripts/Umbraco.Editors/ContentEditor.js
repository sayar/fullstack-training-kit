/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.ContentEditor = Base.extend({
            
        _opts: null,
        _viewModel: null,
            
        init: function(o) {

            this._opts = $.extend({
                //the hidden field to track the active tab index
                activeTabIndexField: true,
                //the active tab index to show on load
                activeTabIndex: ""
            }, o);

            //override the default index if it's zero and the query string exists
            if ($u.Sys.QueryStringHelper.getQueryStringValue("tabindex")) {
                this._opts.activeTabIndex = $u.Sys.QueryStringHelper.getQueryStringValue("tabindex");
            }
            
            //create the tabs			
            $("#tabs").umbracoTabs({
                content: "#editorContent",
                activeTabIndex: this._opts.activeTabIndex,
                activeTabIndexField: this._opts.activeTabIndexField
            });
            
            //hookup additional buttons
            $("#submit_Preview").click(function(e) {
                e.preventDefault();
                window.open(o.previewUrl, "_blank");
            });
        }
        
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.ContentEditor();
            return this._instance;
        }

    }); 

})(jQuery, base2.Base);
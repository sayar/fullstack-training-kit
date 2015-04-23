/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.DefaultDashboard = Base.extend({
            
        init: function(o) {

            //create the tabs			
            $("#tabs").umbracoTabs({
                content: "#dashboardContent",
                activeTabIndex: o.activeTabIndex,
                activeTabIndexField: o.activeTabIndexField
            });
            
        }
        
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.DefaultDashboard();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
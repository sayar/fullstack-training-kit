/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {

    Umbraco.System.ClientApiManager = Base.extend(null, {
        ///<summary>A helper static class that provides access to the main existing objects that govern the application</summary>

        getApp: function() {
            return window.top.jQuery(window.top).umbracoApplicationApi();
        },

        getMainTree: function() {
            ///<summary>returns the api for the main left column tree</summary>
            return window.top.jQuery("#mainTree").umbracoTreeApi();
        },

        getHistoryManager: function() {
            ///<summary>returns the history manager for the top most window = the only one there should be</summary>
            return Umbraco.System.HistoryManager.getManagerForWindow(window.top);
        }
    });

    //create the shorthand notation
    
    //first the namespaces
    $u = Umbraco;
    $u.Sys = Umbraco.System;
    $u.Ctl = Umbraco.Controls;

    //then common objects
    $u.Sys.ApiMgr = $u.Sys.ClientApiManager;

})(jQuery, base2.Base);
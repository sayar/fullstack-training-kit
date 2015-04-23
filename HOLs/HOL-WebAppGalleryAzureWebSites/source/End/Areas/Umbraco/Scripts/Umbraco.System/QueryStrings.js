/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {

    Umbraco.System.QueryStringHelper = Base.extend(null, {
        getQueryStringValue: function(qryName) {
            var query = location.search.substring(1);
            var parts = query.split("&");
            for (var i = 0; i < parts.length; i++) {
                var token = parts[i].split("=");
                if (token[0] == qryName) {
                    return token[1];
                }
            }
            return null;
        }
    });

})(jQuery, base2.Base);
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference name="MicrosoftAjax.js"/>
/// <reference path="/umbraco_client/Application/Query/jquery.ba-bbq.min.js" />

Umbraco.System.registerNamespace("Umbraco.System");

(function($) {

    Umbraco.System.HistoryManager = {

        getManagerForWindow: function(w) {
            /// <summary>Returns the history manager associated with the specified window object</summary>
        
            //check if a history manager is already assigned to this window
            var curr = $(w).data("historyMgr");
            if (curr) {
                return curr;
            }

            //create the manager
            var obj = {

                navigateToCurrent: function(e) {
                    /// <summary>Dispatches an event for all listeners with the current hash information if there is any</summary>

                    //get the object in the hash
                    var l = $.deparam.fragment();
                    //check if 'a' (app) is specified
                    //TODO: open this up so that it's not just apps but IDs too!
                    if (l.a != null) {
                        $(this).trigger("navigating.historyManager", [l.a]); //raise event!
                        return true;
                    }
                
                    //if no deep linking occurred, return false
                    return false;
                },

                addHistory: function(name, forceRefresh) {
                    //get the object in the hash
                    var l = $.deparam.fragment();
                    if (l.a == name && forceRefresh) {
                        this.onNavigate();
                    }
                    else {
                        //update the name and push to history
                        l.a == name;
                        $.bbq.pushState(l);
                    }
                },
            
                getCurrent: function() {
                    return $.deparam.fragment();
                }                
            };
        
            //add this history manager to the current window
            $(w).data("historyMgr", obj);

            //wire up the navigate events, wrap method to maintain scope
            $(window).bind('hashchange', function(e) { obj.navigateToCurrent.call(obj); });        

            return obj;
        }
    };

})(jQuery);
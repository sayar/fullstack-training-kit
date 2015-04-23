/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/jquery/jquery.cookies.2.2.0.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/QueryStrings" />

Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {

    Umbraco.System.NotificationManager = Base.extend({

        //gets the notification id from the query string if there is one
        _getNotificationId: function() {
            return Umbraco.System.QueryStringHelper.getQueryStringValue("NotificationId");
        },

        //removes the cookie for the id
        _removeNotification: function() {
            var id = this._getNotificationId();
            if (id != null) {
                $.cookies.del(id);
            }
        },

        //creates the HTML display bubble to show the msg in
        _createBubble: function(msg, title, type, cssBottom) {
            var $bubble = $("<div class='notification-bubble'><div class='icon " + type + "'></div><h4></h4><div class='msg'></div>")
                .appendTo($("body", window.top.document));
            
            $bubble.find("h4").html(title);
            $bubble.find(".msg").html(msg);
            $bubble.css("bottom", cssBottom + "px");
            $bubble.show();

            $bubble.click(function() {
                $bubble.fadeOut(500, function() {
                    $bubble.remove();
                });
            });

            setTimeout(function() {
                    $bubble.fadeOut(500, function() {
                        $bubble.remove();
                    });
                }, 5000);

            return $bubble;
        },

        getMessages: function (notificationId) {
            ///<summary>returns the messages in the cookie based on the current notification query string id</summary>
            var msgs = $.cookies.filter(/^notification_/);
            var id = (notificationId) ? notificationId : this._getNotificationId();
            if (id != null) {
                //search the msg cookies for this id
                for (var name in msgs){
                    if (name == ("notification_" + id)) {
                        return msgs[name];
                    }
                }
            }
            //if nothing is found then return an empty array
            return [];
        },
        showNotifications: function (notifications) {
            ///<summary>method to show the notifications either based on a notification id, in which case it will try to find notifications in a cookie with the specified id, or you can pass in an array of notifications to display</summary>
            var msgs = null;
            if (!$.isArray(notifications)) {
                $(".notification-bubble", window.top.document).remove();
                msgs = this.getMessages(notifications);                                    
            }
            else {
                msgs = notifications;
            }
                
            var cssBottom = 5;
            for (var i=0;i<msgs.length;i++){
                //calculate position based on previous notifications
                $(".notification-bubble", window.top.document).each(function(index) {
                    cssBottom += 25 + $(this).height();
                });
                var $bubble = this._createBubble(msgs[i].message, msgs[i].title, msgs[i].type, cssBottom);
            }
            this._removeNotification();
                
        }

    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.System.NotificationManager();
            return this._instance;
        }

    });

})(jQuery, base2.Base);
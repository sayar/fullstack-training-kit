/// <reference path="NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Utils");

(function ($, Base) {

    Umbraco.Utils = Base.extend(null, {
    
        generateRandom: function() {
            /// <summary>Returns a random integer for use with URLs</summary>
            var day = new Date();
            var z = day.getTime();
            var y = (z - (parseInt(z / 1000, 10) * 1000)) / 10;
            return y;
        },

        isJquery: function(obj) {
            if (jQuery && obj && (obj instanceof jQuery)) {
                return true;
            }
            return false;
        },

        ctrlClick: function(key, callback, args, $validationElement) {
            /// <summary>extension method to capture ctrl + key combinations</summary>
            $(document).keydown(function(e) {
                if (!args) args = []; // IE barks when args is null
                if (e.keyCode == key.charCodeAt(0) && e.ctrlKey) {
                    if (Umbraco.Utils.isJquery($validationElement) && $.validator) {
                        $validationElement.validate();
                        if ($validationElement.valid()) {
                            callback.apply(this, args);
                        }
                    }
                    else {
                        callback.apply(this, args);
                    }
                    return false;
                }
            });
        },

        altClick: function(key, callback, args, $validationElement) {
            /// <summary>extension method to capture alt + key combinations</summary>
            $(document).keydown(function(e) {
                if (!args) args = []; // IE barks when args is null
                if (e.keyCode == key.charCodeAt(0) && e.altKey) {
                    if (Umbraco.Utils.isJquery($validationElement) && $.validator) {
                        $validationElement.validate();
                        if ($validationElement.valid()) {
                            callback.apply(this, args);
                        }
                    }
                    else {
                        callback.apply(this, args);
                    }
                    return false;
                }
            });
        },

        shiftClick: function(key, callback, args, $validationElement) {
            /// <summary>extension method to capture shift + key combinations</summary>
            $(document).keydown(function(e) {
                if (!args) args = []; // IE barks when args is null
                if (e.keyCode == key.charCodeAt(0) && e.shiftKey) {
                    if (Umbraco.Utils.isJquery($validationElement) && $.validator) {
                        $validationElement.validate();
                        if ($validationElement.valid()) {
                            callback.apply(this, args);
                        }
                    }
                    else {
                        callback.apply(this, args);
                    }
                    return false;
                }
            });
        },

        bindShortcuts: function(selector) {
            /// <summary>finds all elements inside of the selector (or in 'body' if not specified) that have a shortcut key specified and binds it</summary>
            $(selector).find("*[data-shortcut]").each(function() {
                var parts = $(this).attr("data-shortcut").split(' ');
                if (parts.length < 2) throw "the data-shortcut must contain a command key and a character key such as 'ctrl S' ";
                var triggerEvent = "click";
                if (parts.length >= 3)
                    triggerEvent = parts[2];

                //if validation is to be done...
                var $validationSelector = false;
                if (parts.length == 4 && parts[3] == "true") {
                    $validationSelector = $(this).closest("form");
                }
                var $this = $(this);

                if (parts[0] == "ctrl")
                    Umbraco.Utils.ctrlClick(parts[1], function(e) {
                        $this.trigger(triggerEvent);
                    }, null, $validationSelector);
                else if (parts[0] == "alt")
                    Umbraco.Utils.altClick(parts[1], function(e) {
                        $this.trigger(triggerEvent);
                    }, null, $validationSelector);
                else if (parts[0] != "shift")
                    Umbraco.Utils.shiftClick(parts[1], function(e) {
                        $this.trigger(triggerEvent);
                    }, null, $validationSelector);
                else
                    throw "the command key specified is not supported, only ctrl, alt and shift are supported";
            });
        },
        
        htmlEncode: function (string) {
            return $('<div/>').text(string).html();
        },
        
        htmlDecode: function (string) {
            $('<div/>').html(string).text();
        },
        
        // public method for url encoding
        urlEncode: function(string) {
            return escape(this._utf8_encode(string));
        },

        // public method for url decoding
        urlDecode: function(string) {
            return this._utf8_decode(unescape(string));
        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace( /\r\n/g , "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    });

})(jQuery, base2.Base);
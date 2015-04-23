/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/Modal/jqModal.js" />

Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {
    
    Umbraco.System.WindowManager = Base.extend({

        fadeOutContentFrame: function() {
            window.top.$("#editorContainer").hide();
        },

        contentFrame: function(url) {
            ///<summary>This changes the url for the content frame, or returns the DOM instance of the content frame document </summary>
            if (url) {
                $(window.top.contentFrame).data("url", url);
                this.fadeOutContentFrame();
                window.top.contentFrame.location.href = url;
                return null;
            }                
            else {
                return window.top.contentFrame;
            }
        },

        toggleTopWindowOverlay: function(show) {
            ///<summary>
            /// this puts the overlay over the window.top in case we are launching a non-global modal (i.e. for tree pickers)
            /// or potential could be used for when TinyMCE launches it's own modals
            ///</summary>

            if (show) {
                window.top.jQuery("body").prepend("<div class='modal-overlay fill'></div>");
                window.top.jQuery(".modal-overlay").css("z-index", 1);
                window.top.jQuery("iframe#contentFrame").css("z-index", 2);
            }
            else {
                window.top.jQuery("body").find(".modal-overlay").remove();
            }
        }, 

        showModal: function(o) {
            ///<summary>Shows a modal window based on the options specified</summary>

            var _opts = $.extend({
                //a uniqie id for the modal window
                id: "",
                //default to exception for now since this is currently our only kind
                modalClass: "exception", 
                //normally a class would be used to style, but we can support inline styles too
                modalStyle: "",
                //this will dynamically create an iframe to put the content in, useful if the content contains a full HTML markup or the result from the contentUrl is full HTML markup
                forceContentInIFrame: true,  
                //the actual content to show in the modal, ignored if contentUrl is specified
                content: "", 
                //the url to load content from to put in the modal, this will load the results in a div unless forceContentInIframe is true
                contentUrl: false,  //TODO: make this function
                //this defines if the modal is always shown on top of window.top or on top of the current frame
                isGlobal: false,
                title: "Window",
                //callback method, just before everything is removed from the DOM and memory
                onRemoving: null,
                //callback method after modal has been removed from DOM
                onRemoved: null,
                //whether to remove the modal window from the DOM when hidden or not
                removeOnHide: true,
                //whether or not to show the close button
                showClose: true
            }, o);

                
            var $iframe = null;
            var $modal;
            if (_opts.isGlobal) {
                //(always put it in the top window...)
                $modal = window.top.jQuery("<div/>").addClass("jqmWindow");
            }
            else {
                $modal = $("<div/>").addClass("jqmWindow");
            }
            
            if(_opts.id != "") {
                $modal.addClass("jqm" + _opts.id);
            }
                
            if (_opts.forceContentInIFrame) {
                //create an iframe to show the error in
                $iframe = $("<iframe />");
                $modal.append($iframe);
            }

            var _this = this;


            var header;
            if (_opts.showClose) {
                header = "<div class='header'><span>" + _opts.title + "<span><a href='#' class='modal-close'>×</a></div>";   
            }
            else {
                header = "<div class='header'><span>" + _opts.title + "<span></div>";   
            }

            $modal.appendTo("body")
                .jqm({
                        modal:true, 
                        overlayClass: "modal-overlay",
                        overlay: 100,
                        onShow: function(args) {                                                    
                            args.w.prepend(header)
                                .addClass(_opts.modalClass)
                                .attr("style", args.w.attr("style") + ";" + _opts.modalStyle)
                                .draggable({
                                    handle: ".jqmWindow .header",
                                    cancel: ".jqmWindow .body",
                                    containment: "body"
                                })
                                .show();
                            var $header = args.w.find(".header");
                            $modal.jqmAddClose($header.find(".modal-close"));
                            if ($iframe) {
                                //if an iframe is specified, add the content to it
                                if(_opts.contentUrl == false) {
                                    $iframe.contents().find("body").html($(_opts.content));
                                } else {
                                    $iframe.attr("src", _opts.contentUrl);
                                }
                                $iframe.width(args.w.width()).height(args.w.height() - $header.height() - 10);
                            }
                            else {
                                //if no iframe, then just append to the modal window
                                var $body = $("<div class='body'></div>");
                                args.w.append($body);
                                if(_opts.contentUrl == false) {
                                    $body.append($(_opts.content));
                                } else {
                                    $.get(_opts.contentUrl, function(data){
                                        $body.append($(data));
                                    });
                                }
                            }
                            if (!_opts.isGlobal && window.top != window) {
                                _this.toggleTopWindowOverlay(true);
                            }
                        },
                        onHide: function(args) {
                            args.w.fadeOut(300, function() {                                    
                                if (_opts.removeOnHide) {                                        
                                    if ($.isFunction(_opts.onRemoving)) {
                                        _opts.onRemoving.apply(_this, [args]);
                                    }                                        
                                    //remove the modal from the DOM
                                    $modal.remove();                                        
                                    if ($.isFunction(_opts.onRemoved)) {
                                        _opts.onRemoving.apply(_this, [args]);
                                    }
                                }
                                _this.toggleTopWindowOverlay(false);
                                args.o.remove();                                    
                            });
                        }
                    }).jqmShow();                
        },
            
        hideModal: function (o) {
            
            var _opts = $.extend({
                //a uniqie id for the modal window
                id: "",
                //this defines if the modal is always shown on top of window.top or on top of the current frame, default is global
                isGlobal: false
            }, o);
            
            var lookup = ".jqmWindow";
            
            if(_opts.id != "") {
                lookup += ".jqm" + _opts.id;
            }
            
            if (_opts.isGlobal) {
                window.top.jQuery("body").find(lookup).jqmHide();
            }
            else {
                $(lookup).jqmHide();
            }
        }

    }, {
        
        _instance: null,
        
        // Singleton accessor
        getInstance: function () {
            if(this._instance == null)
                this._instance = new Umbraco.System.WindowManager();
            return this._instance;
        }
        
    });


})(jQuery, base2.Base);
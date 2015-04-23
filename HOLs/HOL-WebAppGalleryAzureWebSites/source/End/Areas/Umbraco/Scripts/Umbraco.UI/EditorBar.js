/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="../../Scripts/Umbraco.System/UrlEncoder.js" />

Umbraco.System.registerNamespace("Umbraco.UI");

(function ($, Base) {

    // Initializes a new instance of the EditorBar class.
    Umbraco.UI.EditorBar = Base.extend({

        _el: null,
        _elId: null,
        _scrollInterval: null,
            
        constructor: function (element, defaultUIElements) {

            var _this = this;
            
            this._el = $(element);
            this._elId = this._el.id;
            
            // Setup the bar
            this._el.wrapInner("<div class='outer-container'><div class='inner-container'><div class='container' /></div></div>")
                .prepend("<a href='javascript:void(0);' class='btn-scroll btn-scroll-left' title='Scroll left'></a>")
                .append("<a href='javascript:void(0);' class='btn-scroll btn-scroll-right' title='Scroll right'></a>");
            
            // Setup UI Panel
            this._el.find(".container").UIPanel("Default", defaultUIElements);
            
            // Setup scroll buttons
            this._el.find(".btn-scroll-right").hover(function(){
                _this._scrollInterval = setInterval(function(){
                    var bar = $("#editorBar");  // Shouldn't really have #editorBar hard coded, but as there is only 1 editorBar, this is the simplest way to access the editor bar element
                    var outerContainer = bar.find(".outer-container");
                    var innerContainer = bar.find(".inner-container");
                    var container = bar.find(".container");
                    var maxValue = Math.min((container.outerWidth() - outerContainer.outerWidth()) * -1, 0);
                    var offset = innerContainer.position().left;
                    if(offset - 5 > maxValue) {
                        innerContainer.css("left", (innerContainer.position().left - 5) +"px"); 
                    } else {
                        innerContainer.css("left", maxValue + "px");
                        clearInterval(_this._scrollInterval); 
                    }
                }, 25);
            },function(){
                clearInterval(_this._scrollInterval);
            });
            
            this._el.find(".btn-scroll-left").hover(function(){
                _this._scrollInterval = setInterval(function(){
                    var container = $("#editorBar .inner-container"); // Shouldn't really have #editorBar hard coded, but as there is only 1 editorBar, this is the simplest way to access the editor bar element
                    var offset = container.position().left;
                    if(offset + 5 < 0) {
                        container.css("left", (container.position().left + 5) +"px");
                    } else {
                       container.css("left", "0px");
                        clearInterval(_this._scrollInterval); 
                    }
                }, 15);
            },function(){
                clearInterval(_this._scrollInterval);
            });
            
            // Reset to 0 when focus is changed
            $(Umbraco.PropertyEditors.PropertyEditorManager.getInstance()).bind('setFocus', function(e, context){
                $("#editorBar .inner-container").css("left", "0px"); // Shouldn't really have #editorBar hard coded, but as there is only 1 editorBar, this is the simplest way to access the editor bar element
            });
        }

    });

    // jQuery helper method to allow initialization via jQuery syntax
    $.fn.EditorBar = function(defaultUIElements) {

        return this.each(function() {
            var editorBar = new Umbraco.UI.EditorBar(this, defaultUIElements);
        });

    };

})(jQuery, base2.Base);
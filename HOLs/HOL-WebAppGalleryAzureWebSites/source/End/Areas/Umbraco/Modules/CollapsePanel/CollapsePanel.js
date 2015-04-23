/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Controls");

(function ($, Base) {

    $.fn.umbracoCollapsePanel = function (o) {
        var _opts = $.extend({
            panelSelector: ".box",
            buttonSelector: ">a, >div.toggle-button",
            //dataElementSelector: ".collapse-panel",
            collapsedTextAttr: "data-collapsed",
            expandedTextAttr: "data-expanded",
            textSelector: ">a>span",
            collapsed: null, //callback method
            expanded: null //callback method
        }, o);

        return $(this).each(function () {
            var pnl = new Umbraco.Controls.CollapsePanel($(this), _opts);
        });
    };

    $.fn.umbracoCollapsePanelApi = function() {
        //ensure there's only 1
        if ($(this).length != 1) {
            throw "Requesting the API can only match one element";
        }
        //ensure thsi is a collapse panel
        if ($(this).data("api") == null) {
            throw "The matching element had not been bound to an umbracoCollapsePanel";
        }
        return $(this).data("api");
    };

    Umbraco.Controls.CollapsePanel = Base.extend({
        
        _el: null,
        _opts: null,
            
        constructor: function (e, o) {

            this._el = e;
            this._opts = o;

            var _this = this;
            
            //initializes the collapse panel and click events...
            $(this._opts.panelSelector, this._el).hide();
            this._el.data("collapsed", true);
            
            $(this._opts.buttonSelector, this._el).click(function () {
                if (_this._el.data("collapsed")) {
                    _this.show();
                }
                else {
                    _this.hide();
                }
            });
            
            //put the api in the selectors data bag and return it
            this._el.data("api", this);
            
        },

        show: function () {
            $(this._opts.panelSelector, this._el).show();
            this._el.data("collapsed", false);
            this._el.find(".toggle-button").removeClass("expand-button").addClass("collapse-button");
            $(this._opts.textSelector, this._el).text(this._el.attr(this._opts.expandedTextAttr));
            if (this._opts.expanded && typeof this._opts.expanded == "function") this._opts.expanded.call(this._el);
        },
            
        hide: function () {
            $(this._opts.panelSelector, this._el).hide();
            this._el.data("collapsed", true);
            this._el.find(".toggle-button").removeClass("collapse-button").addClass("expand-button");
            $(this._opts.textSelector, this._el).text(this._el.attr(this._opts.collapsedTextAttr));
            if (this._opts.collapsed && typeof this._opts.collapsed == "function") this._opts.collapsed.call(this._el);
        }
        
    }); 

})(jQuery, base2.Base);
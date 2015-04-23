Umbraco.System.registerNamespace("Umbraco.Controls");

(function ($, Base) {

    Umbraco.Controls.UmbracoTabs = Base.extend({
         
         //**** internal members: ****
        _opts: null,
        _tabContent: null,
        _tabs: null,

         constructor: function (o) {
         ///<summary>Constructor</summary>
             
            this._opts = $.extend({
                //the jquery element that the tabs are applied to
                jqueryElem: null,
                //a jquery selector for the container of the tabs
                content: null,
                //A jquery selector for a hidden field (or any input with a val() ) to track the active tab index
                activeTabIndexField: false,
                //A callback fired when the tab index has changed, passes in an args parameter with an 'activeIndex' property
                onTabChange: false,
                //the initial active tab index to be displayed
                activeTabIndex: 0
            }, o);
            
        },

        init: function () {

            var _this = this;

            //store a reference to this api
            this._opts.jqueryElem.data("api", _this);

            //create the tabs
            _this._tabContent = $(_this._opts.content).children("div");
            //add the class
            _this._tabContent.each(function () {
                $(this).hide();
                $(this).addClass("tab-content");
            });
            _this._tabs = _this._opts.jqueryElem.find("li");
            _this._opts.jqueryElem.addClass("umb-tabs");
            _this._tabs.addClass("tab");
            
            //bind the click handler
            _this._tabs.find("a").click(function () {
                _this.activateTab($(this));
            });

            //set the active tab index
            _this.activateTab(_this._tabs.eq(_this._opts.activeTabIndex).find("a"));
        },
        
        activateTab : function ($tabLink) {
            ///<summary>activates a tab, this also raises an event</summary>

            var $currLi = $tabLink.closest("li");
            var index = this._tabs.index($currLi);
            //show the panel for the given index
            this._tabContent.filter(":visible").hide().end().eq(index).show();
            //update the tabs
            this._tabs.removeClass("tab-on");
            $currLi.addClass("tab-on");
            if ($.isFunction(this._opts.onTabChange)) {
                this._opts.onTabChange.apply($tabLink, [{ activeIndex: index}]);
            }            
            if (this._opts.activeTabIndexField) {
                $(this._opts.activeTabIndexField).val(index);   
            }
            
            var args = { index: index, content: this._tabContent.filter(":visible") };
            $(this).trigger("tabChanged.umbracoTabs", [args]);
        }
        
    });

    $.fn.umbracoTabs = function (o) {
        ///<summary>Jquery method to instantiate umbraco tabs</summary>

        return this.each(function () {            
            var tabs = new Umbraco.Controls.UmbracoTabs($.extend({ jqueryElem: $(this) }, o));
            tabs.init();
        });
    };

    $.fn.umbracoTabsApi = function() {
        /// <summary>exposes the Umbraco Tabs api for the selected object</summary>
        if ($(this).length != 1) {
            throw "UmbracoTabsApi selector requires that there be exactly one control selected, this selector returns " + $(this).length;
        };
        return $(this).data("api");     
    };


})(jQuery, base2.Base);    
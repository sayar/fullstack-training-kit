/* 
* This is a custom implementation of the jsTree context menu, customized to work with a custom dynamic menu
*/

(function ($) {

    $.jstree.plugin("umbracocontextmenu", {
        __init: function () {
            this.data.umbracoContextData = {};
            this.get_container()
            //handle the right click
                .delegate("a", "contextmenu.jstree", $.proxy(function (e) {
                    e.preventDefault();
                    this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
                }, this))
            //handle holding down the button to launch the context menu
                .delegate("a", "mousedown.jstree", $.proxy(function (e) {
                    //set the flag
                    this.data.umbracoContextData.down = true;
                    var _this = this;
                    //set the timeout
                    setTimeout(function () {
                        if (_this.data.umbracoContextData.down) {
                            //show the context menu
                            _this.show_contextmenu(e.currentTarget, e.pageX, e.pageY);
                        }
                    }, 1000);
                }, this))
                .delegate("a", "mouseleave.jstree", $.proxy(function (e) {
                    //reset the flag
                    if (this.data.umbracoContextData.down) this.data.umbracoContextData.down = false;
                }, this))
                .delegate("a", "click.jstree", $.proxy(function (e) {
                    //reset the flag
                    if (this.data.umbracoContextData.down)
                        this.data.umbracoContextData.down = false;
                }, this))
				.bind("destroy.jstree", $.proxy(function () {
				    if (this.data.umbracocontextmenu) {
				        $.vakata.context.hide();
				    }
				}, this));
            $(document).bind("context_hide.vakata", $.proxy(function () {
                this.data.umbracocontextmenu = false;
            }, this));
        },
        defaults: {
            select_node: false, // requires UI plugin
            show_at_node: true,
            items: function () {
                var menuDefs = $("#ctxMenuDef > div");
                //now, filter the menu items based on the current node's menu items (in metadata)
                var currNode = this.data.umbracoContextData.currNode;
                var nodeMenuItems = currNode.data().ctxMenu;

                var _this = this;
                //create empty menu object
                var m = {};
                /* function should return an object like this one
                "create": {
                "separator_before": true,
                "icon": false,
                "separator_after": false,
                "label": "Edit",
                "action": false,
                "submenu": {
                "cut": {
                "separator_before": false,
                "separator_after": false,
                "label": "Cut",
                "action": function (obj) { this.cut(obj); }
                }
                }*/
                var addMenuItem = function ($item, menuObj) {
                    //add a property to the menu object with the name of the item title
                    menuObj[$item.attr("data-title")] = {};
                    //get the reference to the object and build up the item object
                    var i = menuObj[$item.attr("data-title")];
                    i.seperator_before = $item.attr("data-sep-before") == 'true';
                    i.separator_after = $item.attr("data-sep-after") == 'true';
                    i.label = $item.attr("data-title");
                    i.icon = $item.attr("data-icon");
                    i.action = function (obj) {
                        var f = eval($item.attr("data-client-click"));
                        //ensure it's a method
                        if (!$.isFunction(f)) {
                            throw "The client click specified for the menu item " + $item.attr("data-title") + " does not resolve to a function";
                        }
                        //call the method and pass in a reference to the tree node selected and the menu item definition
                        //the 'this' context will be that of this plugin which can give you access to the tree object
                        f.call(_this, obj, $item);
                    }
                    //now recurse for sub menu items
                    $item.children("div").each(function () {
                        i.submenu = {};
                        addMenuItem($(this), i.submenu);
                    });
                }
                for (var i in nodeMenuItems) {
                    //find the menu definition for the current item
                    var def = menuDefs.filter(function () {
                        return $(this).attr("data-id") == nodeMenuItems[i];
                    });
                    if (typeof def == "undefined") {
                        throw "Menu item id " + nodeMenuItems[i] + " wasn't found in the menu definitions";
                    }
                    addMenuItem(def, m);
                }
                return m;
            }
        },
        _fn: {
            show_contextmenu: function (obj, x, y) {
                obj = this._get_node(obj);
                //store reference to node that was right clicked
                this.data.umbracoContextData.currNode = obj;
                var s = this.get_settings().umbracocontextmenu,
					a = obj.children("a:visible:eq(0)"),
					o = false;
                if (s.select_node && this.data.ui && !this.is_selected(obj)) {
                    this.deselect_all();
                    this.select_node(obj, true);
                }
                if (s.show_at_node || typeof x === "undefined" || typeof y === "undefined") {
                    o = a.offset();
                    x = o.left;
                    y = o.top + this.data.core.li_height;
                }
                if ($.isFunction(s.items)) { s.items = s.items.call(this, obj); }
                this.data.umbracocontextmenu = true;
                $.vakata.context.show(s.items, a, x, y, this, obj);
                if (this.data.themes) { $.vakata.context.cnt.attr("class", "jstree-" + this.data.themes.theme + "-context"); }

                //add rollout handler
                var _this = this;
                $.vakata.context.cnt.mouseleave(function () {
                    _this.data.umbracoContextData.isOver = false;
                    setTimeout(function () {
                        if (!_this.data.umbracoContextData.isOver) {
                            _this.data.umbracoContextData.isOver = false;
                            $.vakata.context.hide();
                            _this.data.umbracocontextmenu = false;
                        }
                    }, 500);
                });
                $.vakata.context.cnt.mouseenter(function () {
                    _this.data.umbracoContextData.isOver = true;
                });

            }
        }
    });
})(jQuery);
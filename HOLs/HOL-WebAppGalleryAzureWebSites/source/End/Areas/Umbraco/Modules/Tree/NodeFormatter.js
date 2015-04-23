/* 
* A jsTree plugin to custom html format the node after the data has loaded
*/

(function ($) {

    $.jstree.plugin("umbraconodeformatter", {
        __init: function () {
            this.get_container()
				.bind("load_node.jstree, clean_node.jstree", $.proxy(function (e, data) {
				    var obj = this._get_node(data.rslt.obj);
				    this.formatNode(obj);
				}, this));
        },
        defaults: {
        },
        _fn: {
            formatNode: function (obj) {
                var n = $(obj);
                //wrap text node in span
                if (obj == -1) {
                    n = this.get_container().find("li");
                }
                var txtNode = n.find("a").contents().filter(function () {
                    return this.nodeType == 3;
                });
                txtNode.wrap("<span/>");
                
                //insert the overlay <div>
                var overlay = $("<div class='umbraco-node-overlay'/>").insertBefore(n.find("ins:nth-child(1), li > ins"));

                var statusBar = n.closest(".boxbody").next(".boxfooter").find(".statusBar h5");

                //TODO: we could display the id in the tree status bar ? or similar ?

                //                //add the hover for the id
                //                overlay.closest("li").hover(
                //                    function (e) {
                //                        var $this = $(this);
                //                        $this.data("over", true);
                //                        setTimeout(function () {
                //                            if ($this.data("over") == true) {
                //                                statusBar.html($this.closest("li").attr("id"));
                //                            }
                //                        }, 150);
                //                    },
                //                    function (e) {
                //                        $(this).data("over", false);
                //                        statusBar.html("");
                //                    });
            }
        }
    });
})(jQuery);
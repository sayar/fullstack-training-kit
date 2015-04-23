/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="../../Scripts/Umbraco.System/WindowManager.js" />

Umbraco.System.registerNamespace("Umbraco.Controls");

(function ($, Base) {

    //static class for menu item actions
    Umbraco.Controls.MenuItems = Base.extend(null, {
       
        hostname: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "hostnameUrl");
        },

        publish: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "publishUrl");
        },

        sortItems: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "sortUrl");
        },

        createItem: function($treeNode, $menuObj) { 
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "createUrl");
        },

        copyItem: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "copyUrl");
        },

        moveItem: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "moveUrl");
        },

        permissions: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "permissionsUrl");
        },

        rollback: function($treeNode, $menuObj) {
            Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "rollbackUrl");
        },

        deleteItem: function($treeNode, $menuObj) {
            
            var _this = this;
            var id = $treeNode.attr("id");
            //get a reference to the umbraco tree api
            var tree = _this.get_container().umbracoTreeApi();
            //get the meta data for the node
            var meta = tree.getNodeMetaData($treeNode);
            //check that the deleteUrl exists
            if (!meta.deleteUrl) throw "deleteUrl does not exist in the node's meta data";

            //check if this is a recycle bin item
            if ($treeNode.closest(".recycle-bin").length > 0) {
                if (!confirm("This will permanently delete the item: '" + $treeNode.find("> a span").text() + "'. Are you sure you want to proceed, this action cannot be un-done?")) return;
            }
            else {
                if (!confirm("Are you sure you want to delete '" + $treeNode.find("> a span").text() + "'?")) return;
            }            

            //use ajax to delete the node
            $.ajax({
                type: "DELETE", 
                url: meta.deleteUrl,                 
                success: function(r) {                    
                    if (r && r.message == "Success") {
                        //now delete the node from the tree
                        tree.removeNode($treeNode);
                        //check if there's a recycleBinId supplied and sync the bin
                        if ($treeNode.data("recycleBinId")) {
                            tree.syncNode([$treeNode.data("recycleBinId")], function($e) {
                                //we could open the bin here, but that might be unecessary overhead
                                //tree.getJsTree().open_node($e, false);
                            }, true);
                        }

                        if (r.notifications) {
                            //now show the notification messages
                            Umbraco.System.NotificationManager.getInstance().showNotifications(r.notifications);
                        }                        
                    }
                    else {
                        throw "A non successful response was returned from the delete content ajax call: " + r;
                    }
                }
            });
        },

        reloadChildren: function($treeNode, $menuObj) {            
            //get a reference to the umbraco tree api
            var tree = this.get_container().umbracoTreeApi();
            //refresh the tree
            tree.syncNode($treeNode);
        },

        emptyBin: function($treeNode, $menuObj) {
            var _this = this;
            //get a reference to the umbraco tree api
            var tree = _this.get_container().umbracoTreeApi();
            //get the meta data for the node
            var meta = tree.getNodeMetaData($treeNode);
            //check that the deleteUrl exists
            if (!meta.emptyBinUrl) throw "emptyBinUrl does not exist in the node's meta data";

            var ok = confirm("Are you sure you want to empty the recycle bin?");
            if (!ok) return;

            //use ajax to empty the bin
            $.ajax({
                url: meta.emptyBinUrl,  
                type: "POST", 
                error: function(jqXHR, textStatus, errorThrown) {
                    //TODO: do something with the error
                    throw textStatus;
                },
                success: function(r) {
                    if (r && r.message == "Success") {
                        tree.syncNode($treeNode, function($newNode) {
                                $newNode.effect("highlight", {}, 1000);
                            });                        
                    }
                    else {
                        throw "A non successful response was returned from the empty bin ajax call: " + r;
                    }
                }
            });
        },

        _changeContentFrame: function(jsTree, $treeNode, metaDataKey) {
            ///<summary>A helper method to get the URL from meta data based on the key and change the content frame url to it</summary>
            
            //the id for the node
            var id = $treeNode.attr("id");
            //get a reference to the umbraco tree api
            var tree = jsTree.get_container().umbracoTreeApi();
            //get the meta data for the node
            var meta = tree.getNodeMetaData($treeNode);
            //check that the createUrl exists
            if (!meta[metaDataKey]) throw metaDataKey + " does not exist in the node's meta data";
            //change the content frame url
            Umbraco.System.WindowManager.getInstance().contentFrame(meta[metaDataKey]);

        }
    });

})(jQuery, base2.Base);
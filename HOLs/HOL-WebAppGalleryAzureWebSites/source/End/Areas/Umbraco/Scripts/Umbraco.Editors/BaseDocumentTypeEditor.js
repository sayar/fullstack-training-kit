/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Modules/UmbracoTabs/UmbracoTabs.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($, Base) {

    Umbraco.Editors.BaseDocumentTypeEditor = Base.extend({
            
        _opts: null,
            
        init: function (o) {

            var _this = this;
            
            this._opts = $.extend({
                //true to show the 'new property' collapse panel expanded
                showNewProperty: false,
                //the hidden field to track the active tab index
                activeTabIndexField: true,
                //the active tab index to show on load
                activeTabIndex: ""
            }, o);

            //override the default index if it's zero and the query string exists
            if ($u.Sys.QueryStringHelper.getQueryStringValue("tabindex")) {
                this._opts.activeTabIndex = $u.Sys.QueryStringHelper.getQueryStringValue("tabindex");
            }
            
            //create the tabs
            $("#tabs").umbracoTabs({
                content: "#editorContent",
                activeTabIndex: this._opts.activeTabIndex,
                activeTabIndexField: this._opts.activeTabIndexField
            });
            
            // Auto collapse new property if left empty and move to another section
            $("#tabs").click(function() {
                var newName = $("#newPropertyPanel input[id$=Name]").val();
                var newAlias = $("#newPropertyPanel input[id$=Alias]").val();
                if("" + newName + newAlias == "") {
                    $("#newPropertyPanel").umbracoCollapsePanelApi().hide();
                }
            });

            //Add enter key listener on new tab field and force click on submit tab button, rather than the main save button
            $("#NewTabName").keypress(function(e) {
                if(e.which == 13) {
                    $(this).blur();
                    $('#submit_Tab').focus().click();
                }
            });

            //need to dynamically enable/disable the client validation for the 'new property' based on whether it's shown or not  
            //so would ensure the ignore rule validation is assigned
            $("#newPropertyPanel").find("input,select").addClass("ignore");

            //create the collapse panels, with callbacks
            $(".collapse-panel").umbracoCollapsePanel({
                collapsed: function () {
                    if ($(this).attr("id") == "newPropertyPanel") {
                        $("#IsCreatingNewProperty").val(false);
                        //update the ignore attributes
                        $(this).find("input,select").addClass("ignore");
                    }
                },
                expanded: function () {
                    if ($(this).attr("id") == "newPropertyPanel") {
                        $("#IsCreatingNewProperty").val(true);
                        //update the ignore attributes
                        $(this).find("input,select").removeClass("ignore");
                    }
                }
            });


            //open the 'NewProperty' collapse panel if it supposed to be open on load
            if (this._opts.showNewProperty) {
                $("#newPropertyPanel").umbracoCollapsePanelApi().show();
            }

            //bind the 'NewProperty' Name field to auto populate the Alias field
            $("#newPropertyPanel input.text-box[id$='_Name']").live("keyup blur", function() {
                var alias = $(this).parents(".collapse-panel").find("input.text-box[id$='_Alias']");
                alias.val($(this).val().toUmbracoAlias());
            });

            //initialize the sortable tab items
            $("#tabItems").sortable({
                items: ".draggable-rows",
                start: function(event, ui) {
                    if(ui.item.hasClass("inherited")) {
                        ui.item.trigger("stop");
                    }
                },
                //update the proper sort order for each item
                update: function (e, ui) {
                    var lastIndex = -1;
                    $(this).find("li").each(function (idx, itm) {
                        if($(itm).hasClass("inherited")) {
                            lastIndex = $(itm).find("input[id$='SortOrder']").val();
                        } else {
                            $(itm).find("input[id$='SortOrder']").val(++lastIndex);
                        }
                    });
                },
                forcePlaceholderSize : true,
                axis: "y",
                placeholder: "sort-target"
            });
            
            // Prevent inherited from being dragged (need to do it this way to allow non-inherited to be sorted inbetween)
            $(".draggable-rows.inherited").mousedown(function (e) {
                e.preventDefault();
                $("#tabItems").sortable("disable");
            });
            $("body").mouseup(function (e) {
                e.preventDefault();
                $("#tabItems").sortable("enable");
            });

            //check if any .tab-properties is empty and if so, add a .tab-property-empty to it
            function addEmptyPropertyTemplateToEmptyTabs() {
                var emptyTabs = $(".tab-properties").filter(function () {
                    return $(this).children().length == 0;
                });
                $("#emptyTabPropertyTemplate").clone().appendTo(emptyTabs)
                        .droppable({
                            accept: ".tab-properties .collapse-panel"
                        }).show();
            }

            //this sets the correct sort order for each property on each tab
            //and also sets the correct tab id for each property
            function updateTabProperties() {
                $(".tab-properties").each(function () {
                    var index = 0;
                    var tabId = $(this).attr("data-tab-id");
                    $(this).find(".collapse-panel").each(function () {
                        $(this).find("input[id$='SortOrder']").val(++index);
                        $(this).find("select[id$='TabId']").val(tabId);
                    });
                });
            }

            //initialize the sortable items for the properties
            $(".tab-properties:not(.inherited)").sortable({
                items: ".collapse-panel:not(.inherited)",
                connectWith: ".tab-properties:not(.inherited)",
                update: function (e, ui) {
                    //remove any empty elements for the current tab-properties
                    ui.item.closest(".tab-properties").find(".tab-property-empty").remove();
                    //now, check if any .tab-properties is empty and if so, add a .tab-property-empty to it
                    addEmptyPropertyTemplateToEmptyTabs();
                    //now, re-sort all of the properties
                    updateTabProperties();
                },
                forcePlaceholderSize : true,
                axis: "y",
                placeholder: "sort-target"
            });

            $(".collapse-panel .delete-button, .property-pane .delete-button").click(function () {
                return confirm("Are you sure?");
            });
            
            //add confirmation box to the "Inherit From" checkboxes when unselecting
            $(".inherit-from input[type=checkbox]").change(function() {
                $(".inheritance-notice").show();
            });

            $("#Icon option[value^=tree-]").each(function(idx, itm) {
                $(itm).attr("class", $(itm).val());
            });
            $("#Icon option:not([value^=tree-])").each(function(idx, itm) {
                $(itm).attr("class", "icon" + idx);
                $(itm).attr("style", "background: transparent url(" + _this._opts.iconsBaseUrl + "/" + $(itm).val() +") left top no-repeat;");
            });
            $("#Icon").msDropDown({useSprite: "sprite"});
            
            $("#Thumbnail option").each(function(idx, itm) {
                $(itm).attr("title", _this._opts.thumbnailsBaseUrl + "/" + $(itm).val());
            });
            $("#Thumbnail").msDropDown();
            
            addEmptyPropertyTemplateToEmptyTabs();
        }
    }, {

        _instance: null,

        // Singleton accessor
        getInstance: function () {
            if (this._instance == null)
                this._instance = new Umbraco.Editors.BaseDocumentTypeEditor();
            return this._instance;
        }

    });    

})(jQuery, base2.Base);
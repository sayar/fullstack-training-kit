/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Editors");

(function ($) {

    $.fn.umbracoDocTypeInfo = function(o) {
        ///<summary>jquery plugin to configure a drop down list to show the info/image for each doc type selected</summary>

        var _opts = $.extend({
                imgDataAttr: "data-img",
                paraDataAttr: "data-description",
                titleDataAttr: "data-title"
            }, o);

        if (!_opts.docTypeThumbnailBaseUrl) throw "the docTypeIconBaseUrl option wasn't specified";

        return $(this).each(function() {

            //create the info panel next to the drop down
            var $infoPanel = $('<div class="doc-type-info"><p></p></div>').insertAfter($(this)).hide();

            //method to do the updating of the info panel based on the selected value in the drop down list
            var updatePanel = function($ddl) {
                if ($ddl.val() == null || $ddl.val() == "") {
                    return;
                }
                var $optionItem = $ddl.find("option[value='" + $ddl.val() + "']");

                var $paraItem = $infoPanel.find("p");
                //set the p text to the data attribute val
                var titleText = $optionItem.attr(_opts.titleDataAttr);
                var htmlTitleText = "<strong>" + titleText + "</strong><br/><br/>";
                var description = $optionItem.attr(_opts.paraDataAttr);
                var img = $optionItem.attr(_opts.imgDataAttr);

                if (img != "" && description != "") {
                    $paraItem.html(htmlTitleText + description);
                    var $imgItem = $infoPanel.find("img");
                    var imgUrl = _opts.docTypeThumbnailBaseUrl + "/" + img;
                    if ($imgItem.length == 0) {
                        //create the image now, otherwise we'll get empty requests previously
                        $paraItem.after("<img src='" + imgUrl + "' alt='" + titleText + "'/>");
                    }
                    else {
                        //set the img path to the data attribute value
                        $imgItem.attr("src", imgUrl);
                    }

                    $infoPanel.show();
                }


            };

            //wire up on change method of drop down list
            $(this).change(function() {
                updatePanel($(this));
            });

            //if the first item in the list has a value then show the panel 
            updatePanel($(this));
        });
    };

})(jQuery);
/// <reference path="/Areas/Umbraco/Scripts/Base2/base2.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/BaseViewModel.js" />

Umbraco.System.registerNamespace("Umbraco.UI");

(function ($, Base) {

    // Initializes a new instance of the TreePicker class.
    Umbraco.UI.HierarchicalCheckBoxList = Base.extend({

        // Constructor
        constructor: function (el) {

            var $el = $(el);

            // Hookup labels
            $el.find("label").click(function(e) {
                e.preventDefault();
                var $this = $(this);
                $el.find("input[id=" + $this.attr("for") +"]").each(function (idx, el2) {
                    var $el2 = $(el2);
                    if($el2.is(":checked")) {
                        $el2.removeAttr("checked");
                    } else {
                        $el2.attr("checked", "checked");
                    }
                });
                $("input[id=" + $this.attr("for") +"]:first").triggerHandler("change");
            });

            // Hookup checkboxes
            $el.find("input[type=checkbox]").change(function() {
                var $this = $(this);
                var id = this.id;
                if($this.is(":checked")) {
                    $el.find("input[id=" + id + "]").each(function(idx, el2) { $(el2).attr("checked", "checked"); });
                    var parentValues = $this.data("parent-values").split(",");
                    for(var i = 0; i < parentValues.length; i++) {
                        $el.find("input[type=checkbox][value=" + parentValues[i] + "]").attr("checked", "checked").triggerHandler("change");
                    }
                } else {
                    $("input[id=" + id + "]").each(function(idx, el2) { $(el2).removeAttr("checked"); });
                    var thisValue = $this.val();
                    $el.find("input[type=checkbox][data-parent-values*=" + thisValue + "]:checked").removeAttr("checked").triggerHandler("change");
                }
            });
            
            // Auto select parent checkboxes
            $el.find("input[type=checkbox]:checked").each(function(idx, el2) { $(el2).triggerHandler("change"); });
        }

    });

    //jquery plugin
    $.fn.hierarchicalCheckBoxList = function (o) {

        var _opts = $.extend({
            inputField: $(this)
        }, o);

        return $(this).each(function () {
            var checkBoxList = new Umbraco.UI.HierarchicalCheckBoxList(this, _opts);
            $(this).data("api", checkBoxList);
        });
    };

    //jquery api plugin 
    $.fn.hierarchicalCheckBoxListApi = function () {

        //ensure there's only 1
        if ($(this).length != 1) {
            throw "Requesting the API can only match one element";
        }

        //ensure thsi is a collapse panel
        if ($(this).data("api") == null) {
            throw "The matching element had not been bound to a treePicker";
        }

        return $(this).data("api");
    };

    $(function() {
        //automatically hookup any checkbox lists on the page
        $(".hierarchical-table-box").hierarchicalCheckBoxList();
    });

})(jQuery, base2.Base);
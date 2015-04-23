/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />


Umbraco.System.registerNamespace("Umbraco.System");

(function ($, Base) {


    Umbraco.System.ValidationHelper = Base.extend(null, {
        ///<summary>A helper class for all things validation</summary>

        validateJsonResponse: function(response, ruleName) {
            ///<summary>This checks the json object to see if it matches our json validation error message format and if so displays the errors accordingly</summary>
            if (response == null || response.success == null || response.failureType == null || response.success == "true") return true;
            if (response.failureType == "ValidationError" && response.validationErrors != null) {
                var hasError = false;
                for (var v in response.validationErrors) {
                    hasError = true;
                    //creates a rule for the element found with the validation message found in the json response
                    var $element = $("#" + response.validationErrors[v].name);
                    if ($element.length > 0) {
                        //create a rule for each msg
                        for (var m in response.validationErrors[v].errors) {
                            var msgs = { };
                            msgs[ruleName] = response.validationErrors[v].errors[m];
                            var rule = { };
                            rule[ruleName] = true;
                            rule.messages = msgs;
                            //now we need to make sure the rule exist in the validation
                            if (typeof $.validator.methods[ruleName] == "undefined") {
                                $.validator.addMethod(ruleName,
                                    function(value, element) {
                                        return value == "true";
                                    });
                            }
                            $element.rules("add", rule);
                        }
                        //run the validation
                        $element.closest("form").valid();
                    }
                }
                return !hasError;
            }
            return true;
        }

    });
    

    $.fn.validationSummary = function (o) {
        ///<summary>Creates the Umbraco validation summary and wires up the events for toggling, etc... </summary>

        return $(this).each(function () {

            var $this = $(this);
            var $content = $this.parent().find("#editorContent");
            //get initial top of tab content
            var originalTop = $content.position().top;
            var eventsWired = false;

            var api = {
                expandErrors: function($toggleBtn) {
                    $toggleBtn.removeClass("expand-button").addClass("collapse-button");
                    $toggleBtn.parent().find("ul").show();
                    $content.css("top", originalTop + $this.outerHeight() + "px");
                },
                hideSummary: function() {
                    $content.css("top", originalTop + "px");
                    $this.hide();
                },
                checkValidation: function () {
                    if (!$this.hasClass("valid")) {
                        $this.show();
                        //set the top to where it should be with the summary in place

                        $content.css("top", originalTop + $this.outerHeight() + "px");

                        this.expandErrors($this.find(".toggle-button"));

                        if (!eventsWired) {                            
                            $this.find(".toggle-button").click(function () {
                                if ($(this).hasClass("collapse-button")) {
                                    $(this).removeClass("collapse-button").addClass("expand-button");
                                    $(this).parent().find("ul").hide();
                                    $content.css("top", originalTop + $this.outerHeight() + "px");        
                                }
                                else {
                                    $this.validationSummaryApi().expandErrors($(this));
                                }
                            });

                            eventsWired = true;
                        }
                    }
                }         
            }                          
            //store the api in the object
            $this.data("api", api);

            //bind to the validation engine event
            $this.closest("form").bind("invalid-form.validate", function () {
                $this.removeClass("valid");
                api.checkValidation();
            });
            api.checkValidation();

        });
    }

    $.fn.validationSummaryApi = function (o) {
        ///<summary>Returns the api for the validation summary</summary>
        if ($(this).length != 1) {
            throw "validationSummaryApi selector requires that there be exactly one control selected, this selector returns " + $(this).length;
        };
        return $(this).data("api");  
    }

    $(document).ready(function () {
        //initialize the validation summary
        $(".validation-summary").validationSummary();

        //set all property-editors to have the correct class when a sub property is invalid
        $(".field-validation-error").closest(".property-editor").addClass("invalidated");
    });

})(jQuery, base2.Base);
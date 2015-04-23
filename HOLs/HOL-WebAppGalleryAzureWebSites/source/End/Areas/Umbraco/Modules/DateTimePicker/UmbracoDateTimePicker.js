(function ($) {

    $.fn.umbracoDateTimePicker = function (showTime, chooseDateTxt, noDateTxt, removeDateTxt, dateFormat) {

       
        return $(this).each(function () {
            //create the date/time picker
            $(this).datetimepicker({
                duration: "",
                showTime: showTime,
                constrainInput: true,
                buttonText: "<span>" + chooseDateTxt + "</span>",
                showOn: 'button',
                changeYear: true,
                dateFormat: dateFormat == null ? 'yy-mm-dd' : dateFormat,
                onClose: function (dateText, inst) { if (dateText == '') return; $(this).nextAll('span').remove(); }
            });
            //simple method to create the no date selected text block
            var addNoDate = function ($obj) {
                if ($obj.siblings('span').length == 0) {
                    $obj.siblings('button').after('<span>' + noDateTxt + '</span>');
                }
                $obj.nextAll('a').remove();
            }
            var addRemoveDate = function ($obj) {
                if ($obj.nextAll('a').length == 0) {
                    $('<a>' + removeDateTxt + '</a>').insertAfter($obj.nextAll('button')).click(clearDate);
                }
            }
            //simple method to handle the clear date button click
            var clearDate = function () {
                $(this).siblings('input').val('');
                addNoDate($(this));
                $(this).remove();
            }
            //wire up the textbox event, we'll create/remove items when it has values or not.
            $(this).change(function () {
                if ($(this).val() == '') {
                    addNoDate($(this));
                }
                else {
                    addRemoveDate($(this));
                    $(this).nextAll('span').remove();
                }
            });
            //wire up anchor click
            $(this).nextAll('a').click(clearDate);
            //initialize text!
            if ($(this).val() == "") {
                addNoDate($(this));
            }
            else {
                addRemoveDate($(this));
            }
        });
    };

})(jQuery);
(function ($) {
    tinymce.create('tinymce.plugins.UmbracoMacroPlugin', {

        init: function (ed, url) {

            var _this = this;
            var isOnMacroElement = false;

            function getMacroContents($macro) {
                ///<summary>This will make an AJAX call to retreive the actual contents of a macro, the $macro parameter is the JQuery element defining a macro</summary>
                var macroAlias = $macro.attr("data-macro-alias");
                //get the macro parameters as json
                var macroparams = $.parseJSON($macro.attr("data-macro-params").toString().base64Decode());

                var _this = this;
                var data = ko.toJSON({
                    currentNodeId: tinyMCE.activeEditor.getParam('umbraco_curr_node_id'),
                    macroAlias: macroAlias,
                    macroParams: macroparams
                });
                var ajaxUrl = tinyMCE.activeEditor.getParam('umbraco_macro_contents_ajax_url');

                $.post(ajaxUrl, data, function (e) {
                    //now that its loaded we need to replace the contents with the macro contents from the server
                    //need to find the 'real' element inside TinyMCE
                    var $macroElement = $(ed.getBody()).find("#" + $macro.attr("id"));
                    $macroElement.children().fadeOut(500, function () {
                        $macroElement.html(e.macroContent);
                        ed.execCommand('mceRepaint');
                    });
                });

                //on initial call, we are just going to return the macro name and a throbber
                return "<div class='umb-progress-spinner'>loading...</div><span>Macro: <strong>'" + macroAlias + "</strong>'</span>";
            }

            function resetMacroElements(content, insertUI) {
                ///<summary>Parses the macro elements inside of 'content' and removes all markup. If insertUI is true, it will insert the UI to display to the user with the macro name and a link</summary>
                var output = "";
                //loop through each root element
                $(content).each(function () {
                    if ($(this).get(0).nodeType == 3) {
                        //if this is a text node, deal with it seperately... though the 'each' function only seems to find text nodes in IE9... think its a bug in current jquery version (1.4.4)
                        output += $(this).get(0).nodeValue;
                    }
                    else {
                        //clone the element and wrap with div
                        var cloned = $(this).clone().wrap("<div></div>").parent();
                        //find all macro holders and clear out their contents
                        cloned.find(".umb-macro-holder").each(function () {
                            var insert = insertUI
                            ? "<!-- start macro -->" + getMacroContents($(this)) + "<!-- end macro -->"
                            : "<!-- start macro --><!-- end macro -->";
                            //get the alias, and set the contents as the alias
                            $(this).html(insert);
                        });
                        //append the html
                        output += cloned.html();
                    }

                });
                return output;
            }

            function getRealMacroElem(element) {
                ///<summary>
                /// Because the macro gets wrapped in a P tag because of the way 'enter' works, this 
                /// method will return the macro element if not wrapped in a p, or the p if the macro
                /// element is the only one inside of it even if we are deep inside an element inside the macro
                /// </summary>

                var e = $(element).closest(".umb-macro-holder");
                if (e.length > 0) {
                    if (e.get(0).parentNode.nodeName == "P") {
                        //now check if we're the only element                    
                        if (element.parentNode.childNodes.length == 1) {
                            return e.get(0).parentNode;
                        }
                    }
                    return e.get(0);
                }
                return null;
            }

            function onNodeChanged(ed, cm, n) {
                ///<summary>
                /// Add a node change handler, test if we're editing a macro and select the whole thing, then set our isOnMacroElement flag.
                /// If we change the selection inside this method, then we end up in an infinite loop, so we have to remove ourselves
                /// from the event listener before changing selection, however, it seems that putting a break point in this method
                /// will always cause an 'infinite' loop as the caret keeps changing.
                ///</summary>

                //set our macro button active when on a node of class umb-macro-holder
                var $macroElement = $(n).closest(".umb-macro-holder");

                cm.setActive('umbracomacro', $macroElement.length != 0);

                if ($macroElement.length > 0) {
                    var macroElement = $macroElement.get(0);

                    //remove the event listener before re-selecting
                    ed.onNodeChange.remove(onNodeChanged);

                    // move selection to top element to ensure we can't edit this
                    ed.selection.select(macroElement);

                    // check if the current selection *is* the element (ie bug)
                    var currentSelection = ed.selection.getStart();
                    if (tinymce.isIE) {
                        if (!ed.dom.hasClass(currentSelection, 'umb-macro-holder')) {
                            while (!ed.dom.hasClass(currentSelection, 'umb-macro-holder') && currentSelection.parentNode) {
                                currentSelection = currentSelection.parentNode;
                            }
                            ed.selection.select(currentSelection);
                        }
                    }

                    //set the flag
                    isOnMacroElement = true;

                    //re-add the event listener
                    ed.onNodeChange.addToTop(onNodeChanged);
                }
                else {
                    isOnMacroElement = false;
                }

            }

            ed.onSaveContent.add(function (ed, o) {
                ///<summary>We need to remove the contents of the macro content so that it doesn't actually get persisted and ensure that our custom hidden html comments are added so we can parse nicely on the server side</summary>                
                o.content = resetMacroElements(o.content, false);
            });

            ed.onPaste.add(function (ed, o) {
                //TODO: This should work, but doesn't really :( so can't really prevent people from pasting into the macro
                //there might be some magical way, but currently no deal as far as i can figure out.
                if (isOnMacroElement) {
                    //cancel pasting
                    if (o.preventDefault) o.preventDefault();
                    if (o.stopImmediatePropagation) o.stopImmediatePropagation();
                    return false;
                }
            });

            ed.onLoadContent.add(function (ed, o) {
                ///<summary>On load we will insert custom information into our macros such as the macro title and a link to display it</summary>
                ed.setContent(resetMacroElements(o.content, true));
            });

            ed.onPreInit.add(function () {
                ///<summary>Adds custom rules for the macro plugin and custom serialization</summary>

                //this is requires so that we tell the serializer that a 'div' is actually allowed in the root, otherwise the cleanup will strip it out
                ed.serializer.addRules('div');

                ed.serializer.addNodeFilter('div', function (nodes, name) {
                    ///<summary>This checks if the div is a macro container, if so, checks if its wrapped in a p tag and then unwraps it (removes p tag)</summary>
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].attr("class") == "umb-macro-holder" && nodes[i].parent && nodes[i].parent.name.toUpperCase() == "P") {
                            nodes[i].parent.unwrap();
                        }
                    }
                });

            });

            //set onNodeChanged event listener
            ed.onNodeChange.addToTop(onNodeChanged);

            ed.onKeyDown.add(function (ed, e) {
                ///<summary>
                /// Listen for the keydown in the editor, we'll check if we are currently on a macro element, if so
                /// we'll check if the key down is a supported key which requires an action, otherwise we ignore the request
                /// so the macro cannot be edited.
                ///</summary>

                if (isOnMacroElement) {
                    var macroElement = ed.selection.getNode();

                    //get the 'real' element (either p or the real one)
                    macroElement = getRealMacroElem(macroElement);

                    //prevent editing
                    e.preventDefault();
                    e.stopPropagation();

                    var moveSibling = function (element, isNext) {
                        var $e = $(element);
                        var $sibling = isNext ? $e.next() : $e.prev();
                        if ($sibling.length > 0) {
                            ed.selection.select($sibling.get(0));
                            ed.selection.collapse(true);
                        }
                        else {
                            //if we're moving previous and there is no sibling, then lets recurse and just select the next one
                            if (!isNext) {
                                moveSibling(element, true);
                                return;
                            }

                            //if there is no sibling we'll generate a new p at the end and select it
                            ed.setContent(ed.getContent() + "<p>&nbsp;</p>");
                            ed.selection.select($(ed.dom.getRoot()).children().last().get(0));
                            ed.selection.collapse(true);

                        }
                    }

                    //supported keys to move to the next or prev element (13-enter, 27-esc, 38-up, 40-down, 39-right, 37-left)
                    //supported keys to remove the macro (8-backspace, 46-delete)                    
                    if ($.inArray(e.keyCode, [13, 40, 39]) != -1) {
                        //move to next element
                        moveSibling(macroElement, true);
                    }
                    else if ($.inArray(e.keyCode, [27, 38, 37]) != -1) {
                        //move to prev element
                        moveSibling(macroElement, false);
                    }
                    else if ($.inArray(e.keyCode, [8, 46]) != -1) {
                        //delete macro element

                        //move first, then delete
                        moveSibling(macroElement, false);
                        ed.dom.remove(macroElement);
                    }

                    return false;

                }
            });

            ed.addCommand('mceUmbracoMacro', function () {
                ///<summary>Register our MCE command</summary>

                //we need to wait a small amount of time for the selection to actually be done, especially if the selction is caused
                //by a click or a cursor moving into the macro area... 
                setTimeout(function () {
                    //check if we already have a macro selected, if so we should be editing it
                    var element = getRealMacroElem(ed.selection.getNode());
                    var $e = $(element);

                    //create the url params
                    var action = "SelectMacro";
                    var urlParams = "contentId=" + tinyMCE.activeEditor.getParam('umbraco_curr_node_id') + "&";

                    if ($e.length > 0) {
                        var macroId = $e.attr("id");
                        //if we're editing a macro, then fill in it's parameters
                        action = "SetParameters";
                        urlParams += "macroAlias=" + escape($e.attr("data-macro-alias").toString().utf8Encode()) + "&inlineMacroId=" + macroId + "&macroParameters=" + escape($e.attr("data-macro-params").toString().utf8Encode()) + "&isNew=false";
                    } else {
                        urlParams += "isNew=true";
                    }

                    var url = tinyMCE.activeEditor.getParam('umbraco_mce_controller_paths')['InsertMacro'];
                    url = url.substr(0, url.lastIndexOf('/')) + '/' + action;
                    url += '?' + urlParams;

                    ed.windowManager.open({
                        file: url,
                        width: 480,
                        height: 510,
                        inline: 1
                    }, {
                        plugin_url: url
                    });
                }, 200);


            });

            // Register buttons
            ed.addButton('umbracomacro', {
                title: 'umbracomacro.desc',
                cmd: 'mceUmbracoMacro'
            });

        },


        getInfo: function () {
            return {
                longname: 'Umbraco Macro Plugin',
                author: 'Umbraco HQ',
                authorurl: 'http://umbraco.com',
                infourl: 'http://umbraco.com',
                version: "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('umbracomacro', tinymce.plugins.UmbracoMacroPlugin);
})(jQuery);
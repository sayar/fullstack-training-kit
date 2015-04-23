(function () {
    tinymce.create('tinymce.plugins.UmbracoLinkPlugin', {
        init: function (ed, url) {
            this.editor = ed;

            // Register commands
            ed.addCommand('mceUmbracoLink', function () {
                var se = ed.selection;

                // No selection and not in link
                if (se.isCollapsed() && !ed.dom.getParent(se.getNode(), 'A'))
                    return;

                ed.windowManager.open({
                    file: tinyMCE.activeEditor.getParam('umbraco_mce_controller_paths')['InsertLink'],
                    width: 480 + parseInt(ed.getLang('advlink.delta_width', 0)),
                    height: 510 + parseInt(ed.getLang('advlink.delta_height', 0)),
                    inline: 1
                }, {
                    plugin_url: url
                });
            });

            // Register buttons
            ed.addButton('umbracolink', {
                title: 'advlink.link_desc',
                cmd: 'mceUmbracoLink'
            });

            ed.addShortcut('ctrl+k', 'advlink.advlink_desc', 'mceUmbracoLink');

            ed.onNodeChange.add(function (ed, cm, n, co) {
                cm.setDisabled('umbracolink', co && n.nodeName != 'A');
                cm.setActive('umbracolink', n.nodeName == 'A' && !n.name);
            });
        },

        getInfo: function () {
            return {
                longname: 'Umbraco Link Plugin',
                author: 'Umbraco HQ',
                authorurl: 'http://umbraco.com',
                infourl: 'http://umbraco.com',
                version: '1.0'
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('umbracolink', tinymce.plugins.UmbracoLinkPlugin);
})();
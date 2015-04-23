(function () {
    tinymce.create('tinymce.plugins.UmbracoAnchorPlugin', {
        init: function (ed, url) {
            this.editor = ed;

            // Register commands
            ed.addCommand('mceUmbracoAnchor', function () {
                ed.windowManager.open({
                    file: tinyMCE.activeEditor.getParam('umbraco_mce_controller_paths')['InsertAnchor'], 
                    width: 390 + parseInt(ed.getLang('anchor.delta_width', 0)),
                    height: 100 + parseInt(ed.getLang('anchor.delta_height', 0)),
                    inline: 1
                }, {
                    plugin_url: url
                });
            });

            // Register buttons
            ed.addButton('umbracoanchor', {
                title: 'anchor_desc',
                cmd: 'mceUmbracoAnchor'
            });
        },

        getInfo: function () {
            return {
                longname: 'Umbraco Anchor',
                author: 'Umbraco HQ',
                authorurl: 'http://umbraco.com',
                infourl: 'http://umbraco.com',
                version: '1.0'
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('umbracoanchor', tinymce.plugins.UmbracoAnchorPlugin);
})();
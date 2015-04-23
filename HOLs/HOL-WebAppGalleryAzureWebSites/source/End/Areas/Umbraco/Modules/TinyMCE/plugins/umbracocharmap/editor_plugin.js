(function () {
    tinymce.create('tinymce.plugins.UmbracoCharMapPlugin', {
        init: function (ed, url) {
            this.editor = ed;

            // Register commands
            ed.addCommand('mceUmbracoCharMap', function () {
                ed.windowManager.open({
                    file: tinyMCE.activeEditor.getParam('umbraco_mce_controller_paths')['InsertChar'],
                    width: 525 + parseInt(ed.getLang('charmap.delta_width', 0)),
                    height: 218 + parseInt(ed.getLang('charmap.delta_height', 0)),
                    inline: 1
                }, {
                    plugin_url: url
                });
            });

            // Register buttons
            ed.addButton('umbracocharmap', {
                title: 'charmap_desc',
                cmd: 'mceUmbracoCharMap'
            });
        },

        getInfo: function () {
            return {
                longname: 'Umbraco Char Map',
                author: 'Umbraco HQ',
                authorurl: 'http://umbraco.com',
                infourl: 'http://umbraco.com',
                version: '1.0'
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('umbracocharmap', tinymce.plugins.UmbracoCharMapPlugin);
})();
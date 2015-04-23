(function () {
    tinymce.create('tinymce.plugins.UmbracoMediaPlugin', {
        init: function (ed, url) {
            this.editor = ed;

            // Register commands
            ed.addCommand('mceUmbracoMedia', function () {
                var se = ed.selection;

                ed.windowManager.open({
                    file: tinyMCE.activeEditor.getParam('umbraco_mce_controller_paths')['InsertMedia'],
                    width: 645 + parseInt(ed.getLang('advlink.delta_width', 0)),
                    height: 460 + parseInt(ed.getLang('advlink.delta_height', 0)),
                    inline: 1
                }, {
                    plugin_url: url
                });
            });

            // Register buttons
            ed.addButton('umbracomedia', {
                title: 'umbracomedia.desc',
                cmd: 'mceUmbracoMedia'
            });

        },

        getInfo: function () {
            return {
                longname: 'Umbraco Media Plugin',
                author: 'Umbraco HQ',
                authorurl: 'http://umbraco.com',
                infourl: 'http://umbraco.com',
                version: '1.0'
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('umbracomedia', tinymce.plugins.UmbracoMediaPlugin);
})();
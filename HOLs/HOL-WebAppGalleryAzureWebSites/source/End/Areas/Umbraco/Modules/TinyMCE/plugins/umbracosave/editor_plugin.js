(function () {
    tinymce.create('tinymce.plugins.UmbracoSave', {
        init: function (ed, url) {
            var t = this;
            t.editor = ed;
            ed.addCommand('mceSave', t._save, t);
            ed.addShortcut('ctrl+s', ed.getLang('save.save_desc'), 'mceSave');
        },

        getInfo: function () {
            return {
                longname: 'Umbraco Save',
                author: 'Umbraco HQ',
                authorurl: 'http://umbraco.com',
                infourl: 'http://umbraco.com',
                version: "1.0"
            };
        },

        // Private methods
        _save: function () {
            // Just pass to the Umbraco save button
            $("*[data-shortcut*='ctrl S'][data-shortcut*='click']").trigger("click");
        }
    });

    // Register plugin
    tinymce.PluginManager.add('umbracosave', tinymce.plugins.UmbracoSave);
})();
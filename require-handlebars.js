define(['text', 'handlebars'], function (text, Handlebars) {

    var buildMap = {};

    return {

        load: function(name, parentRequire, onload, config) {

            text.get(
                parentRequire.toUrl(name + '.hbs'),
                function (data) {

                    if (config.isBuild) {

                        buildMap[name] = Handlebars.precompile(data);
                    }

                    onload(Handlebars.compile(data));
                },
                onload.error
            );
        },

        write: function(pluginName, moduleName, write) {

            if (moduleName in buildMap) {

                var templateSpec = buildMap[moduleName];

                write('define("' + pluginName + '!' + moduleName + '",' +
                    'function(){ return Handlebars.VM.template(' + templateSpec + ');});\n');
            }
        }
    };
});
var ts2gas = require('ts2gas');

module.exports = function (grunt) {

    function trinspileTs(tsFile, config) {
        var ts2gasConfig = grunt.file.readJSON(config).compilerOptions;
        var tsBody = grunt.file.read(tsFile);
        var jsBody = ts2gas(tsBody, ts2gasConfig);
        var jsFile = tsFile.substr(0, tsFile.lastIndexOf(".")) + ".js";
        grunt.file.write(jsFile, jsBody);
        grunt.file.delete(tsFile, jsBody);
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
            },
            service: {
                src: 'service/src/**/*.ts',
                dest: 'service/dist/main.ts'
            },
        },
        copy: {
            gs: {
                files: [
                    {
                        expand: true,
                        cwd: 'client/gs/',
                        src: ['appsscript.json', '*.js'],
                        dest: 'client/dist/gs/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        exec: {
            clasp_push: {
                cwd: 'client/gs',
                cmd: 'clasp push -f'
            },
            clasp_push_service: {
                cwd: 'service',
                cmd: 'clasp push -f'
            },
            clear_dist: "rm -r -f client/dist/gs",
            clear_service_dist: "rm -r -f service/dist",
            ng: {
                cwd: 'client',
                cmd: function (cmd) {
                    return `ng ${cmd}`;
                }

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exec');

    grunt.task.registerTask('clear:service', ['exec:clear_service_dist']);

    grunt.task.registerTask('copy:client:manifest', function () {
       grunt.file.copy('service/appsscript.json', 'service/dist/appsscript.json')
    });

    grunt.task.registerTask('compile', function (target) {
        if (target == "service") {
            trinspileTs("service/dist/main.ts", 'service/tsconfig.json');
        }
    });

    grunt.task.registerTask('build:client:gs', ['exec:clear_dist', 'copy:gs', 'exec:ng:build', 'build:client:gs:index']);

    grunt.task.registerTask('deploy:client', ['build:client:gs', 'exec:clasp_push']);

    grunt.task.registerTask('build:client:gs:index', function () {
        const indexHtmlPath = 'client/dist/client/index.html'
        var indexHtml = grunt.file.read(indexHtmlPath);

        const regex = new RegExp('<script type="text/javascript" src="(.+?)"></script>', 'g');

        const newBody = indexHtml.replace(regex, function (rep, g1) {
            const jsBody = grunt.file.read(`client/dist/client/${g1}`);
            return `<script type="text/javascript">${jsBody}</script>`;
        });
        grunt.file.write('client/dist/gs/index.html', newBody);
    });

    grunt.task.registerTask('build:service', ['clear:service', 'concat:service', 'compile:service', 'copy:client:manifest']);

    
    grunt.task.registerTask('deploy:service', ['build:service', 'exec:clasp_push_service']);
};
var ts2gas = require('ts2gas');

var deployments = {
    client: 'AKfycbwlsZiyzgpdfU8b2fCyYHr8pZW61_1lULFwuw3lJLUKxdnD4CY',
    service: 'AKfycbyBWAfpsxwPkcEotlivyAfiap8FgODlS3j7Eq8F8tAUtM8Kv7OH'
};

module.exports = function (grunt) {

    function trinspileTs(tsFile, config) {
        var ts2gasConfig = grunt.file.readJSON(config).compilerOptions;
        var tsBody = grunt.file.read(tsFile);
        var jsBody = ts2gas(tsBody, ts2gasConfig);
        var jsFile = tsFile.substr(0, tsFile.lastIndexOf(".")) + ".js";
        grunt.file.write(jsFile, jsBody);
        grunt.file.delete(tsFile, jsBody);
    };

    function embedJs(indexFileBody) {
        const regex = new RegExp('<script type="text/javascript" src="(.+?)"></script>', 'g');

        const newBody = indexFileBody.replace(regex, function (rep, g1) {
            const jsBody = grunt.file.read(`client/dist/client/${g1}`);
            return `<script type="text/javascript">${jsBody}</script>`;
        });

        return newBody;
    }

    function embedCss(indexFileBody) {
        const regex = new RegExp('<link rel="stylesheet" href="(.+?)">', 'g');

        const newBody = indexFileBody.replace(regex, function (rep, g1) {
            if (g1.startsWith('http'))
                return rep;

            const jsBody = grunt.file.read(`client/dist/client/${g1}`);
            return `<style type="text/css">${jsBody}</style>`;
        });

        return newBody;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
            },
            service: {
                src: [
                    'shared/**/*.ts',
                    'service/src/**/*.ts'
                ],
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
            clasp_push_client: {
                cwd: 'client/gs',
                cmd: 'clasp push -f'
            },
            clasp_push_service: {
                cwd: 'service',
                cmd: 'clasp push -f'
            },
            clasp_deploy_client: {
                cwd: 'client/gs',
                cmd: `clasp deploy -i ${deployments.client}`
            },
            clasp_deploy_service: {
                cwd: 'service',
                cmd: `clasp deploy -i ${deployments.service}`
            },
            clear_client_dist: "rm -r -f client/dist/gs",
            clear_service_dist: "rm -r -f service/dist",
            ng: {
                cwd: 'client',
                cmd: function (cmd) {
                    var isProd = !!grunt.option('prod');
                    var cmd = `ng ${cmd}`;

                    if (isProd)
                        cmd += ' --prod';

                    return cmd;
                }

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exec');

    grunt.task.registerTask('copy:client:manifest', function () {
        grunt.file.copy('service/appsscript.json', 'service/dist/appsscript.json')
    });

    grunt.task.registerTask('compile:service', function () {
        trinspileTs("service/dist/main.ts", 'service/tsconfig.json');
    });

    grunt.task.registerTask('compile:client:html', function () {
        const indexHtmlPath = 'client/dist/client/index.html'
        var indexHtml = grunt.file.read(indexHtmlPath);
        indexHtml = embedJs(indexHtml);
        indexHtml = embedCss(indexHtml);

        grunt.file.write('client/dist/gs/index.html', indexHtml);
    });


    grunt.task.registerTask('clear:service', ['exec:clear_service_dist']);
    grunt.task.registerTask('clear:client', ['exec:clear_client_dist']);



    grunt.task.registerTask('build:service', ['clear:service', 'concat:service', 'compile:service', 'copy:client:manifest']);

    grunt.task.registerTask('build:client', ['clear:client', 'copy:gs', 'exec:ng:build', 'compile:client:html']);

    // grunt.task.registerTask('publish:client', ['build:client', 'exec:clasp_push_client']);
    // grunt.task.registerTask('publish:service', ['build:service', 'exec:clasp_push_service']);

    grunt.task.registerTask('publish', function (target) {
        if (!target) {
            grunt.task.run(['publish:service', 'publish:client']);
            return;
        }

        grunt.task.run(`build:${target}`);
        grunt.task.run(`exec:clasp_push_${target}`);

        if (grunt.option('prod'))
            grunt.task.run(`exec:clasp_deploy_${target}`);
    });
};
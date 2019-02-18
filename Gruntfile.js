module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
            }
        },
        copy: {
            gs: {
                files: [
                    { 
                        expand: true,
                        cwd: 'client/gs/',
                        src: ['appsscript.json', '*.js'], 
                        dest: 'client/dist/gs/', 
                        filter: 'isFile' }
                ]
            }
        },
        exec: {
            clasp_push: {
                cwd: 'client/gs',
                cmd:'clasp push -f'
            },
            clear_dist: "rm -r -f client/dist/gs",
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

    grunt.task.registerTask('client:gs:build', ['exec:clear_dist', 'copy:gs', 'exec:ng:build', 'client:gs:build:index']);

    grunt.task.registerTask('client:gs:deploy', ['client:gs:build', 'exec:clasp_push']);

    grunt.task.registerTask('client:gs:build:index', function () {
        const indexHtmlPath = 'client/dist/client/index.html'
        var indexHtml = grunt.file.read(indexHtmlPath);

        const regex = new RegExp('<script type="text/javascript" src="(.+?)"></script>', 'g');

        const newBody = indexHtml.replace(regex, function (rep, g1) {
            const jsBody = grunt.file.read(`client/dist/client/${g1}`);
            return `<script type="text/javascript">${jsBody}</script>`;
        });
        grunt.file.write('client/dist/gs/index.html', newBody);
    });
};
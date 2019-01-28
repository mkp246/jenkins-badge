var package = require('./package');
var destFile = 'dist/' + package.name + '-' + package.version + '.tgz'

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    mode: 'tgz',
                    archive: destFile
                },
                files: [{
                    src: [
                        'api/**',
                        'badge/**',
                        'certs/**',
                        'config/**',
                        'lib/**',
                        'service/**',
                        '*',
                        'node_modules/debug/**',
                        'node_modules/ms/**',
                        'node_modules/express/**',
                        'node_modules/accepts/**',
                        'node_modules/mime-types/**',
                        'node_modules/mime-db/**',
                        'node_modules/negotiator/**',
                        'node_modules/array-flatten/**',
                        'node_modules/body-parser/**',
                        'node_modules/bytes/**',
                        'node_modules/http-errors/**',
                        'node_modules/inherits/**',
                        'node_modules/iconv-lite/**',
                        'node_modules/raw-body/**',
                        'node_modules/raw-body/node_modules/http-errors/**',
                        'node_modules/raw-body/node_modules/depd/**',
                        'node_modules/raw-body/node_modules/setprototypeof/**',
                        'node_modules/content-disposition/**',
                        'node_modules/content-type/**',
                        'node_modules/cookie/**',
                        'node_modules/cookie-signature/**',
                        'node_modules/depd/**',
                        'node_modules/encodeurl/**',
                        'node_modules/escape-html/**',
                        'node_modules/etag/**',
                        'node_modules/finalhandler/**',
                        'node_modules/unpipe/**',
                        'node_modules/fresh/**',
                        'node_modules/merge-descriptors/**',
                        'node_modules/methods/**',
                        'node_modules/on-finished/**',
                        'node_modules/ee-first/**',
                        'node_modules/parseurl/**',
                        'node_modules/path-to-regexp/**',
                        'node_modules/proxy-addr/**',
                        'node_modules/forwarded/**',
                        'node_modules/ipaddr.js/**',
                        'node_modules/qs/**',
                        'node_modules/range-parser/**',
                        'node_modules/safe-buffer/**',
                        'node_modules/send/**',
                        'node_modules/destroy/**',
                        'node_modules/mime/**',
                        'node_modules/serve-static/**',
                        'node_modules/setprototypeof/**',
                        'node_modules/statuses/**',
                        'node_modules/type-is/**',
                        'node_modules/media-typer/**',
                        'node_modules/utils-merge/**',
                        'node_modules/vary/**',
                        'node_modules/string-width/**',
                        'node_modules/is-fullwidth-code-point/**',
                        'node_modules/strip-ansi/**',
                        'node_modules/ansi-regex/**'
                    ]
                }, ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('package', ['compress']);
};

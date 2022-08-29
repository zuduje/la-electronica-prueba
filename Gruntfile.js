module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        cwd: 'src/views',  // set working folder / root to copy
                        src: '**/*',           // copy all files and subfolders
                        dest: 'built/views',    // destination folder
                        expand: true
                    },
                    {
                        cwd: 'src/public',  // set working folder / root to copy
                        src: '**/*',           // copy all files and subfolders
                        dest: 'built/public',    // destination folder
                        expand: true
                    }
                ]
            }
        },
        watch: {
            dev: {
                files: ['src/views/**/*.ejs','src/public/**/*'],
                tasks: ['copy']
            },
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
};
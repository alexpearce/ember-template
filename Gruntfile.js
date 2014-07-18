'use strict';

var LIVERELOAD_PORT = 35729;
var liveReloadSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  // Loads all Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Define names for folders used by tasks
  // * app: where your application files are stored,
  // * css/js: where your application CSS/JavaScript is stored *within* the app folder
  // * dist where the built application will be put
  // * tests: where tests live, with the spec/ folder underneath this
  var folders = {
    app: 'app',
    css: 'stylesheets',
    js: 'javascripts',
    dist: 'dist',
    tests: 'tests'
  };

  grunt.initConfig({
    folders: folders,
    // Define tasks to be run when files change
    watch: {
      emberTemplates: {
        files: '<%= folders.app %>/templates/**/*.hbs',
        tasks: ['emberTemplates']
      },
      compass: {
        files: ['<%= folders.app %>/<%= folders.css %>/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      neuter: {
        files: ['<%= folders.app %>/<%= folders.js %>/{,*/}*.js'],
        tasks: ['neuter']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '.tmp/<%= folders.js %>/*.js',
          '<%= folders.app %>/*.html',
          '{.tmp,<%= folders.app %>}/<%= folders.css %>/{,*/}*.css',
          '<%= folders.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // Start a connect webserver
    // Each key, other than options, defines a different server config
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              liveReloadSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, folders.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, folders.tests),
              mountFolder(connect, '.tmp')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, folders.dist)
            ];
          }
        }
      }
    },
    // Open the app URL
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    // Clean up the working directory
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= folders.dist %>',
            '!<%= folders.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    // Make sure our JS is nice
    // Flags set in options.jshintrc
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= folders.app %>/<%= folders.js %>/{,*/}*.js',
        '!<%= folders.app %>/<%= folders.js %>/vendor/*',
        '<%= folders.tests %>/spec/{,*/}*.js'
      ]
    },
    // Test runner
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    // Sass compilation and mixins
    compass: {
      options: {
        sassDir: '<%= folders.app %>/<%= folders.css %>',
        cssDir: '.tmp/<%= folders.css %>',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= folders.app %>/images',
        javascriptsDir: '<%= folders.app %>/<%= folders.js %>',
        fontsDir: '<%= folders.app %>/<%= folders.css %>/fonts',
        importPath: '<%= folders.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/<%= folders.css %>/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // Static asset revisioning
    rev: {
      dist: {
        files: {
          src: [
            '<%= folders.dist %>/<%= folders.js %>/{,*/}*.js',
            '<%= folders.dist %>/<%= folders.css %>/{,*/}*.css',
            '<%= folders.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= folders.dist %>/<%= folders.css %>/fonts/*'
          ]
        }
      }
    },
    // Use special HTML comment syntax to substitute files with their minified and revisioned versions
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= folders.dist %>'
      }
    },
    usemin: {
      html: ['<%= folders.dist %>/{,*/}*.html'],
      css: ['<%= folders.dist %>/<%= folders.css %>/{,*/}*.css'],
      options: {
        dirs: ['<%= folders.dist %>']
      }
    },
    // Image minifier
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= folders.dist %>/images'
        }]
      }
    },
    // SVG minifier
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= folders.dist %>/images'
        }]
      }
    },
    // CSS minifier
    cssmin: {
      dist: {
        files: {
          '<%= folders.dist %>/<%= folders.css %>/main.css': [
            '.tmp/<%= folders.css %>/{,*/}*.css',
            '<%= folders.app %>/<%= folders.css %>/{,*/}*.css'
          ]
        }
      }
    },
    // HTML minifier
    htmlmin: {
      dist: {
        options: {},
        files: [{
          expand: true,
          cwd: '<%= folders.app %>',
          src: '*.html',
          dest: '<%= folders.dist %>'
        }]
      }
    },
    // Replace @@var variables with their substitutions
    // We use this for switching between dev and production Ember scripts
    replace: {
      app: {
        options: {
          variables: {
            ember: 'bower_components/ember/ember.js',
            ember_data: 'bower_components/ember-data/ember-data.js'
          }
        },
        files: [{
          src: '<%= folders.app %>/index.html',
          dest: '.tmp/index.html'
        }]
      },
      dist: {
        options: {
          variables: {
            ember: 'bower_components/ember/ember.prod.js',
            ember_data: 'bower_components/ember-data/ember-data.prod.js'
          }
        },
        files: [{
          src: '<%= folders.app %>/index.html',
          dest: '.tmp/index.html'
        }]
      }
    },
    // Copy all files not handled by other tasks when distributing
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= folders.app %>',
          dest: '<%= folders.dist %>',
          src: [
            '*.{ico,txt}',
            'images/{,*/}*.{webp,gif}',
            '<%= folders.css %>/fonts/*'
          ]
        }]
      }
    },
    // Run slow tasks concurrently
    concurrent: {
      server: [
        'emberTemplates',
        'compass:server'
      ],
      test: [
        'emberTemplates',
        'compass'
      ],
      dist: [
        'emberTemplates',
        'compass:dist',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    // Compiles Ember templates from source (value) to destination (key)
    emberTemplates: {
      options: {
        templateName: function (sourceFile) {
          var templatePath = folders.app + '/templates/';
          return sourceFile.replace(templatePath, '');
        }
      },
      dist: {
        files: {
          '.tmp/<%= folders.js %>/compiled-templates.js': '<%= folders.app %>/templates/**/*.hbs'
        }
      }
    },
    // Join Javascripts in the order they are `require`'d
    // Files are joined safely by being wrapped in IIFEs
    neuter: {
      app: {
        options: {
          filepathTransform: function (filepath) {
            return folders.app + '/' + filepath;
          }
        },
        src: '<%= folders.app %>/<%= folders.js %>/app.js',
        dest: '.tmp/<%= folders.js %>/combined-scripts.js'
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'replace:app',
      'concurrent:server',
      'neuter:app',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'replace:app',
    'concurrent:test',
    'connect:test',
    'neuter:app',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'replace:dist',
    'useminPrepare',
    'concurrent:dist',
    'neuter:app',
    'concat',
    'cssmin',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};

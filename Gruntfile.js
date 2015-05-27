(function () {
  'use strict';
}());

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      build: {
        cwd: 'source',
        src: [ '**',
          '!**/*.sass',
          '!**/*.scss',
          '!**/*.jade',
          '!**/*.md',
          '!sass/**',
          '!jade',
          '!jade/templates.html',
          '!scripts/nori/**/*.js',
          '!scripts/tt/**/*.js',
          '!scripts/nudoru/**/*.js',
          '!scripts/vendor/**/*.js',
          '!scripts/vendor/**/*.map',
          '!scripts/app.js',
          'scripts/config.js'
        ],
        dest: 'deploy',
        expand: true,
        filter: 'isFile'
      }
    },

    clean: {
      build: {
        src: [ 'deploy' ]
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'source/sass',
          cssDir: 'deploy/css',
          environment: 'production',
          //compressed, expanded
          outputStyle: 'expanded'
        }
      }
    },

    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['deploy/css/app.css']
      }
    },

    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [ {
          cwd: "source/jade",
          src: "index.jade",
          dest: "deploy/",
          expand: true,
          ext: ".html"
        } ]
      }
    },

    concat: {
      options: {
        stripBanners: true,
        sourceMap: true,
        separator: ';'
        //banner: "'use strict';\n",
        //banner: "(function () {'use strict';}());\n",
        //process: function(src, filepath) {
        //  return '// Source: ' + filepath + '\n' +
        //    src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        //}
      },
      dist: {
        src: [
          'source/scripts/vendor/gsap/TweenLite.min.js',
          'source/scripts/vendor/gsap/utils/Draggable.min.js',
          'source/scripts/vendor/gsap/TimeLineLite.min.js',
          'source/scripts/vendor/gsap/easing/EasePack.min.js',
          'source/scripts/vendor/gsap/plugins/CSSPlugin.min.js',
          'source/scripts/vendor/lodash.min.js',
          'source/scripts/vendor/rxjs/rx.lite.compat.min.js',
          'source/scripts/vendor/object-observe.min.js',
          'source/scripts/vendor/taffy-min.js',

          'source/scripts/nudoru/require.js',
          'source/scripts/nudoru/utils/*.js',
          'source/scripts/nudoru/events/*.js',
          'source/scripts/nudoru/components/*.js',

          'source/scripts/nori/events/*.js',
          'source/scripts/nori/model/modules/*.js',
          'source/scripts/nori/model/*.js',
          'source/scripts/nori/view/modules/*.js',
          'source/scripts/nori/view/*.js',
          'source/scripts/nori/controller/*.js',
          'source/scripts/nori/controller/commands/*.js',
          'source/scripts/nori/Nori.js',

          'source/scripts/tt/**/*.js',

          'source/scripts/app.js'
        ],
        dest: 'deploy/scripts/libs.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        beautify: false,
        mangle: true,
        sourceMap: ''
      },
      dist: {
        files: {
          'deploy/scripts/libs.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: ['source/scripts/nudoru/*.js', 'source/scripts/nori/**/*.js'],
      options: {
        '-W014': true,
        '-W061': true,
        force: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        //maxstatements: 15,
        maxdepth: 2,
        maxcomplexity: 5,
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },


    connect: {
      server: {
        options: {
          port: 9001,
          base: 'deploy'
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },

      html: {
        files: ['source/jade/**/*.jade'],
        tasks: ['jade'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['source/sass/**/*.sass', 'source/sass/**/*.scss'],
        tasks: ['compass'],
        options: {
          spawn: false
        }
      },
      js: {
        files: ['source/scripts/**/*.js'],
        tasks: ['concat', 'uglify', 'jshint'],
        options: {
          spawn: false
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['clean', 'copy', 'compass', 'jade', 'concat', 'uglify', 'jshint', 'connect', 'watch']);
};
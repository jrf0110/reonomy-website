var fs = require('fs');
var async = require('async');
var wrench = require('wrench');
var jsdom = require('jsdom');
var childProcess = require('child_process');

module.exports = function( grunt ){
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  var config = {
    pkg: grunt.file.readJSON('package.json')

  , watch: {
      jshint: {
        // Concat jshint.all
        files: [],
        tasks: ['jshint'],
        options: { spawn: false }
      }

    , less: {
        files: [ 'less/*.less', 'less/**/*.less' ]
      , tasks: ['less']
      , options: { spawn: false }
      }
    }

  , less: {
      dev: {
        files: {
          "css/core.gen.css":          "less/core.less"
        , "css/ielt9.gen.css":         "less/ielt9.less"
        , "css/ielte9.gen.css":        "less/ielte9.less"
        }
      }
    }

  , jshint: {
      // define the files to lint
      all: ['*.js', 'js/*.js', 'js/**/*.js'],
      options: {
        ignores: ['node_modules', 'jam/**', 'bower_components/**'],
        laxcomma: true,
        sub: true,
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }

  , connect: {
      server: {
        options: {
          port: 8081
        }
      }
    }

  , mkdir: {
      build: {
        dir: [
          './build', './build/js'
        , './build/bower_components'
        // , './build/bower_components/colorbox'
        // , './build/bower_components/html5shiv'
        ]
      }
    }

  , copy: {
      build: {
        files: [
          { expand: true, src: ['./css/*'], dest: './build' }
        , { expand: true, src: ['./img/*'], dest: './build' }
        , { expand: true, src: ['./font/*'], dest: './build' }
        , { expand: true, src: ['*.html'], dest: './build' }
        , { expand: true, src: ['./bower_components/colorbox/example1/*'], dest: './build' }
        , { expand: true, src: ['./bower_components/colorbox/example1/images/*'], dest: './build' }
        , { expand: true, src: ['./bower_components/html5shiv/dist/*'], dest: './build' }
        ]
      }
    }

  , rmscripts: {
      build: {
        src: [ 'build/*.html' ]
      }
    }

  , addscripts: {
      build: {
        scripts: [ '/js/bundle.js' ]
      , src: [ './build/*.html' ]
      }
    }

  , concat: {
      build: {
        // TODO: get this dynamically with jsdom
        src: [
          "js/normalize.js"
        , "bower_components/jquery/jquery.js"
        , "bower_components/superscrollorama/js/jquery.superscrollorama.js"
        , "bower_components/superscrollorama/js/greensock/TweenLite.min.js"
        , "bower_components/moment/moment.js"
        , "bower_components/lodash/dist/lodash.js"
        , "bower_components/colorbox/jquery.colorbox.js"
        , "js/components/component.active-interval.js"
        , "js/components/component.navbar.js"
        , "js/components/component.photo-viewer.js"
        , "js/components/component.reonomy-modal.js"
        , "js/components/component.employee-modal.js"
        , "js/init-login.js"
        ]

      , dest: './build/js/bundle.js'
      }
    }

  , uglify: {
      options: { /*mangle: false*/ }
    , build: {
        files: {
          'build/js/bundle.js': [ 'build/js/bundle.js' ]
        }
      }
    }
  };

  config.watch.jshint.files = config.watch.jshint.files.concat(
    config.jshint.all
  );

  grunt.initConfig( config );

  grunt.registerTask( 'default', [
    'jshint'
  , 'less'
  , 'connect'
  , 'watch'
  ]);

  grunt.registerTask( 'build', [
    'jshint'
  , 'less'
  , 'mkdir:build'
  , 'copy:build'
  , 'concat:build'
  , 'uglify:build'
  , 'rmscripts:build'
  , 'addscripts:build'
  ]);

  grunt.registerMultiTask( 'mkdir', function(){
    this.data.dir.forEach( function( dir ){
      // Remove if it currently exists
      if ( fs.existsSync( dir ) ) wrench.rmdirSyncRecursive( dir );

      fs.mkdirSync( dir );
    });
  });

  // TODO: just use jsdom
  grunt.registerMultiTask( 'rmscripts-OLD', function(){
    // If script has src, remove it
    var search = /<script.*src=\".*<\/script>\n*/g;
    var replacement = this.data.replaceWith || '';
    grunt.file.expand( this.data.src ).forEach( function( file, i, files ){
      var contents = fs.readFileSync( file ).toString();
      contents = contents.replace( search, replacement );
      fs.writeFileSync( file, contents );
    });
  });

  grunt.registerMultiTask( 'rmscripts', function(){
    var done = this.async();
    var replacement = this.data.replaceWith || '';

    async.series(
      grunt.file.expand( this.data.src ).map( function( file ){
        return function( next ){
          jsdom.env( file, ["http://code.jquery.com/jquery.js"], function( errors, window ){
            var doc = window.document;
            var $ = window.$;
            var $scripts = $('script').filter( function( s ){
              return !!$(this).attr('src');
            });
            $scripts.last().after( doc.createTextNode( replacement ) );
            $scripts.remove();

            fs.writeFileSync( file, [
              '<!DOCTYPE HTML>'
            , '<html>'
            , '  <head>'
            , doc.head.innerHTML
            , '  </head>'
            , '  <body class="' + doc.body.className + '">'
            , doc.body.innerHTML
            , '  </body>'
            , '</html>'
            ].join('\n'));

            next();
          });
        };
      })
    , function( error ){ done( !error ); }
    );
  });

  // TODO: just use jsdom
  grunt.registerMultiTask( 'addscripts-OLD', function(){
    var after = this.data.after;
    var paths = this.data.scripts;
    var tmpl = '<script type="text/javascript" src="{{path}}"></script>';

    grunt.file.expand( this.data.src ).forEach( function( file ){
      var contents = fs.readFileSync( file ).toString();

      contents = contents.replace(
        after
      , [ after ].concat( paths.map( function( path ){
          return tmpl.replace( '{{path}}', path );
        })).join('\n')
      );

      fs.writeFileSync( file, contents );
    });
  });

  grunt.registerMultiTask( 'addscripts', function(){
    var done = this.async();
    var paths = this.data.scripts;
    var tmpl = '<script type="text/javascript" src="{{path}}"></script>';

    async.series(
      grunt.file.expand( this.data.src ).map( function( file ){
        return function( next ){
          jsdom.env( file, ["http://code.jquery.com/jquery.js"], function( errors, window ){
            var doc = window.document;
            var $ = window.$;
            var $scripts = $();

            paths.reverse().forEach( function( p ){
              $scripts = $scripts.add(
                $( tmpl.replace( '{{path}}', p ) )
              );
            });

            $('script').eq(0).before( $scripts );

            fs.writeFileSync( file, [
              '<!DOCTYPE HTML>'
            , '<html>'
            , '  <head>'
            , doc.head.innerHTML
            , '  </head>'
            , '  <body class="' + doc.body.className + '">'
            , doc.body.innerHTML
            , '  </body>'
            , '</html>'
            ].join('\n'));

            next();
          });
        };
      })
    , function( error ){ done( !error ); }
    );
  });
};

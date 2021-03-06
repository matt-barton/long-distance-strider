module.exports = function(grunt){
  grunt.initConfig({
    concat: {
      options: {
        process: function(src, path){
          return '\n/* Source: ' + path + ' */\n' + src;
        }
      },
      dist: {
        src: [ 'client/src/js/*.js' ],
        dest: 'client/build/built.js'
      } 
    },
    uglify: {
      dist: {
        src: 'client/build/built.js',
        dest: 'client/public/js/app.js'
      }
    },
    watch: {
      options: {
        atBegin: true,
        event: ['all']
      },
      src: {
        files: 'client/src/js/*.js',
        tasks: ['concat']
      },
      dist: {
        files: 'client/build/built.js',
        tasks: ['uglify']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};
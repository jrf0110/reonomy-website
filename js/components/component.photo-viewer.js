/**
 * Component.PhotoViewer
 */

;(function(){
  'use strict';

  $.fn.photoViewer = function( options ){
    var $this   = this;
    var $items  = $this.find('li');
    var $holder = $this.find('.photo-wrapper');
    var $photos = $();

    var defaults = {
      // Interval to automatically go to next photo for
      // browsers that do not support the scrolling
      interval:   5000
      // Pixel interval to go to next photo for browsers
      // that support the scrolling
    , pxInterval: 200
    , scrollMode: true
    };

    options = $.extend( {}, defaults, options );

    // Intial setup - copy img's from the nav to the holder
    $items.each( function(){
      var $clone = $(this).find('img').clone();
      $photos = $photos.add( $clone );
      $holder.append( $clone );
    });

    var viewer = {
      curr: -1

    , start: function(){
        viewer._tick();
        return $this;
      }

    , stop: function(){
        clearTimeout( viewer.timeout );
        return $this;
      }

    , go: function( index ){
        if ( index >= $items.length ) return;
        if ( index < 0 ) return;

        viewer.clearCurrent();
        viewer.curr = index;
        viewer.setCurrent();
      }

    , next: function(){
        viewer.go( viewer.curr + 1 );
      }

    , prev: function(){
        viewer.go( viewer.curr - 1 );
      }

    , clearCurrent: function(){
        $items.eq( viewer.curr ).removeClass('active');
        $photos.eq( viewer.curr ).removeClass('active');
      }

    , setCurrent: function(){
        $items.eq( viewer.curr ).addClass('active');
        $photos.eq( viewer.curr ).addClass('active');
        $holder.css({
          'width': $photos.eq( viewer.curr ).width() + 'px'
        , 'height': $photos.eq( viewer.curr ).height() + 'px'
        });
      }

    , _tick : function(){
        if ( viewer.curr >= ($items.length - 1) ) viewer.curr = -1;

        viewer.next();

        viewer.timeout = setTimeout( viewer._tick, options.interval );
      }
    };

    if ( !options.scrollMode ){
      viewer.start();
    } else {
      // $this.waypoint( function(){
      //   $this.addClass('')
      // });
    }

    return viewer;
  };
})();
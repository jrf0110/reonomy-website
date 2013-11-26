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
    , onSlide: function( i, viewer ){}
    };

    options = $.extend( {}, defaults, options );

    // Intial setup - copy img's from the nav to the holder
    $items.each( function( i ){
      var $clone = $(this).find('img').clone();
      $clone.addClass('photo');
      $photos = $photos.add( $clone );
      $holder.append( $clone );

      // Make static clone to fix heights
      $clone = $clone.clone();
      $clone.removeClass('photo');
      $clone.addClass('active-static');
      $holder.append( $clone );

      // Setup click handler
      $(this).click( function(){
        viewer.go( i );
        if ( viewer.timeout ){
          viewer.stop();
          viewer.setTick();
        }
      });
    });

    $holder.click( function(){
      if ( viewer.curr >= ($items.length - 1) ) viewer.curr = -1;
      viewer.next();
    });

    var viewer = {
      curr: -1

    , start: function(){
        viewer.setCurrent();
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

        options.onSlide( viewer.curr, viewer );
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
      }

    , setTick: function(){
        viewer.timeout = setTimeout( viewer._tick, options.interval );
      }

    , _tick : function(){
        if ( viewer.curr >= ($items.length - 1) ) viewer.curr = -1;

        viewer.next();
        viewer.setTick();
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
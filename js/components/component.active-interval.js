/**
 * Applies an `active` class to a set of elements
 * one at a time at a specific interval.
 * 
 * Usage:
 * 
 *  $('.my-sayings > li').activeRotate({
 *    interval: 3000
 *  }).start();
 *
 * The plugin returns an interface for handling the rotation
 *
 * Methods:
 *
 * start|stop|go|next|prev|setTick
 * 
 * @param  {Object} options Optional options
 * @return {Object}         Interface for interval
 */

;(function(){
  'use strict';

  $.fn.activeInterval = function( options ){
    var $this = this;

    var defaults = {
      interval:   5000
    , className:  'active'
    };

    options = $.extend( {}, defaults, options );

    var interval = {
      curr: -1

    , start: function(){
        interval._tick();
        return $this;
      }

    , stop: function(){
        clearTimeout( interval.timeout );
        return $this;
      }

    , go: function( index ){
        if ( index >= $this.length ) return;
        if ( index < 0 ) return;

        $this.eq( interval.curr ).removeClass( optinos.className );
        interval.curr = index;
        $this.eq( interval.curr ).addClass( optinos.className );
      }

    , next: function(){
        interval.go( interval.curr + 1 );
      }

    , prev: function(){
        interval.go( interval.curr - 1 );
      }

    , setTick: function(){
        interval.timeout = setTimeout( interval._tick, options.interval );
      }

    , _tick : function(){
        if ( interval.curr >= ($this.length - 1) ) interval.curr = -1;

        interval.next();
        interval.setTick();
      }
    };

    return interval;
  };
})();
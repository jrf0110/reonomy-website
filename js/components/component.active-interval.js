/**
 * Applies an `active` class to a set of elements
 * one at a time at a specific interval.
 * 
 * Usage:
 * 
 *  $('.my-sayings > li').activeInterval({
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
    , upNext:     'up-next'
    , onTickBefore: function( interval ){}
    , onRotate:     function( $el, interval ){}
    };

    options = $.extend( {}, defaults, options );
console.log(options.interval)
    var interval = {
      curr: -1

    , options: options

    , $els: $this

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

        $this.eq( interval.curr ).removeClass( options.className );
        $this.eq( (interval.curr + 1) % $this.length ).removeClass( options.upNext );

        interval.curr = index;

        $this.eq( interval.curr ).addClass( options.className );
        $this.eq( (interval.curr + 1) % $this.length ).addClass( options.upNext );

        options.onRotate( $this.eq( interval.curr ), interval );
      }

    , next: function(){
        interval.cycleCurr();
        interval.go( interval.curr + 1 );
      }

    , prev: function(){
        interval.cycleCurr();
        interval.go( interval.curr - 1 );
      }

    , setTick: function(){
        interval.timeout = setTimeout( interval._tick, options.interval );
      }

    , cycleCurr: function(){
        if ( interval.curr >= ($this.length - 1) ) interval.curr = -1;
        if ( interval.curr < -1 ) interval.curr = $this.length - 1;
      }

    , _tick : function(){
        interval.cycleCurr();
        options.onTickBefore( interval );
        interval.next();
        interval.setTick();
      }
    };

    return interval;
  };
})();
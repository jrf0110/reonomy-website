/**
 * Component.TextRotator
 */

;(function(){
  'use strict';

  $.fn.rotator = function( options ){
    var $this = this;
    var $items = $this.find('> *');

    var defaults = {
      interval: 5000
    };

    options = $.extend( {}, defaults, options );

    var rotator = {
      curr: 0

    , start: function(){
        rotator._tick();
        return $this;
      }

    , stop: function(){
        clearTimeout( rotator.timeout );
        return $this;
      }

    , hideActive: function(){
        rotator.$active.removeClass('active');
        return $this;
      }

    , showActive: function(){
        rotator.$active.addClass('active');
        return $this;
      }

    , _tick : function(){
        if ( rotator.$active ) rotator.hideActive();

        if ( rotator.curr >= $items.length ) rotator.curr = 0;

        rotator.$active = $items.eq( rotator.curr++ );
        rotator.showActive();

        rotator.timeout = setTimeout( rotator._tick, options.interval );
      }
    };

    rotator.start();

    return rotator;
  };
})();
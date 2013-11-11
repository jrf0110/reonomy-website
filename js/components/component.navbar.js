/**
 * Component.Navbar
 *
 * Applies the navbar onScroll show demo btn stuff
 *
 * Returns an interface to control the navbar:
 *   Methods: show|hide|start|stop
 * 
 * Options:
 *   `showDemoAt` - ScrollY to show the demo btn
 *   `throttle`   - How often do we execute the scroll listener
 */

;(function(){
  'use strict';

  // Little bit ghetto, but ensure that if the component
  // consumer calls the plugin more than once, we're not
  // re-adding scroll listeners
  var prevListener;

  $.fn.reonomyNavbar = function( options ){
    var $this = this;

    var defaults = {
      showDemoAt: 500
    , throttle: 25
    };

    options = $.extend( {}, defaults, options );

    // Register nav expansion handler
    $this.find('.nav').click( function( e ){
      // Ensure original target is the nav not `li` or `a`
      if ( !$(e.currentTarget).hasClass('nav') ) return;
      $this.find('.nav').toggleClass('collapsed');
    });

    var navbar = {
      isShowing: false

    , show: function(){
        $this.removeClass('hide-demo-btn');
        navbar.isShowing = true;
        return $this;
      }

    , hide: function(){
        $this.addClass('hide-demo-btn');
        navbar.isShowing = false;
        return $this;
      }

    , start: function(){
        $( window ).scroll( navbar._listener );
        return $this;
      }

    , stop: function( listener ){
        $( window ).off( listener || navbar._listener );
        return $this;
      }

    , _listener: _.throttle( function( e ){
        if ( window.scrollY < options.showDemoAt ){
          if ( !navbar.isShowing ) return;
          navbar.hide();
        } else if ( !navbar.isShowing ){
          navbar.show();
        }
      })
    };

    if ( prevListener ) navbar.stop( prevListener );

    prevListener = navbar._listener;

    return navbar;
  };
})();
/**
 * Reonomy Modal
 */

;(function(){
  'use strict';

  $.fn.reonomyModal = function( options ){
    var $this = this;

    var defaults = {
      modalSelector: '.reonomy-modal'
    , closeHandle:   '<span class="close-handle">&times;</span>'
    , footerSelector: '.footer'
    , onClose: function(){}
    };

    options = $.extend( {}, defaults, options );

    var $modal = $( options.modalSelector );
    var $footer = $( options.footerSelector );

    // Ensure modal is in document
    if ( $modal.length === 0 ){
      $modal = $([
        '<div class="'
      , options.modalSelector.replace(/\./g, ' ').trim() 
      , '"></div>'
      ].join(''));

      $(document.body).prepend($modal);
    }

    // Preload all large-photos
    $this.find( options.photoSelector ).each( function(){
      var img = document.createElement('img');
      img.src = $(this).data( options.largePhotoKey );
    });

    // Listen for the `esc` key
    $(document).keyup( function( e ){
      if ( e.keyCode !== 27 ) return;

      modal.close();
    });

    var modal = {
      $el: $modal

    , open: function(){
        var $close = $(options.closeHandle);

        $close.click( modal.close );

        $modal.html( $this.html() );
        $modal.append( $close );

        if ( !$modal.find('.modal-photo').length && 'photo' in options ){
          var $wrapper = $('<div class="photo-wrapper" />');
          var $photo = $('<img src="' + options.photo + '" />');
          $photo.addClass('modal-photo');
          $wrapper.append( $photo );
          $modal.prepend( $wrapper );
        }

        if ( $modal.find('.modal-photo').length ){
          $modal.find('.photo-wrapper').css({
            'background-image': "url('" + $modal.find('.modal-photo').attr('src') + "')"
          });
        }

        $modal.addClass('show');
      }

    , close: function(){
        $modal.removeClass('show');
        options.onClose();
      }
    };

    return modal;
  };
})();
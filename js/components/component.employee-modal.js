/**
 * Employee Modal
 */

;(function(){
  'use strict';

  $.fn.employeeModal = function( options ){
    var $this = this;

    var defaults = {
      modalSelector: '.employee-modal'
    , photoSelector: '.employee-photo'
    , largePhotoKey: 'large-photo'
    , closeHandle:   '<span class="close-handle">&times;</span>'
    };

    options = $.extend( {}, defaults, options );

    var $modal = $( options.modalSelector );
    var $footer = $('.footer');

    // Preload all large-photos
    $this.find( options.photoSelector ).each( function(){
      var img = document.createElement('img');
      img.src = $(this).data( options.largePhotoKey );
    });

    // Listen for the `esc` key
    $(document).keyup( function( e ){
      if ( e.keyCode !== 27 ) return;

      $modal.removeClass('show');
    });

    $this.click( function( e ){
      // Copy over HTML contents to modal
      // Set the headshot photo to the large photo
      var $el = $( '<div>' + e.currentTarget.innerHTML + '</div>' );
      var $photo = $el.find( options.photoSelector );
      var $close = $(options.closeHandle);
      var footerHeight = $footer.height();

      $close.click( function(){ $modal.removeClass('show'); });
      $photo.attr( 'src', $photo.data( options.largePhotoKey ) );
      $modal.html( $el.html() );

      $modal.find('.photo-wrapper').css({
        'background-image': [ "url('", $photo.data( options.largePhotoKey ), "')" ].join('')
      });

      $modal.css({
        'padding-bottom': footerHeight
      });

      $modal.find('.employee-bio').css({
        bottom: footerHeight + 40
      });

      $modal.append( $close );
      $modal.addClass('show');
    });
  };
})();
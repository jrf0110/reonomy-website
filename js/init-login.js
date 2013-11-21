$(function(){
  $('.login-toggle').click( function( e ){
    e.preventDefault();
    $('.login-wrapper').toggleClass('active');
    $(this).parents('li').eq(0).toggleClass('active');
  });
});
$(document).ready(function(){
  $('#corps').css('opacity', 0);
  $('#menu-gauche').css('left', '-900px');
  $('#menu-gauche').animate({
    'left': 0
  },1000, function(){
    $('#corps').animate({
      'opacity' : 1
    }, 800);
  });
});

(function($) {
 "use strict"; // Start of use strict

 // jQuery for page scrolling feature - requires jQuery Easing plugin
 $('a.page-scroll').bind('click', function(event) {
   var $anchor = $(this);
   $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50)
   }, 1250, 'easeInOutExpo');
  event.preventDefault();
 });

 // Highlight the top nav as scrolling occurs
 $('body').scrollspy({
   target: '.navbar-fixed-top',
   offset: 150
 });

 // Closes the Responsive Menu on Menu Item Click
 $('.navbar-collapse ul li a').click(function(){
   $('.navbar-toggle:visible').click();
 });

 // Offset for Main Navigation
 $('#mainNav').affix({
   offset: {
      top: 100
   }
 });

})(jQuery); // End of use strict


var scrolly = 0;
var ticking = false;

function remplissage(position_scroll) {
  if(scrolly < 1650 && scrolly > 1380){
    $('.progress .progress-bar').css("width",
      function() {
        return $(this).attr("aria-valuenow") + "%";
      });
  }
  if(scrolly < 200 || scrolly > 2100) {
    $('.progress .progress-bar').css("width",0);
  }
}


window.addEventListener('scroll', function(e) {
  scrolly = window.scrollY;
  console.log(window.scrollY);
  if (!ticking) {
    window.requestAnimationFrame(function() {
      remplissage(scrolly);
      ticking = false;
    });
  }
  ticking = true;
});

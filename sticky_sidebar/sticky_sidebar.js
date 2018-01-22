/*
* Fix sidebar at some point and remove
* fixed position at content bottom
*/
jQuery("document").ready(function($){
  $.fn.scrollBottom = function() {
    return $(document).height() - this.scrollTop() - this.height();
  };
  var $window = $(window);
  var visibleFoot = $window.scrollBottom();
  var nav = $('#secondary');
  var header = $('#masthead');
  var footerTop = $('footer').offset().top;
  var footerHeight = $('#colophon').offset().top - $('#content').height() - $('#masterhead').height() + 70;
  var navHeight = $('#masterhead').outerHeight();
  var sidebar = $('#secondary');
  var sideStop = 1000;
  var stopPoint = footerTop - navHeight - 0 ;
  var gap = $window.height() - sidebar.height();
  var sidebartoFooter = visibleFoot;
  $(window).scroll(function () {
      if (window.scrollY >= sidebar.height() - $window.height() + header.height() + header.height() + 20) {
          nav.addClass("ultimos-videos-fixed"); 
      } else {
          nav.removeClass("ultimos-videos-fixed");
		 // document.body.style.paddingTop = 0;
      } 
	  if ($(this).scrollBottom() <= footerHeight) {
          nav.addClass("ultimos-videos-stop");
      } else {
          nav.removeClass("ultimos-videos-stop");
      }
  });
});

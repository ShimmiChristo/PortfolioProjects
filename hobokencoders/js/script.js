$("#share").jsSocials({
            shares: ["email", "twitter", "facebook", "googleplus", "linkedin", "pinterest", "stumbleupon", "whatsapp"]
        });

/***************************
COMMENTS BUTTON HIDE/SHOW
***************************/
$(".button-comments").click(function(){
    $("#comments").fadeToggle("slow");
});

/***************************
    NAV BAR ACTIVE HREF
***************************/
$(function(){
$('#main-nav a').each(function() {
    if ($(this).prop('href') == window.location.href) {
        $(this).css("color", "white");
        $(this).addClass('nav-active');
    }
  });
});

/***************************
    NAV BAR HIDE/SHOW
***************************/
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.header-nav').outerHeight();

// on scroll, let the interval function know the user has scrolled
$(window).scroll(function(event){
  didScroll = true;
});

// run hasScrolled() and reset didScroll status
setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
        
    // If current position > last position AND scrolled past navbar...
    if (st > lastScrollTop && st > navbarHeight){
      // Scroll Down
      $('.header-nav').removeClass('header-down').addClass('header-up');
    } else {
      // Scroll Up
      // If did not scroll past the document (possible on mac)...
      if(st + $(window).height() < $(document).height()) { 
        $('.header-nav').removeClass('header-up').addClass('header-down');
      }
    }
    lastScrollTop = st;
}

/***************************
        SIDE BAR
***************************/
$(function() {
  $.fn.scrollBottom = function() {
    return $(document).height() - this.scrollTop() - this.height();
  };

  var $el = $('.aside-sidebar');
  var $window = $(window);
  var top = $el.position().top;

  $window.bind("scroll resize", function() {
    var gap = $window.height() - $el.height();
    var visibleFoot = 160 - $window.scrollBottom();
    var scrollTop = $window.scrollTop();

    if (scrollTop <= top ) {
      $el.css({
        position: "fixed",
        top: (top - scrollTop) + "px",
        right: "5%",
        bottom: "auto"
      });
    } else if (visibleFoot > gap) {
      $el.css({
        position: "fixed",
        right: "5%",
        top: "auto",
        bottom: visibleFoot + "px"
      });
    } else {
      $el.css({
        position: "fixed",
        right: "5%",
        top: 20,
        bottom: "auto"
      });
    }
  }).scroll();
});



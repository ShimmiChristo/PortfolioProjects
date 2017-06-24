// var box = document.getElementById("box").value;

function edit(x){
    document.getElementById("usr").value += x;
}
function ce(){
    document.getElementById("calc").reset();
}
function answer(){
   var total = document.getElementById("usr").value;
    document.getElementById("usr").value = eval(total);
}

$(function(){
  'use strict';
  var $page = $('#main'),
      options = {
        debug: true,
        prefetch: true,
        cacheLength: 4,
        onStart: {
          duration: 600, // Duration of our animation
          render: function ($container) {
            // Add your CSS animation reversing class
            // $container.addClass('pt-page-moveToLeftEasing');
            $container.addClass('is-exiting');
            // Restart your animation
            smoothState.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 0,
          render: function ($container, $newContent) {
            // Remove your CSS animation reversing class
            // $container.removeClass('pt-page-moveToLeftEasing');
            $container.removeClass('is-exiting');
            // Inject the new content
            $container.html($newContent);
          }
        }
      },
      smoothState = $page.smoothState(options).data('smoothState');
});
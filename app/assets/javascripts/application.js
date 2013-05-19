// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$(function() {
    
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        }
    }
    
    function showPosition(position) {
        $("#latitude").val(position.coords.latitude.toFixed(5));
        $("#longitude").val(position.coords.longitude.toFixed(5));
    }
    
    $("#localize_me").click(function() {
        getLocation();
    });
    
    $("#find").click(function() {
        
        var request = $.ajax({
            url: "/app/findCaches",
            type: "POST",
            data: {
                latitude: $("#latitude").val(),
                longitude: $("#longitude").val()
            }
        });
         
        request.done(function(msg) {
            console.log(msg);
        });
        
    });
    
})
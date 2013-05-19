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
                longitude: $("#longitude").val(),
                radius: $("#radius").val()
            }
        });
         
        request.done(function(msg) {
            if(1 == msg.status) {
                $("#content").html("<table class='table table-bordered'><tr><td>#</td><td>nazwa</td><td>dystans</td></tr></table>");
                $.each(msg.caches, function(key, value) {
                console.log(value)
                    $("table").append("<tr><td>" + (key + 1) + "</td><td><a href='http://m.opencaching.pl/googlemaps.php?wp=" + value.code + "'>" + value.name + "</a></td><td>" + (value.geo_near_distance * 111.12).toFixed(1) + "</td></tr>");
                });
            } else {
                alert("Wystąpił błąd!");
            }
        });
        
    });
    
})
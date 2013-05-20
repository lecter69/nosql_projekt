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

    $(document).ajaxStart(function() {
    
        $("#spinner").show();
        
    });
    
    $(document).ajaxStop(function() {
    
        $("#spinner").hide();
        
    });

    function showPosition(position) {
    
        $(document).trigger("ajaxStop");
        $("#latitude").val(position.coords.latitude.toFixed(5));
        $("#longitude").val(position.coords.longitude.toFixed(5));
        
    }
    
    $("#localize_me").click(function() {
    
        $(document).trigger("ajaxStart");
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        
    });
    
    function validate() {

        var latitude, longitude, radius, result;
        
        $(".text-error").html("");
        
        result = true;
        
        latitude = $("#latitude").val();
        longitude = $("#longitude").val();
        radius = $("#radius").val();
        
        if (null == latitude.match(/^\d{1,2}.\d+$/)) {
            result = false;
            $("#latitude").parent().children(".text-error").eq(0).html("Zły format współrzędnych:");
        }
        
        if (null == longitude.match(/^\d{1,2}.\d+$/)) {
            result = false;
            $("#longitude").parent().children(".text-error").eq(0).html("Zły format współrzędnych:");
        }
        
        if (null == radius.match(/^\d+$/)) {
            result = false;
            $("#radius").parent().children(".text-error").eq(0).html("Wybierz promień:");
        }
        
        return result;
        
    }
    
    $("#find").click(function() {
    
        if(false == validate()) {
            return;
        }
        
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
                $("#results").html("<table class='table table-bordered'><tr><td>#</td><td>Nazwa</td><td>Dystans</td></tr></table>");
                $.each(msg.caches, function(key, value) {
                    $("table").append("<tr><td>" + (key + 1) + "</td><td><a href='http://m.opencaching.pl/googlemaps.php?wp=" + value.code + "'>" + value.name + "</a></td><td>" + (value.geo_near_distance * 111.12).toFixed(1) + "km</td></tr>");
                });
            } else {
                alert("Wystąpił błąd!");
            }
        });
        
    });
    
})
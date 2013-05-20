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
    
    function deg2rad (angle) {
        return angle / 180 * Math.PI; // angle * .017453292519943295;
    }

    function rad2deg (angle) {
        return angle / Math.PI * 180; // angle * 57.29577951308232;
    }
    
    function direction(coordsA_lat, coordsA_lon, coordsB_lat, coordsB_lon) {
    
        var ilat1, ilat2, ilon1, ilon2, lat1, lon1, lat2, lon2, temp1, temp2, direction;

        ilat1 = 0.5 + coordsA_lat * 360000;
        ilat2 = 0.5 + coordsB_lat * 360000;
        ilon1 = 0.5 + coordsA_lon * 360000;
        ilon2 = 0.5 + coordsB_lon * 360000;

        lat1 = deg2rad(coordsA_lat);
        lon1 = deg2rad(coordsA_lon);
        lat2 = deg2rad(coordsB_lat);
        lon2 = deg2rad(coordsB_lon);

        if(ilon1 == ilon2 && ilat1 > ilat2) {
            result = 180;
        } else {
            temp1 = Math.acos(Math.sin(lat2) * Math.sin(lat1) + Math.cos(lat2) * Math.cos(lat1) * Math.cos(lon2 - lon1));
            temp2 = Math.asin(Math.cos(lat2) * Math.sin(lon2 - lon1) / Math.sin(temp1));
            result = rad2deg(temp2);

            if((ilat2 > ilat1) && (ilon2 > ilon1)){
            }else if ((ilat2 < ilat1) && (ilon2 < ilon1)){
                result = 180 - result;
            }else if ((ilat2 < ilat1) && (ilon2 > ilon1)){
                result = 180 - result;
            }else if ((ilat2 > ilat1) && (ilon2 < ilon1)){
                result += 360;
            }
        }

        direction = result.toFixed(1);

        if((direction >= 337.5 && direction < 360) || (direction >= 0 && direction < 22.5)) {
            direction = "N";
        } else if(direction >= 22.5 && direction < 67.5) {
            direction = "NE";
        } else if(direction >= 67.5 && direction < 112.5) {
            direction = "E";
        } else if(direction >= 112.5 && direction < 157.5) {
            direction = "SE";
        } else if(direction >= 157.5 && direction < 202.5) {
            direction = "S";
        } else if(direction >= 202.5 && direction < 247.5) {
            direction = "SW";
        } else if(direction >= 247.5 && direction < 292.5) {
            direction = "W";
        } else if(direction >= 292.5 && direction < 337.5) {
            direction = "NW";
        }
                
        return direction;
        
    }

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
    
        var latitude, longitude;
        
        latitude = $("#latitude").val();
        longitude = $("#longitude").val();
    
        if(false == validate()) {
            return;
        }
        
        var request = $.ajax({
            url: "/app/findCaches",
            type: "POST",
            data: {
                latitude: latitude,
                longitude: longitude,
                radius: $("#radius").val()
            }
        });
         
        request.done(function(msg) {
            if(1 == msg.status) {
                $("#results").html("<table class='table table-bordered'><tr><th>#</th><th>Nazwa</th><th>Dystans</th></tr></table>");
                $.each(msg.caches, function(key, value) {
                    $("table").append("<tr><td>" + (key + 1) + "</td><td><a href='http://m.opencaching.pl/googlemaps.php?wp=" 
                        + value.code + "'>" + value.name + "</a></td><td class='col3'>" + direction(latitude, longitude, value.location[0], value.location[1]) 
                        + " " + (value.geo_near_distance * 111.12).toFixed(1) + "km</td></tr>");
                });
            } else {
                alert("Wystąpił błąd!");
            }
        });
        
    });
    
})
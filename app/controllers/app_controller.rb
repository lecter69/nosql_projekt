class AppController < ApplicationController

  def index
  
  end
  
  def findCaches

    latitude = params[:latitude]
    longitude = params[:longitude]
    radius = params[:radius]

    condition  = /^\d+$/ =~ radius && /^\d{1,2}.\d+$/ =~ latitude && /^\d{1,2}.\d+$/ =~ longitude
    if not condition 
      render :json => { status: 0 }
      return
    end

    caches = Cache.geo_near([latitude.to_f, longitude.to_f]).max_distance(radius.to_i / 111.12)
    
    render :json => { status: 1, caches: caches }
    
  end
  
end

class AppController < ApplicationController

  def index
  
  end
  
  def findCaches

    latitude = params[:latitude]
    longitude = params[:longitude]
    radius = params[:radius]

    #caches = Cache.where(:location.near => [latitude.to_f, longitude.to_f]).limit(limit.to_i)
    caches = Cache.geo_near([latitude.to_f, longitude.to_f]).max_distance(radius.to_i/111.12)
    
    render :json => { status: 1, caches: caches }
    
  end
  
end

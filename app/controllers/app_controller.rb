require "mongo"
require "uri"
include Mongo

class AppController < ApplicationController

  def index
  
  end
  
  def findCaches
  
    #mongodb = MongoClient.new("localhost", 27017, w: 1, wtimeout: 200, j: true).db("test")
    
    #caches_collection = mongodb.collection("caches")

    latitude = params[:latitude]
    longitute = params[:longitute]
    
    render :json => { test: latitude }
    
  end
  
end

class Cache

  include Mongoid::Document
  field :code, type: String
  field :name, type: String
  field :type, type: String
  field :status, type: String
  field :location, type: Array
 
  index({ location: '2d' }, { background: true })
 
end
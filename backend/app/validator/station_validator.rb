# app/validators/station_validator.rb
class StationValidator
  include ActiveModel::Model

  attr_accessor :station_id, :latitude, :longitude, :elevation,
                :station_name, :station_network, :timezone

  validates :station_id, presence: true
  validates :latitude, :longitude, numericality: true, allow_nil: true
  validates :elevation, numericality: true, allow_nil: true
end

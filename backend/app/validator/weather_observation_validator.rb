# app/validators/weather_observation_validator.rb
class WeatherObservationValidator
  include ActiveModel::Model

  attr_accessor :timestamp, :temperature, :wind_x, :wind_y,
                :dewpoint, :pressure, :precip

  validates :timestamp, presence: true
  validates :temperature, :dewpoint, :pressure, :precip,
            numericality: true, allow_nil: true
  validates :wind_x, :wind_y,
            numericality: true, allow_nil: true
end

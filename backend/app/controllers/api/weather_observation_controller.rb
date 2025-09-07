require 'net/http' 
require 'json'

module Api
  class WeatherObservationController < ApplicationController
    def weatherObservation
      station_id = params[:station]

      if station_id.blank?
        return render json: { error: "Station parameter is required" }, status: :bad_request
      end

      uri = URI("https://sfc.windbornesystems.com/historical_weather?station=#{station_id}")
      response = Net::HTTP.get_response(uri)

      if response.is_a?(Net::HTTPSuccess)
        data = JSON.parse(response.body)

        # error handling
        valid_points = data["points"].select do |point|
          validator = WeatherObservationValidator.new(point.symbolize_keys)
          validator.valid?
        end

        corrupted_count = data["points"].size - valid_points.size

        render json: {
          station: data["station"],
          points: valid_points,
          corrupted_records: corrupted_count,
          start_date: data["start_date"],
          end_date: data["end_date"]
        }
      else
        render json: { error: "#{response.code} - #{response.message}" },
               status: response.code.to_i
      end
    end
  end
end

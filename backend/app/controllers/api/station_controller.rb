require 'net/http' 
require 'json'

module Api
    class StationController < ApplicationController
      def station
        uri = URI("#{ENV["WINDBORNE_API"]}/stations")
        response = Net::HTTP.get_response(uri)
  
        if response.is_a?(Net::HTTPSuccess)
          stations = JSON.parse(response.body)
  
        # error handle
          valid_stations = stations.select do |s|
            validator = StationValidator.new(s.symbolize_keys)
            validator.valid?
          end
  
          corrupted_count = stations.size - valid_stations.size
  
          render json: {
            data: valid_stations,
            corrupted_records: corrupted_count
          }
        else
          render json: { error: "#{response.code} - #{response.message}" },
                 status: response.code.to_i
        end
      end
    end
  end
  
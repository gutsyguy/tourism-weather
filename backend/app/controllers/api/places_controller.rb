require "net/http"
require "uri"
require "json"

module Api
  class PlacesController < ApplicationController
    def place
      uri = URI.parse("#{ENV["GOOGLE_PLACES_URL"]}/v1/places:searchText")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Post.new(uri.request_uri)
      request["Content-Type"] = "application/json"
      request["X-Goog-FieldMask"] = ENV["X_GOOG_FIELDMASK"] 
      request["X-Goog-Api-Key"] = ENV["GOOGLE_PLACES_API_KEY"] 

      text_query = params[:textQuery].presence || "Tourist attractions"
      request.body = { textQuery: text_query }.to_json

      response = http.request(request)

      if response.is_a?(Net::HTTPSuccess)
        parsed = JSON.parse(response.body)

        places = parsed["places"] || []

        valid_places = places.select do |place|
          validator = PlacesValidator.new(
            formatted_address: place["formattedAddress"],
            display_name: place.dig("displayName", "text"),
            language_code: place.dig("displayName", "languageCode"),
            price_level: place["priceLevel"],
            rating: place["rating"],
            user_ratings_total: place["userRatingsTotal"]
          )
          validator.valid?
        end
        
        corrupted_count = places.size - valid_places.size
        
        render json: { data: { places: valid_places }, corrupted_records: corrupted_count }
      else
        render json: { error: "#{response.code} - #{response.message}", body: response.body },
               status: response.code.to_i
      end
    end
  end
end

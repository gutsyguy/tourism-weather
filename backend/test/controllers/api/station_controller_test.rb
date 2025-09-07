require 'test_helper'
require 'ostruct'

module Api
  class StationControllerTest < ActionDispatch::IntegrationTest
    test "returns valid stations and filters corrupted ones" do
      fake_response = OpenStruct.new(
        is_a?: Net::HTTPSuccess,
        body: [
          { "station_id" => "CYKD", "latitude" => 60.0, "longitude" => -120.0, "station_name" => "KUGAARUK" },
          { "station_id" => nil, "latitude" => nil, "longitude" => nil } # corrupted
        ].to_json
      )

      Net::HTTP.stub(:get_response, fake_response) do
        get api_station_url
        assert_response :success

        body = JSON.parse(response.body)
        assert_equal 1, body["data"].size
        assert_equal "CYKD", body["data"].first["station_id"]
      end
    end
  end
end

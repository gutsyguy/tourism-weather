require "test_helper"
require "ostruct"

class Api::StationControllerTest < ActionDispatch::IntegrationTest
  test "returns valid stations and filters corrupted ones" do
    mock_data = [
      {
        "station_id" => "EHAK",
        "latitude" => 55.39917,
        "longitude" => 3.81028,
        "elevation" => 50.0,
        "station_name" => "A12-CPP HELIPAD OIL PLATFORM",
        "station_network" => "NL__ASOS",
        "timezone" => "Europe/London"
      },
      { "station_id" => nil } # corrupted
    ]

    fake_response = OpenStruct.new(
      is_a?: true,
      body: mock_data.to_json
    )

    Net::HTTP.stub :get_response, fake_response do
      get "/api/station"

      assert_response :success
      body = JSON.parse(response.body)
      assert_equal 1, body["data"].length
      assert_equal "EHAK", body["data"].first["station_id"]
    end
  end
end

require "test_helper"

class Api::StationControllerTest < ActionDispatch::IntegrationTest
  test "returns valid stations and filters corrupted ones" do
    mock_data = [
      { "station_id" => "EHAK", "latitude" => 55.39, "longitude" => 3.81, "timezone" => "Europe/London" },
      { "latitude" => 40.0 } # corrupted (missing station_id)
    ]

    Net::HTTP.stub :get_response, OpenStruct.new(is_a?: true, body: mock_data.to_json) do
      get "/api/stations"

      assert_response :success
      body = JSON.parse(response.body)
      assert_equal 1, body["data"].length
      assert_equal 1, body["corrupted_records"]
    end
  end
end

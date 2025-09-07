require "test_helper"
require "ostruct"

class Api::WeatherObservationControllerTest < ActionDispatch::IntegrationTest
  test "returns valid points and filters corrupted ones" do
    mock_data = {
      "station" => "EHAK",
      "points" => [
        { "timestamp" => "2025-08-29 23:25", "temperature" => 62.6, "precip" => 0.0 },
        { "temperature" => "bad_data" } # corrupted
      ],
      "start_date" => "2025-08-29T22:59:17.335225",
      "end_date" => "2025-09-05T22:59:17.335225"
    }

    fake_response = OpenStruct.new(
      is_a?: true,
      body: mock_data.to_json
    )

    Net::HTTP.stub :get_response, fake_response do
      get "/api/stations/EHAK/weather"

      assert_response :success
      body = JSON.parse(response.body)
      assert_equal "EHAK", body["station"]
      assert_equal 1, body["points"].length
      assert_equal 1, body["corrupted_records"]
    end
  end

  test "returns error if station param is missing" do
    get "/api/stations//weather"
    assert_response :bad_request
  end
end

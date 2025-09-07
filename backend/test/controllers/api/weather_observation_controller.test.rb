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

    uri = URI("https://sfc.windbornesystems.com/historical_weather?station=EHAK")
    mock = Minitest::Mock.new
    mock.expect :call, fake_response, [uri]

    # swap out Net::HTTP.get_response temporarily
    Net::HTTP.singleton_class.send(:alias_method, :real_get_response, :get_response)
    Net::HTTP.define_singleton_method(:get_response, &mock.method(:call))

    get "/api/stations/EHAK/weather"

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal "EHAK", body["station"]
    assert_equal 1, body["points"].length  # one valid, one filtered
    assert_equal 1, body["corrupted_records"]

    mock.verify
  ensure
    # restore Net::HTTP.get_response so other tests are unaffected
    Net::HTTP.singleton_class.send(:alias_method, :get_response, :real_get_response)
  end

  test "returns error if station param is missing" do
    get "/api/stations//weather"
    assert_response :bad_request
  end
end

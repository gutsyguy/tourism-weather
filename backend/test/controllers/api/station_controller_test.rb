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

    mock = Minitest::Mock.new
    mock.expect :call, fake_response, [URI("https://sfc.windbornesystems.com/stations")]

    Net::HTTP.singleton_class.send(:alias_method, :real_get_response, :get_response)
    Net::HTTP.define_singleton_method(:get_response, &mock.method(:call))

    get "/api/station"

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal 1, body["data"].length
    assert_equal "EHAK", body["data"].first["station_id"]

    mock.verify
  ensure
    # restore original method so other tests aren’t broken
    Net::HTTP.singleton_class.send(:alias_method, :get_response, :real_get_response)
  end
end

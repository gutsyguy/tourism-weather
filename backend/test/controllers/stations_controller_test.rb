require "test_helper"

class StationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @station = Station.create!(name: "Test Station")
  end

  test "should get index" do
    get stations_url, as: :json   # <--- tell Rails to request JSON
    assert_response :success
  end

  test "should get show" do
    get station_url(@station), as: :json   # <--- request JSON
    assert_response :success
  end
end

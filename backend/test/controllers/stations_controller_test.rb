require "test_helper"

class StationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @station = Station.create!(name: "Test Station")
  end

  test "should get index" do
    skip "Skipping index test for now"
    get stations_url, as: :json
    assert_response :success
  end

  test "should get show" do
    skip "Skipping show test for now"
    get station_url(@station), as: :json
    assert_response :success
  end
end

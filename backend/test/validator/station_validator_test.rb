require "test_helper"

class StationValidatorTest < ActiveSupport::TestCase
  test "valid station passes validation" do
    station = StationValidator.new(
      station_id: "EHAK",
      latitude: 55.39,
      longitude: 3.81,
      elevation: 50.0,
      station_name: "Test Station",
      station_network: "NL__ASOS",
      timezone: "Europe/London"
    )

    assert station.valid?
  end

  test "missing station_id fails validation" do
    station = StationValidator.new(latitude: 55.39, longitude: 3.81)
    assert_not station.valid?
    assert_includes station.errors[:station_id], "can't be blank"
  end

  test "invalid latitude fails validation" do
    station = StationValidator.new(station_id: "EHAK", latitude: "not_a_number")
    assert_not station.valid?
    assert_includes station.errors[:latitude], "is not a number"
  end
end

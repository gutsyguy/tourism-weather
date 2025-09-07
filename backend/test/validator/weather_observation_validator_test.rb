require "test_helper"

class WeatherObservationValidatorTest < ActiveSupport::TestCase
  test "valid observation passes validation" do
    observation = WeatherObservationValidator.new(
      timestamp: "2025-08-29 23:25",
      temperature: 62.6,
      wind_x: 12.21,
      wind_y: -4.44,
      dewpoint: 60.8,
      pressure: 1008.5,
      precip: 0.0
    )

    assert observation.valid?
  end

  test "missing timestamp fails validation" do
    observation = WeatherObservationValidator.new(temperature: 50.0)
    assert_not observation.valid?
    assert_includes observation.errors[:timestamp], "can't be blank"
  end

  test "non-numeric temperature fails validation" do
    observation = WeatherObservationValidator.new(timestamp: Time.now, temperature: "hot")
    assert_not observation.valid?
    assert_includes observation.errors[:temperature], "is not a number"
  end
end

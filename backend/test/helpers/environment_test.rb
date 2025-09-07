require "test_helper"

class EnvironmentTest < ActiveSupport::TestCase
  test "environment variables are set for testing" do
    assert_not_nil ENV["GOOGLE_PLACES_URL"], "GOOGLE_PLACES_URL should be set"
    assert_not_nil ENV["X_GOOG-FIELDMASK"], "X_GOOG-FIELDMASK should be set"
    assert_not_nil ENV["GOOGLE_PLACES_API_KEY"], "GOOGLE_PLACES_API_KEY should be set"
    assert_not_nil ENV["WINDBORNE_API"], "WINDBORNE_API should be set"
    
    assert_equal "https://places.googleapis.com", ENV["GOOGLE_PLACES_URL"]
    assert_equal "places.displayName,places.formattedAddress,places.priceLevel", ENV["X_GOOG-FIELDMASK"]
    assert_not_empty ENV["GOOGLE_PLACES_API_KEY"], "GOOGLE_PLACES_API_KEY should not be empty"
    assert_equal "https://sfc.windbornesystems.com", ENV["WINDBORNE_API"]
  end
end

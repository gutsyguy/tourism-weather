ENV["RAILS_ENV"] ||= "test"

# Set fallback environment variables for testing if not set elsewhere
ENV["GOOGLE_PLACES_URL"] ||= "https://places.googleapis.com"
ENV["X_GOOG-FIELDMASK"] ||= "places.displayName,places.formattedAddress,places.priceLevel"
ENV["GOOGLE_PLACES_API_KEY"] ||= "test_api_key_for_testing"
ENV["WINDBORNE_API"] ||= "https://sfc.windbornesystems.com"

require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

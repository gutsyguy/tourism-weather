# app/validators/place_validator.rb
class PlacesValidator
  include ActiveModel::Model

  attr_accessor :formatted_address, :display_name, :language_code,
                :price_level, :rating, :user_ratings_total

  # Required fields
  validates :formatted_address, presence: true
  validates :display_name, presence: true

  # Optional fields with type checks
  validates :language_code, allow_nil: true, format: { with: /\A[a-z]{2}(-[A-Z]{2})?\z/,
                                                       message: "must be a valid language code (e.g. 'en' or 'en-US')" }

  validates :price_level, numericality: { only_integer: true,
                                          greater_than_or_equal_to: 0,
                                          less_than_or_equal_to: 5 },
                          allow_nil: true

  validates :rating, numericality: { greater_than_or_equal_to: 0,
                                     less_than_or_equal_to: 5 },
                     allow_nil: true

  validates :user_ratings_total, numericality: { only_integer: true,
                                                 greater_than_or_equal_to: 0 },
                                 allow_nil: true
end

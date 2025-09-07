ActiveRecord::Schema[7.2].define(version: 1) do
    create_table :places do |t|
      t.string :place_id, index: { unique: true } # optional if you want to map to Google Place ID
      t.string :name, null: false                 # maps to displayName.text
      t.string :language_code                     # maps to displayName.languageCode
      t.string :formatted_address, null: false    # maps to formattedAddress
  
      # Optional fields if you expand field mask later (categories, ratings, etc.)
      t.float  :price_level
      t.float  :rating
      t.integer :user_ratings_total
  
      t.timestamps
    end
  end
  
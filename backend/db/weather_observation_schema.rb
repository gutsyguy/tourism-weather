ActiveRecord::Schema[7.2].define(version: 1) do
  create_table :weather_observations do |t|
    t.references :station, null: false, foreign_key: true

    # API fields
    t.datetime :observed_at, null: false, index: true  # maps to "timestamp"
    t.float :temperature
    t.float :wind_x
    t.float :wind_y
    t.float :dewpoint
    t.float :pressure
    t.float :precip

    # Extra metadata
    t.boolean :data_corrupted, default: false

    t.timestamps
  end
end

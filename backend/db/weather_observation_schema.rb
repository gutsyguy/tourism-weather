
ActiveRecord::Schema[7.2].define(version: 1) do
  create_table :weather_observations do |t|
    t.references :station, null: false, foreign_key: true
    t.datetime :observed_at, null: false, index: true
    t.float :temperature
    t.float :wind_speed
    t.float :precipitation
    t.string :condition   # e.g., "clear", "snow", "rain"
    t.boolean :data_corrupted, default: false
    t.timestamps
  end
end

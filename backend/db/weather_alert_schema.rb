ActiveRecord::Schema[7.1].define(version: 1) do   
create_table :weather_alerts do |t|
    t.references :station, null: false, foreign_key: true
    t.string :alert_type, null: false  # "temp_spike", "wind_peak", "rainfall"
    t.datetime :triggered_at, null: false
    t.float :value   # e.g., 42°C for spike
    t.timestamps
  end
end
  
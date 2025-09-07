ActiveRecord::Schema[7.1].define(version: 1) do    
  create_table :stations do |t|
    t.string :station_id, null: false, index: { unique: true }  # from API
    t.float :latitude
    t.float :longitude
    t.float :elevation
    t.string :station_name
    t.string :station_network
    t.string :timezone
    t.timestamps
  end
end

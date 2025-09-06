ActiveRecord::Schema[7.1].define(version: 1) do    
  create_table :stations do |t|
    t.string :station_id, null: false, index: { unique: true }  # from API
    t.string :name
    t.string :city
    t.string :state
    t.string :country
    t.string :timezone
    t.float :latitude
    t.float :longitude
    t.timestamps
  end
end

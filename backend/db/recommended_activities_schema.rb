ActiveRecord::Schema[7.1].define(version: 1) do      
    create_table :activity_recommendations do |t|
    t.references :station, null: false, foreign_key: true
    t.string :name, null: false
    t.string :category   # e.g., "museum", "hiking", "skiing"
    t.boolean :indoor, default: false
    t.boolean :outdoor, default: true
    t.string :source_api # "Google Places", "TripAdvisor"
    t.string :external_id # ID from external API
    t.string :url        # link to activity
    t.timestamps
    end
end

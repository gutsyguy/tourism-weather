Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # Stations API
  get 'api/station', to: 'api/station#station'
  get 'api/stations/:station/weather', to: 'api/weather_observation#weatherObservation'

  # Places API
  post 'api/places/place', to: 'api/places#place'
  get 'api/places', to: 'api/places#place'

  # Optional: root path
  # root "posts#index"
end

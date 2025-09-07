# Weather Tourist App - Backend

A Rails API backend for the Weather Tourist App that provides weather data and tourist attraction information.

## Prerequisites

* Ruby 3.4.5
* PostgreSQL
* Bundler

## Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Set up the database:
   ```bash
   bin/rails db:create
   bin/rails db:migrate
   ```

4. Configure environment variables:
   ```bash
   cp config/environment_variables.yml.example config/environment_variables.yml
   ```
   
   Edit `config/environment_variables.yml` and add your actual API keys:
   - Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
   - The Windborne API is publicly accessible

## Environment Variables

The application requires the following environment variables:

- `GOOGLE_PLACES_URL`: Google Places API base URL (default: https://places.googleapis.com)
- `X_GOOG-FIELDMASK`: Google Places API field mask for response fields
- `GOOGLE_PLACES_API_KEY`: Your Google Places API key
- `WINDBORNE_API`: Windborne weather API base URL (default: https://sfc.windbornesystems.com)

## Running the Application

Start the Rails server:
```bash
bin/rails server
```

The API will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/station` - Get weather stations
- `GET /api/stations/:station/weather` - Get weather observations for a station
- `POST /api/places/place` - Search for tourist attractions

## Testing

Run the test suite:
```bash
bin/rails test
```

The tests include fallback environment variables for testing purposes.

## Security Notes

- Never commit your actual API keys to version control
- The `config/environment_variables.yml` file is gitignored
- Use the example file as a template for your local configuration

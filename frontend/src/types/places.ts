interface PlacesResponse {
  data: {
    places: Place[];
  };
  corrupted_records: number;
}

interface Place {
  formattedAddress: string;
  displayName: DisplayName;
}

interface DisplayName {
  text: string;
  languageCode: string;
}

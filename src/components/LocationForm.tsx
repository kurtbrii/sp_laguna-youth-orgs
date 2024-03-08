import React from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

interface SearchPlacesProps {
  handleChange: (value: string) => void;
  string: string;
}

const SearchPlaces: React.FC<SearchPlacesProps> = ({
  handleChange,
  string,
}) => {
  const handleLocationChange = (value: string) => {
    handleChange(value);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Autocomplete
      className="h-12 w-1/2 rounded border p-2 shadow"
      onLoad={(autocomplete) => {
        console.log("Autocomplete loaded:", autocomplete);
      }}
      onPlaceChanged={() => {
        const selectedPlace = (
          document.getElementById("autocomplete") as HTMLInputElement
        ).value;
        handleLocationChange(selectedPlace);
      }}
      options={{
        componentRestrictions: { country: "PH" },
      }}
    >
      <input
        className="h-full w-full p-2"
        id="autocomplete"
        type="text"
        placeholder="Search for places"
        value={string}
        onChange={(e) => handleLocationChange(e.target.value)}
      />
    </Autocomplete>
  );
};

export default SearchPlaces;

import React from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { UseFormRegister } from "react-hook-form";

interface EventProps {
  name: "";
  organized_by: string;
  createdAt: string;
  details: string;
  location: string;
  organizationId: string;
  date: string;
  partners: string[];
  images: string[];
}
interface SearchPlacesProps {
  handleChange: (value: string) => void;
  string: string;
  register: UseFormRegister<EventProps>;
}

const SearchPlaces: React.FC<SearchPlacesProps> = ({
  handleChange,
  string,
  register,
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
        {...register("location")}
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

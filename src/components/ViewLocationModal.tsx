import React, { useState } from "react";
import { api } from "~/utils/api";
interface LocationProps {
  location: string;
}

const ViewLocationModal = ({ location }: LocationProps) => {
  return (
    <iframe
      className="h-full w-full"
      title="Google Maps"
      style={{ border: 0 }}
      // allowFullScreen
      src={`https://www.google.com/maps/embed/v1/place?q=${location}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
    ></iframe>
  );
};

export default ViewLocationModal;

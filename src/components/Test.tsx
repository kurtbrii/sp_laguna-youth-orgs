import React, { useState } from "react";
import { api } from "~/utils/api";

const Test = () => {
  const [location, setLocation] = useState("");

  const showMap = () => {
    // Replace this with your desired location or fetch it dynamically
    const locationValue = "JMR, San Mateo, San Pablo City, Laguna";
    setLocation(locationValue);
  };

  return (
    <div>
      <p onClick={showMap}>Click to view location</p>

      {/* <button>keyy {encodedApiKey}</button> */}

      {location && (
        <div>
          <iframe
            title="Google Maps"
            width="600"
            height="450"
            style={{ border: 0 }}
            // allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?q=${location}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Test;

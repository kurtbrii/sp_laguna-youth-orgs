import React from "react";

import PulseLoader from "react-spinners/PulseLoader";
const LoadingBar = () => {
  return (
    <div className="flex h-72 items-center justify-center gap-4">
      <PulseLoader
        color="var(--secondary)"
        loading={true}
        speedMultiplier={1}
        // cssOverride={override}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingBar;

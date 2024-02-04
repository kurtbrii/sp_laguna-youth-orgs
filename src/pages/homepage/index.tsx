import React from "react";
import NavBar from "~/components/navbar";

const index = () => {
  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <NavBar />
      <div className="mx-10 my-4 flex h-12 flex-col justify-between font-custom-lexend ">
        <h1 className="font-custom-epilogue mb-2 h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
          Recent Events
        </h1>
      </div>
      {/* <button onClick={() => handleFetchOrganizations()}>button</button> */}
    </div>
  );
};

export default index;

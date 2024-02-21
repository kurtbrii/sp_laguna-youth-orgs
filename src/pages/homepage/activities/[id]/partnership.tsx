import React from "react";
import Navbar from "~/components/navbar";

const Partnership = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          Partnership
        </p>
      </section>
    </div>
  );
};

export default Partnership;

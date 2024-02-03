import React from "react";
import vol2 from "../../../assets/vol2.png";
import Image from "next/image";
import Providers from "~/components/providers";

const login = () => {
  return (
    <section className="flex h-screen font-custom-lexend ">
      {/* <!-- Left part with image --> */}
      <section className="relative w-3/5 flex-shrink-0 bg-customBlack-100">
        {/* Your image goes here */}
        <Image
          className="h-full w-full object-cover opacity-35"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={vol2}
          alt="Volunteer Image"
        />
        {/* Centered div */}
        <div className=" absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center text-white">
          <h1 className="mb-3 font-custom-changa-one text-4xl">
            Laguna Youth Organizations Hub
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            eget placerat nulla. Duis eget lacinia lacus. Duis volutpat metus a
            felis volutpat elementum. Integer hendrerit sit
          </p>
        </div>
      </section>

      {/* <!-- Right part with login page --> */}
      <section className="flex w-2/5 flex-shrink-0 flex-col items-center justify-center gap-7 p-8">
        <h1 className="mb-3 bg-gradient-to-r from-primary  to-secondary bg-clip-text font-custom-changa-one text-4xl  font-extrabold text-transparent">
          Welcome Back!
        </h1>

        {/* providers */}
        <Providers />
        {/* <div>
          <h1 className="mb-3  text-4xl">Welcome Back!</h1>
          <h1 className="mb-3  text-4xl">Welcome Back!</h1>
        </div> */}
      </section>
    </section>
  );
};

export default login;

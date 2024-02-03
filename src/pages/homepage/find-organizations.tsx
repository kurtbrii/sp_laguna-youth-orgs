/* eslint-disable @next/next/no-img-element */
import React from "react";
import NavBar from "~/components/navbar";
import vol2 from "../../../assets/vol2.png";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import OrgCard from "~/components/orgcard";

const FindOrganizations = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <NavBar />
      <div className="mx-10 my-4 flex h-12 flex-col justify-between font-custom-lexend ">
        <h1 className="h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
          Find Organizations
        </h1>
      </div>

      <div className=" mx-4 mb-5 flex flex-wrap justify-center gap-5">
        <OrgCard />
      </div>
    </div>
  );
};

export default FindOrganizations;

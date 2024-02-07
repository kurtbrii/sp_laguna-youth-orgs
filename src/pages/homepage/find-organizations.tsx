import Navbar from "~/components/navbar";
import vol2 from "../../../assets/vol2.png";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import OrgCard from "~/components/orgCard";
import { api } from "~/utils/api";
import Link from "next/link";
import { NextPage } from "next";
import { type User } from "@prisma/client";

const FindOrganizations: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const organizations = api.organization.getOrganizations.useQuery({});

  const handleFetchOrganizations = () => {
    console.log(organizations.data);
  };

  type OrganizationProps = {
    id: string;
    orgName?: string;
    phoneNumber?: string;
    mission?: string;
    vision?: string;
    objectives?: string;
    user?: User;
    userId: string;
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <div className="mx-10 my-4 flex h-12 flex-col justify-between font-custom-lexend ">
        <h1 className="mb-2 h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text font-custom-epilogue text-2xl font-extrabold text-transparent ">
          Find Organizations
        </h1>
      </div>
      <div className=" mx-4 mb-5 flex flex-wrap justify-center gap-5">
        {organizations?.data?.map((organization: OrganizationProps) => (
          <OrgCard key={organization.id} organization={organization} />
        ))}
      </div>
      {/* <button onClick={() => handleFetchOrganizations()}>button</button> */}
    </div>
  );
};

export default FindOrganizations;

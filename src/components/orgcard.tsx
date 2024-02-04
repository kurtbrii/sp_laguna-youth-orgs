import React from "react";
import Image from "next/image";
import vol2 from "../../assets/vol2.png";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type User } from "@prisma/client";

type OrganizationProps = {
  organization: {
    id: string;
    orgName?: string;
    phoneNumber?: string;
    mission?: string;
    vision?: string;
    objectives?: string;
    user?: User;
    userId: string;
  };
};

const OrgCard = ({ organization }: OrganizationProps) => {
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    <Link
      href={`/folder/${organization.id}`}
      className="relative h-64 w-72  cursor-pointer  flex-col  overflow-hidden  rounded-md  object-fill shadow-2xl"
    >
      {/* <div className="h-2/5 bg-slate-600"> */}
      <Image src={vol2} className="h-2/5 w-full object-cover" alt="sunset " />
      <div className=" ml-4 mt-6 h-3/5">
        <p className="mb-3 text-sm font-bold">{organization.orgName}</p>
        <p className="text-sm">{organization.phoneNumber}</p>
        <p className="text-sm">Role: {organization.user.role}</p>
      </div>
      <Image
        className="absolute left-4 top-16 rounded-md"
        src={`${organization.user.image}`}
        height={60}
        width={60}
        alt="user image role"
      />
    </Link>
  );
};

export default OrgCard;
